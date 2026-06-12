"use client";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs } from "firebase/firestore";

// 📋 AAP KI PLAYLIST KI ORIGINAL VIDEOS
const HMT_PLAYLIST = [
  { id: "1", title: "Lecture 1: Introduction to Computer Basic", videoId: "cPpKY2oEd2s", duration: 85 },
  { id: "2", title: "Lecture 2: MS Word, MS Excel, and Power Point Basic", videoId: "FSQ1H1dcxYk", duration: 65 },
  { id: "3", title: "Lecture 3: Professional CV Design", videoId: "f4xVXgFSElo", duration: 76 },
];

export default function PortalPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [updatingVideo, setUpdatingVideo] = useState(false);
  
  // 📈 Total Registered Students Count State
  const [totalStudents, setTotalStudents] = useState(0);
  
  const [activeVideo, setActiveVideo] = useState(HMT_PLAYLIST[0]);
  
  // ⏱️ Security States
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const timerRef = useRef(null);

  const REQUIRED_TIME = 1800; // 30 Mins Lock

  const isVideoAlreadyCompleted = user?.completedVideos?.includes(activeVideo.id) || false;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // 🔍 Fetch Total Registered Students Function
  const fetchTotalStudentsCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      setTotalStudents(querySnapshot.size); // Returns total number of student documents
    } catch (err) {
      console.error("Error fetching student count:", err);
    }
  };

  // Fetch count on load and when a user logs in
  useEffect(() => {
    fetchTotalStudentsCount();
  }, [user]);

  // Tracking timer logic
  useEffect(() => {
    setSecondsWatched(0);
    setCanComplete(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (user && isVideoAlreadyCompleted) {
      setCanComplete(false);
      return;
    }

    if (user && !isVideoAlreadyCompleted) {
      timerRef.current = setInterval(() => {
        setSecondsWatched((prev) => {
          if (prev >= REQUIRED_TIME) {
            setCanComplete(true);
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeVideo, user, isVideoAlreadyCompleted]);

  // Handle Login & Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        await setDoc(doc(db, "students", currentUser.uid), {
          uid: currentUser.uid,
          name: fullName,
          email: email,
          watchTimeMinutes: 0,
          completedVideos: [],
          quizScore: 0,
          assignmentScore: 0,
          createdAt: new Date().toISOString()
        });

        alert("Account successfully created!");
        fetchTotalStudentsCount(); // Refresh count
        setIsSignUp(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;

        const docRef = doc(db, "students", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.completedVideos) data.completedVideos = [];
          setUser(data);
        } else {
          setError("User data not found in database.");
        }
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  // Watch Time Update Function
  const handleMarkAsWatched = async () => {
    if (!user) return;
    
    if (isVideoAlreadyCompleted) {
      alert("ℹ️ Aap yeh lecture pehle hi mukammal kar chuke hain.");
      return;
    }

    if (!canComplete) {
      alert("❌ Cheat Protection: Required time poora nahi hua!");
      return;
    }

    setUpdatingVideo(true);
    try {
      const newMinutes = user.watchTimeMinutes + activeVideo.duration;
      const docRef = doc(db, "students", user.uid);
      
      await updateDoc(docRef, { 
        watchTimeMinutes: newMinutes,
        completedVideos: arrayUnion(activeVideo.id)
      });
      
      setUser({ 
        ...user, 
        watchTimeMinutes: newMinutes, 
        completedVideos: [...(user.completedVideos || []), activeVideo.id] 
      });
      
      alert(`🎉 Verification Success! ${activeVideo.duration} minutes added.`);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingVideo(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* PROFILE & PROGRESS CARD */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit space-y-4">
            <div>
              <h1 className="text-xl font-bold text-blue-600 mb-1">HMT Academy</h1>
              <p className="text-gray-500 text-xs">Student: <span className="font-semibold text-gray-700">{user.name}</span></p>
            </div>

            {/* 📊 TOTAL REGISTERED STUDENTS DISPLAY */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl text-white shadow-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Total Portal Strength</p>
              <h3 className="text-2xl font-black mt-1">{totalStudents} <span className="text-sm font-normal">Students Registered</span></h3>
            </div>
            
            <div className="border-t border-gray-100 pt-3 space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Your Progress</h2>
              <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-xs text-blue-700 font-medium">⏱️ Total Watch Time</span>
                <span className="font-bold text-blue-700 text-sm">{user.watchTimeMinutes} mins</span>
              </div>
              
              <button 
                onClick={() => { auth.signOut(); setUser(null); }}
                className="w-full mt-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium py-2 rounded-lg transition text-xs border border-gray-200"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* MAIN VIDEO PLAYER COMPONENT */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2.5 py-0.5 rounded">Secure Tracking Mode (30 Mins Lock)</span>
              <h2 className="text-lg font-bold text-gray-800 mt-2 mb-4">📹 {activeVideo.title}</h2>
              
              <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-xl overflow-hidden shadow-md">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={"https://www.youtube.com/embed/" + activeVideo.videoId}
                  title={activeVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="text-xs">
                {isVideoAlreadyCompleted ? (
                  <span className="text-blue-600 font-semibold">🎉 You already completed this lecture!</span>
                ) : canComplete ? (
                  <span className="text-green-600 font-medium">✅ Verification Ready!</span>
                ) : (
                  <span className="text-gray-500">⏳ Required watch time left: <span className="font-bold text-red-500">{formatTime(REQUIRED_TIME - secondsWatched)}</span></span>
                )}
              </div>
              
              <button
                onClick={handleMarkAsWatched}
                disabled={isVideoAlreadyCompleted || !canComplete || updatingVideo}
                className={`font-semibold py-2 px-5 rounded-lg text-xs transition shadow-sm text-white ${
                  isVideoAlreadyCompleted
                    ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                    : canComplete 
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer" 
                    : "bg-gray-300 cursor-not-allowed opacity-60"
                }`}
              >
                {updatingVideo ? "Saving..." : isVideoAlreadyCompleted ? "✓ Completed" : "Mark Lecture as Completed"}
              </button>
            </div>
          </div>

          {/* SIDEBAR PLAYLIST */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">📋 Course Playlist</h3>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {HMT_PLAYLIST.map((video) => {
                const isDone = user?.completedVideos?.includes(video.id);
                return (
                  <button
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex flex-col gap-1 border ${
                      activeVideo.id === video.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <span className="line-clamp-2 flex items-center gap-1">
                      {isDone && <span>✅</span>} {video.title}
                    </span>
                    <span className={`text-[10px] ${activeVideo.id === video.id ? "text-blue-200" : "text-gray-400"}`}>
                      ⏱️ {video.duration} mins {isDone && "(Done)"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // LOGIN FORM
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">HMT Student Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="student@example.com"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="••••••••"/>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}