import Link from "next/link";

const YOUTUBE_PLAYLIST_ID = "PL7-zXwiLK4QpTLwRwytLdvhBJplS1lnhA";
const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H";

const courseTopics = [
  "Computer basics and daily office use",
  "MS Word document formatting",
  "MS Excel sheets and basic formulas",
  "PowerPoint presentations",
  "Professional CV design",
  "Internet, email, and productivity basics",
];

const portalFeatures = [
  "Verified lecture watch progress",
  "Assignments and admin feedback",
  "Student ID card and QR verification",
  "Announcements and student questions",
  "Certificate status",
  "Upcoming AI course interest registration",
];

export default function ComputerCourse() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">HMT Success Academy</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">Free Computer Course</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-slate-300 md:text-base">
              Batch 02 is live. Students can watch lectures, track progress, submit practice work, ask questions, and manage course documents inside the HMT student portal.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/portal" className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">
                Go to Student Portal
              </Link>
              <Link href="/tools" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/15">
                Free Student Tools
              </Link>
              <a href={YOUTUBE_PLAYLIST_URL} target="_blank" rel="noreferrer" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700">
                Open Playlist
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
            <img src="/computer-course.jpg" alt="HMT free computer course" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-3">
        {[
          ["Status", "Batch 02 Live", "Current students should continue from the student portal."],
          ["Access", "Portal Based", "Lecture progress, assignments, questions, and cards are handled in one place."],
          ["Next Course", "Artificial Intelligence", "AI basics, prompt writing, ChatGPT workflows, and productivity tools are coming next."],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase text-blue-600">{label}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{value}</h2>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">{detail}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">What Students Learn</h2>
          <div className="mt-4 grid gap-2">
            {courseTopics.map((topic) => (
              <div key={topic} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                {topic}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Use the Portal For</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {portalFeatures.map((feature) => (
              <div key={feature} className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-red-600">Course Playlist</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Watch Course Lectures</h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">Students should use the portal for verified progress. This public player is only for preview and easy access.</p>
            </div>
            <a href={YOUTUBE_PLAYLIST_URL} target="_blank" rel="noreferrer" className="rounded-xl bg-red-600 px-4 py-2 text-center text-xs font-black text-white hover:bg-red-700">
              Full YouTube Playlist
            </a>
          </div>
          <div className="video-container mt-4">
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}`}
              title="HMT Computer Course Batch 2 Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-5 text-white shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wide text-cyan-200">Next Course</p>
          <h2 className="mt-2 text-2xl font-black">Artificial Intelligence Course</h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-200">
            HMT Success Academy will introduce AI basics, prompt writing, ChatGPT workflows, AI for study, office work, freelancing, and digital productivity.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["AI basics", "Prompt writing", "ChatGPT workflows", "Office productivity"].map((topic) => (
              <span key={topic} className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-black text-cyan-100">
                {topic}
              </span>
            ))}
          </div>
          <Link href="/portal" className="mt-5 inline-block rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">
            Register Interest in Portal
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">Need course updates?</h2>
              <p className="mt-1 text-xs font-semibold text-slate-300">Join the official WhatsApp channel for academy announcements and new course updates.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noreferrer" className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
                WhatsApp Channel
              </a>
              <Link href="/portal" className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 hover:bg-slate-100">
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 1rem;
          background: #000000;
        }

        .video-container iframe {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
        }

        @supports not (aspect-ratio: 16 / 9) {
          .video-container {
            height: 0;
            padding-bottom: 56.25%;
          }
        }
      `}</style>
    </main>
  );
}
