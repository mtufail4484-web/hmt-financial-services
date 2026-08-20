"use client";

// ============================================================================
// LecturePlayer — YouTube IFrame API playback tracking + lecture completion.
// ----------------------------------------------------------------------------
// * The watch timer advances ONLY while the video is actually PLAYING and the
//   tab is visible (paused / buffering / hidden tab => time is NOT counted).
// * Watch time is written to Firestore as atomic `increment()` writes every
//   ~15s (and on pause/hide/unmount), so concurrent updates never overwrite.
// * Completion requires watchedSeconds >= threshold% of the real video
//   duration (duration comes from the YouTube API, not hardcoded values).
// * Completions are stamped with the threshold used at completion time and
//   are permanent (enforced by Firestore rules, not just this UI).
// * NOT cheat-proof: an account owner writing to Firestore directly can still
//   forge progress (see firestore.rules header). This is tamper-resistant.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { doc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  FLUSH_INTERVAL_SECONDS,
  formatClock,
  requiredSeconds,
  resumePositionSeconds,
} from "./portalLib";

let ytApiPromise = null;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        resolve(window.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.onerror = () => reject(new Error("YouTube API failed to load"));
      document.head.appendChild(s);
      setTimeout(() => {
        if (!window.YT?.Player) reject(new Error("YouTube API timeout"));
      }, 15000);
    });
  }
  return ytApiPromise;
}

export default function LecturePlayer({
  lecture,
  uid,
  progress, // progress doc data for this lecture (or null)
  threshold,
  isCompleted, // canonical: from completedVideos / progress.completed
  onCompleted,
  addToast,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const pendingRef = useRef(0); // earned-but-unwritten seconds
  const lastTickRef = useRef(0);
  const timerRef = useRef(null);
  const flushedOnExitRef = useRef(false);
  const durationSavedRef = useRef(Boolean(progress?.videoDurationSeconds));
  const watchedBase = progress?.watchedSeconds ?? 0;

  const [apiError, setApiError] = useState(false);
  const [duration, setDuration] = useState(
    progress?.videoDurationSeconds || lecture.fallbackDurationSeconds
  );
  const [pendingDisplay, setPendingDisplay] = useState(0);
  const [playerState, setPlayerState] = useState("loading"); // loading|ready|playing|paused|error
  const [completing, setCompleting] = useState(false);

  const durationRef = useRef(duration);
  const baseRef = useRef(watchedBase);
  const progressExistsRef = useRef(progress != null);

  // Keep refs in sync with props/state OUTSIDE render (react-hooks/refs).
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);
  useEffect(() => {
    baseRef.current = watchedBase;
  }, [watchedBase]);
  useEffect(() => {
    progressExistsRef.current = progress != null;
  }, [progress]);

  // ---- atomic, race-safe flush of earned watch seconds ---------------------
  const flush = useCallback(async () => {
    const cap = durationRef.current || lecture.fallbackDurationSeconds;
    const maxAllowed = Math.max(0, cap - baseRef.current - Math.floor(pendingRef.current));
    let whole = Math.floor(pendingRef.current);
    if (whole < 1) return;
    if (cap && whole > maxAllowed) whole = maxAllowed; // never credit >100%
    if (whole < 1) {
      pendingRef.current = Math.min(pendingRef.current, cap - baseRef.current);
      return;
    }
    pendingRef.current -= whole;
    const ref = doc(db, "students", uid, "progress", lecture.id);
    try {
      if (!progressExistsRef.current) {
        await setDoc(ref, {
          watchedSeconds: whole,
          completed: false,
          ...(durationRef.current
            ? { videoDurationSeconds: durationRef.current }
            : {}),
          updatedAt: serverTimestamp(),
        });
        progressExistsRef.current = true;
        durationSavedRef.current = Boolean(durationRef.current);
      } else {
        const patch = {
          watchedSeconds: increment(whole),
          updatedAt: serverTimestamp(),
        };
        if (durationRef.current && !durationSavedRef.current) {
          patch.videoDurationSeconds = durationRef.current; // absent -> set once
          durationSavedRef.current = true;
        }
        await updateDoc(ref, patch);
      }
    } catch (err) {
      pendingRef.current += whole; // re-queue on failure; never lose time
      console.error("watch-time flush failed", err);
      addToast({
        kind: "warning",
        message: "Could not save just now — progress will retry automatically.",
      });
    }
  }, [uid, lecture.id, lecture.fallbackDurationSeconds, addToast]);

  // ---- player lifecycle ------------------------------------------------------
  useEffect(() => {
    let destroyed = false;
    flushedOnExitRef.current = false;
    loadYouTubeApi()
      .then((YT) => {
        if (destroyed || !containerRef.current) return;
        playerRef.current = new YT.Player(containerRef.current, {
          videoId: lecture.videoId,
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
          events: {
            onReady: (e) => {
              if (destroyed) return;
              const d = e.target.getDuration();
              if (d > 0) setDuration(d);
              setPlayerState("ready");
              const resumeAt = resumePositionSeconds(baseRef.current, d || 0);
              if (resumeAt > 0) e.target.seekTo(resumeAt, true);
            },
            onStateChange: (e) => {
              if (destroyed) return;
              const YT_S = window.YT?.PlayerState;
              if (e.data === YT_S?.PLAYING) {
                const d = e.target.getDuration();
                if (d > 0 && d !== durationRef.current) setDuration(d);
                lastTickRef.current = performance.now();
                setPlayerState("playing");
              } else {
                // paused / buffering / ended / unstarted -> stop counting
                lastTickRef.current = 0;
                setPlayerState(e.data === YT_S?.ENDED ? "ready" : "paused");
                flush();
              }
            },
            onError: () => {
              setPlayerState("error");
              addToast({ kind: "error", message: "This video failed to load." });
            },
          },
        });
      })
      .catch(() => {
        if (!destroyed) {
          setApiError(true);
          setPlayerState("error");
        }
      });

    return () => {
      destroyed = true;
      if (timerRef.current) clearInterval(timerRef.current);
      flush(); // persist whatever was earned in this session
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [lecture.id, lecture.videoId, flush, addToast]);

  // ---- the watch clock: only advances while PLAYING and tab visible ----------
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (playerState !== "playing" || document.hidden) {
        lastTickRef.current = 0;
        return;
      }
      const now = performance.now();
      if (lastTickRef.current > 0) {
        const dt = (now - lastTickRef.current) / 1000;
        if (dt > 0 && dt < 2) {
          // credit this tick (skip impossible gaps -> no double counting)
          pendingRef.current += dt;
          setPendingDisplay(Math.floor(pendingRef.current));
          if (pendingRef.current >= FLUSH_INTERVAL_SECONDS) flush();
        }
      }
      lastTickRef.current = now;
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [playerState, flush]);

  // ---- stop counting when the tab is hidden; save on hide --------------------
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) {
        lastTickRef.current = 0;
        flush();
      }
    };
    const onPageHide = () => flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [flush]);

  const watched = watchedBase + pendingDisplay;
  const required = requiredSeconds(duration, threshold);
  const canComplete =
    !isCompleted && Number.isFinite(required) && required > 0 && duration > 0 && watched >= required;
  const progressPct = duration > 0 ? Math.min(100, Math.round((watched / duration) * 100)) : 0;

  const handleComplete = async () => {
    if (!canComplete || completing) return;
    setCompleting(true);
    try {
      await flush(); // ensure every earned second is on the server first
      const profileRef = doc(db, "students", uid);
      await updateDoc(profileRef, {
        completedVideos: arrayUnion(lecture.id), // append-only (rules-enforced)
        watchTimeMinutes: increment(Math.max(1, Math.round(duration / 60))),
      });
      const progressRef = doc(db, "students", uid, "progress", lecture.id);
      await setDoc(
        progressRef,
        {
          watchedSeconds: Math.max(watched, Math.floor(watched)),
          completed: true,
          completedAt: serverTimestamp(),
          completionThreshold: threshold,
          requiredSecondsAtCompletion: required,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      onCompleted(lecture.id);
    } catch (err) {
      console.error(err);
      addToast({ kind: "error", message: "Could not save completion — please try again." });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2.5 py-0.5 rounded">
            Watch-time tracking: {playerState === "playing" ? "● counting" : "paused"}
          </span>
          <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2.5 py-0.5 rounded">
            {threshold}% of video length required
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mt-2 mb-4">📹 {lecture.title}</h2>

        <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-xl overflow-hidden shadow-md">
          {apiError ? (
            <div className="absolute inset-0 grid place-items-center text-center text-gray-300 text-xs px-6">
              The video player could not load (network or YouTube blocked). Your saved
              progress is safe — try refreshing.
            </div>
          ) : (
            <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="mb-2">
          <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1">
            <span>
              Watched {formatClock(watched)} of {formatClock(duration)}
              {Number.isFinite(required) && !isCompleted && (
                <span className="text-gray-400"> · need {formatClock(required)} ({threshold}%)</span>
              )}
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isCompleted ? "bg-blue-500" : "bg-green-500"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="text-xs min-h-[1rem]">
            {isCompleted ? (
              <span className="text-blue-600 font-semibold">🎉 Completed — permanently recorded</span>
            ) : canComplete ? (
              <span className="text-green-600 font-medium">✅ Requirement met — you can mark it complete</span>
            ) : (
              <span className="text-gray-500">
                ⏳ {formatClock(Math.max(0, required - watched))} left to unlock completion
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted || !canComplete || completing}
            className={`font-semibold py-2 px-5 rounded-lg text-xs transition shadow-sm text-white shrink-0 ${
              isCompleted
                ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                : canComplete
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed opacity-60"
            }`}
          >
            {completing ? "Saving..." : isCompleted ? "✓ Completed" : "Mark Lecture as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
}
