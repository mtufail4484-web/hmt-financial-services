"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const INITIAL_GROUPS = [
  {
    id: "etea-pst-ct-group",
    title: "ETEA KP 2026 PST / CT Official Study Group",
    category: "ETEA KP",
    members: "1,450+ Members",
    desc: "Daily MCQ sharing, past paper PDFs, ETEA syllabus updates, and discussion for PST, CT, and SST candidates.",
    link: "https://chat.whatsapp.com/invite/ETEA2026PST",
    badge: "🔥 MOST POPULAR",
  },
  {
    id: "hmt-channel",
    title: "Official HMT Success Academy Broadcast Channel",
    category: "Official Channel",
    members: "3,800+ Followers",
    desc: "Direct announcements from Muhammad Tufail regarding lecture releases, mock test schedules, and job openings.",
    link: "https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H",
    badge: "📢 BROADCAST CHANNEL",
  },
  {
    id: "kppsc-fpsc-group",
    title: "KPPSC & FPSC Competitive Exams Prep Group",
    category: "KPPSC / FPSC",
    members: "920+ Members",
    desc: "Preparation group for Tehsildar, Assistant Director, Inspector FIA, Town Officer, and PMS screening tests.",
    link: "https://chat.whatsapp.com/invite/KPPSCFPSC2026",
    badge: "🎯 COMPETITIVE EXAMS",
  },
  {
    id: "computer-course-group",
    title: "HMT Free Computer Course Batch 02 Group",
    category: "Computer Course",
    members: "1,100+ Students",
    desc: "Official discussion group for students enrolled in HMT MS Office, CV making, and Excel automation live training.",
    link: "https://chat.whatsapp.com/invite/HMTComputerBatch02",
    badge: "🎓 STUDENT ACADEMY",
  },
];

export default function WhatsappGroupsPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);

  useEffect(() => {
    try {
      const q = query(collection(db, "whatsapp_groups"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const combined = [...fetched];
            INITIAL_GROUPS.forEach((item) => {
              if (!combined.some((g) => g.id === item.id)) {
                combined.push(item);
              }
            });
            setGroups(combined);
          }
        },
        (err) => console.warn("Firestore whatsapp_groups listener warning:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-14 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
              💬 Official Community Hub
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Official WhatsApp & Telegram Study Groups
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect directly with thousands of competitive exam aspirants and students hosted by <strong className="text-amber-300">Muhammad Tufail (HMT Success Academy)</strong>.
            </p>
          </div>
        </section>

        {/* GROUPS LIST */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>💬 Active Study Groups & Channels</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold">
                {groups.length} Groups
              </span>
            </h2>
            <Link
              href="/free-services"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              ← Back to Free Hub
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {group.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      👥 {group.members}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {group.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-400 mt-1">
                    Category: {group.category}
                  </p>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {group.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-5">
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs text-center shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <span>💬 Join WhatsApp Group Now</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* RULES CARD */}
          <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
              📜 Community Guidelines & Group Rules:
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Share only educational material, past paper PDFs, and official job notifications.</li>
              <li>No commercial promotions, spam links, or personal advertisements.</li>
              <li>Respect fellow students and instructors at all times.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Paid Services)</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/job-alerts" className="hover:underline">Job Alerts</Link>
            <Link href="/past-papers" className="hover:underline">Past Papers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
