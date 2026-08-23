import { NextResponse } from "next/server";

const PLAYLIST_ID = "PL7-zXwiLK4QpTLwRwytLdvhBJplS1lnhA";
const DEFAULT_PLAYLIST_VIDEO_IDS = [
  "cPpKY2oEd2s",
  "FSQ1H1dcxYk",
  "f4xVXgFSElo",
  "fJZSwxy_umk",
  "0TrUhAE-Iao",
  "Ia1hKML6oqk",
  "3VFBepUNpM0",
  "0Qoroiw804M",
  "HIYDIKtFubU",
  "RV_mOiZ9F3w",
  "e2m-bQ1o8mc",
  "nIxRnzmPUy0",
  "YdMOgAVxvGI",
  "Hdcr0zwU72I",
  "og9oMSGDLw0",
  "GSdQRlchKTQ",
  "XMGGQY0mz0g",
  "m6acGGC3RIQ",
  "V9XHduit-EM",
  "NNLYwUysHoI",
  "8Zd4bCFTE_4",
];

const fallbackQuiz = {
  question: "After watching this lecture, what is your learning status?",
  options: [
    "I learned something new",
    "I understood the main topic",
    "I need to revise and watch again",
    "I did not watch carefully",
  ],
  answer: "I learned something new",
  acceptedAnswers: [
    "I learned something new",
    "I understood the main topic",
    "I need to revise and watch again",
  ],
};

const decodeXml = (value = "") =>
  value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const getTag = (entry, tag) => {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? decodeXml(match[1].trim()) : "";
};

const getPlaylistPageVideoIds = (html = "") => {
  const ids = [];
  const patterns = [
    /"videoId":"([a-zA-Z0-9_-]{11})"/g,
    /\/vi\/([a-zA-Z0-9_-]{11})\//g,
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (!ids.includes(match[1])) ids.push(match[1]);
    }
  });

  return ids;
};

export async function GET(request) {
  const playlistId = new URL(request.url).searchParams.get("playlistId") || PLAYLIST_ID;

  try {
    const [feedResponse, pageResponse] = await Promise.all([
      fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`, {
        next: { revalidate: 1800 },
      }),
      fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
        next: { revalidate: 1800 },
      }),
    ]);

    const feedVideos = [];
    if (feedResponse.ok) {
      const xml = await feedResponse.text();
      const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

      entries.forEach((entry, index) => {
        const videoId = getTag(entry, "yt:videoId");
        const title = getTag(entry, "title") || `Lecture ${index + 1}`;
        const notes = getTag(entry, "media:description") || "Watch this lecture carefully and complete the required course tasks.";

        if (videoId) {
          feedVideos.push({
            id: videoId,
            title,
            videoId,
            duration: 30,
            notes,
            assignment: "Upload a screenshot, notes, or practice work for this lecture.",
            quiz: fallbackQuiz,
          });
        }
      });
    }

    const feedByVideoId = new Map(feedVideos.map((video) => [video.videoId, video]));
    const pageVideoIds = pageResponse.ok ? getPlaylistPageVideoIds(await pageResponse.text()) : [];
    const discoveredVideoIds = pageVideoIds.length > 0 ? pageVideoIds : feedVideos.map((video) => video.videoId);
    const videoIds = playlistId === PLAYLIST_ID
      ? [...new Set([...DEFAULT_PLAYLIST_VIDEO_IDS, ...discoveredVideoIds])]
      : discoveredVideoIds;
    const videos = videoIds.map((videoId, index) => (
      feedByVideoId.get(videoId) || {
        id: videoId,
        title: `Lecture ${index + 1}`,
        videoId,
        duration: 30,
        notes: "Watch this lecture carefully and complete the required course tasks.",
        assignment: "Upload a screenshot, notes, or practice work for this lecture.",
        quiz: fallbackQuiz,
      }
    ));

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("YouTube playlist fetch failed:", err);
    return NextResponse.json({ videos: [] }, { status: 200 });
  }
}
