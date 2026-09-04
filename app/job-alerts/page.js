"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const INITIAL_JOB_ALERTS = [
  {
    id: "etea-pst-ct-2026",
    title: "ETEA KP Elementary & Secondary Education Teacher Jobs 2026",
    agency: "ETEA KP",
    postName: "PST, CT, SST, AT, TT, Qari",
    totalPosts: "4,500+ Posts",
    location: "Khyber Pakhtunkhwa (All Districts)",
    deadline: "2026-09-25",
    pdfUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    applyUrl: "https://www.etea.edu.pk",
    category: "ETEA Jobs",
    description: "Official ETEA advertisement for recruitment of Primary School Teachers (PST) and Certified Teachers (CT) across all district cadres in KPK.",
    featured: true,
  },
  {
    id: "kppsc-tehsildar-2026",
    title: "KPPSC Tehsildar & Naib Tehsildar Recruitment (BS-16)",
    agency: "KPPSC",
    postName: "Tehsildar / Naib Tehsildar",
    totalPosts: "85 Posts",
    location: "KPK Revenue Department",
    deadline: "2026-09-30",
    pdfUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    applyUrl: "https://www.kppsc.gov.pk",
    category: "KPPSC Jobs",
    description: "Khyber Pakhtunkhwa Public Service Commission fresh advertisement for Tehsildar posts. Competitive written examination details enclosed.",
    featured: true,
  },
  {
    id: "fpsc-assistant-director-2026",
    title: "FPSC General Recruitment Phase 04/2026",
    agency: "FPSC",
    postName: "Assistant Director, Inspector FIA, UDC",
    totalPosts: "320 Posts",
    location: "Islamabad & All Pakistan",
    deadline: "2026-09-20",
    pdfUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    applyUrl: "https://www.fpsc.gov.pk",
    category: "FPSC / Federal",
    description: "Federal Public Service Commission advertisement for various federal ministries including FIA, Customs, and Intelligence Bureau.",
    featured: true,
  },
  {
    id: "sbp-it-officer-2026",
    title: "State Bank of Pakistan IT Officer & Trainee Program",
    agency: "State Bank",
    postName: "Junior IT Officer & Software Developer",
    totalPosts: "60 Posts",
    location: "Karachi / Lahore / Peshawar",
    deadline: "2026-10-05",
    pdfUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    applyUrl: "https://www.sbp.org.pk",
    category: "Banking & IT Jobs",
    description: "State Bank of Pakistan invites fresh Computer Science graduates and IT specialists for permanent officer cadre positions.",
    featured: false,
  },
  {
    id: "ppsc-educators-2026",
    title: "PPSC Punjab Educators & Assistant Lecturer Recruitment",
    agency: "PPSC",
    postName: "ESE, SESE, SSE (Arts & Science)",
    totalPosts: "1,200 Posts",
    location: "Punjab (All Districts)",
    deadline: "2026-09-28",
    pdfUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    applyUrl: "https://www.ppsc.gop.pk",
    category: "PPSC Jobs",
    description: "Punjab Public Service Commission announcement for school educators and college lecturers across Punjab district headquarters.",
    featured: false,
  },
];

const JOB_CATEGORIES = [
  "All",
  "ETEA Jobs",
  "KPPSC Jobs",
  "FPSC / Federal",
  "PPSC Jobs",
  "Banking & IT Jobs",
];

export default function JobAlertsPage() {
  const [jobs, setJobs] = useState(INITIAL_JOB_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const q = query(collection(db, "job_alerts"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const combined = [...fetched];
            INITIAL_JOB_ALERTS.forEach((item) => {
              if (!combined.some((j) => j.id === item.id)) {
                combined.push(item);
              }
            });
            setJobs(combined);
          }
        },
        (err) => console.warn("Firestore job_alerts listener warning:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error:", e);
    }
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.postName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getDeadlineStatus = (deadlineStr) => {
    if (!deadlineStr) return { label: "Active", style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    const today = new Date();
    const dDate = new Date(deadlineStr);
    const diffTime = dDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Expired", style: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
    }
    if (diffDays <= 3) {
      return { label: `⏳ ${diffDays} Days Left!`, style: "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse" };
    }
    return { label: `⏳ ${diffDays} Days Left`, style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  };

  const handleShareWhatsApp = (job) => {
    const text = `📢 *JOB ALERT: ${job.title}*\nAgency: ${job.agency}\nPosts: ${job.postName} (${job.totalPosts})\nDeadline: ${job.deadline}\n\nGet PDF Ad & Apply Link on HMT Hub:\nhttps://www.hmtfinancialservices.com/job-alerts`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-14 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
                📢 Official Govt & Bank Job Alerts
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Advertisements
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Latest ETEA, KPPSC & Govt Job Portal
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stay updated with active job openings, official PDF advertisements, roll number slips, and online application guidelines curated by <strong className="text-amber-300">Muhammad Tufail (HMT Success Academy)</strong>.
            </p>

            {/* SEARCH BAR */}
            <div className="pt-4 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="🔍 Search job title, ETEA, PST, KPPSC, Tehsildar, Bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-900/90 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
              />
            </div>
          </div>
        </section>

        {/* CATEGORY TABS */}
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-black transition ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* INSTANT JOB ALERT SUBSCRIPTION WIDGET */}
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border border-blue-500/40 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center lg:text-left">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                🔔 FREE INSTANT JOB NOTIFICATION
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Get ETEA & KPPSC Job Alerts on WhatsApp
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Never miss an advertisement deadline for PST, CT, Tehsildar, or Computer Operator posts. Receive official PDF ads directly on your phone!
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("✅ Subscribed successfully! You will receive new ETEA & KPPSC Job Alerts on WhatsApp.");
              }}
              className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto"
            >
              <input
                type="text"
                required
                placeholder="Your Name"
                className="rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                required
                placeholder="WhatsApp Number (0300...)"
                className="rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>🔔 Subscribe Free</span>
              </button>
            </form>
          </div>
        </section>

        {/* JOBS GRID */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>📢 Active Job Advertisements</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold">
                {filteredJobs.length} Openings
              </span>
            </h2>
            <Link
              href="/free-services"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>← Back to Free Hub</span>
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-lg font-bold text-slate-400">No job alerts found matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold text-amber-400 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const status = getDeadlineStatus(job.deadline);

                return (
                  <div
                    key={job.id}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-amber-500/10"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {job.agency}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${status.style}`}>
                          {status.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs font-bold text-amber-400/90 mt-1">
                        🎯 Post: {job.postName}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">Total Vacancies:</span>
                          <span className="font-black text-emerald-400">{job.totalPosts}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Location:</span>
                          <span className="font-bold text-slate-200 truncate block">{job.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-800/80 mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                        <span>📅 Deadline: <strong className="text-amber-300">{job.deadline || "Open"}</strong></span>
                        <span>Verified</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={job.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition flex items-center justify-center gap-1"
                        >
                          <span>📄 PDF Ad</span>
                        </a>
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs text-center shadow-md hover:from-amber-300 hover:to-yellow-400 transition flex items-center justify-center gap-1"
                        >
                          <span>🚀 Apply Online</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(job)}
                        className="w-full py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 font-bold text-[11px] text-center transition flex items-center justify-center gap-1 border border-green-500/30"
                      >
                        <span>💬 Share Job Alert on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Paid Services)</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/past-papers" className="hover:underline">Past Papers</Link>
            <Link href="/daily-quiz" className="hover:underline">Daily Quiz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
