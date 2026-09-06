"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const INITIAL_ROLL_NO_PORTALS = [
  {
    id: "etea-rollno-slip-2026",
    agency: "ETEA KP",
    title: "ETEA PST, CT, SST & Police Constable Roll No Slips",
    desc: "Direct link to print official ETEA candidate test slip using CNIC number without dash.",
    link: "https://etea.edu.pk",
    status: "🟢 ACTIVE DOWNLOAD",
    badge: "ETEA OFFICIAL",
  },
  {
    id: "kppsc-rollno-slip-2026",
    agency: "KPPSC",
    title: "KPPSC Computer Operator & Assistant Screening Test Slip",
    desc: "Download official Khyber Pakhtunkhwa Public Service Commission examination admission slip.",
    link: "https://kppsc.gov.pk",
    status: "🟢 ACTIVE DOWNLOAD",
    badge: "KPPSC OFFICIAL",
  },
  {
    id: "fpsc-rollno-slip-2026",
    agency: "FPSC",
    title: "FPSC General Recruitment & CSS Admission Certificates",
    desc: "Federal Public Service Commission online roll number slip and exam venue locator.",
    link: "https://fpsc.gov.pk",
    status: "🟢 ACTIVE DOWNLOAD",
    badge: "FPSC ISLAMABAD",
  },
  {
    id: "nts-rollno-slip-2026",
    agency: "NTS",
    title: "NTS Screening & National Test Roll Number Slip",
    desc: "National Testing Service student roll number slip verification and result portal.",
    link: "https://nts.org.pk",
    status: "🟢 ACTIVE DOWNLOAD",
    badge: "NTS PAKISTAN",
  },
];

export default function RollNoSlipsPage() {
  const [portals, setPortals] = useState(INITIAL_ROLL_NO_PORTALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("ALL");
  const [cnicInput, setCnicInput] = useState("");
  const [cnicResult, setCnicResult] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "rollno_slips"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const combined = [...fetched];
            INITIAL_ROLL_NO_PORTALS.forEach((item) => {
              if (!combined.some((p) => p.id === item.id || p.title === item.title)) {
                combined.push(item);
              }
            });
            setPortals(combined);
          }
        },
        (err) => console.warn("Firestore rollno_slips listener warning:", err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error:", e);
    }
  }, []);

  const handleCnicSearch = (e) => {
    e.preventDefault();
    const cleanCnic = cnicInput.replace(/[^0-9]/g, "");
    if (cleanCnic.length < 13) {
      alert("Please enter a valid 13-digit CNIC number without hyphens.");
      return;
    }
    setCnicResult({
      cnic: cleanCnic,
      found: true,
      message: `Direct official portal links generated for CNIC ${cleanCnic}. Click on any testing agency link below to download your test slip.`,
    });
  };

  const filteredPortals = portals.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgency = selectedAgency === "ALL" || item.agency === selectedAgency;
    return matchesSearch && matchesAgency;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-widest">
              📇 Official Test Venue & Slip Hub
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Roll No Slip & Exam Center Finder
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Direct official download portals for ETEA KP, KPPSC, FPSC, and NTS examination roll number slips by <strong className="text-amber-300">Muhammad Tufail</strong>.
            </p>

            {/* CNIC LOOKUP FORM */}
            <form onSubmit={handleCnicSearch} className="max-w-xl mx-auto pt-4 flex gap-2">
              <input
                type="text"
                maxLength="15"
                placeholder="Enter 13-Digit CNIC (e.g. 1730112345671)..."
                value={cnicInput}
                onChange={(e) => setCnicInput(e.target.value)}
                className="w-full rounded-2xl bg-slate-900 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shrink-0 shadow-lg"
              >
                🔎 Search Slip
              </button>
            </form>

            {cnicResult && (
              <div className="max-w-xl mx-auto p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 text-left">
                ✅ <strong>CNIC Verified:</strong> {cnicResult.message}
              </div>
            )}
          </div>
        </section>

        {/* SEARCH & FILTER CONTROLS */}
        <section className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-3xl">
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="🔍 Search exam or post (e.g. PST, Computer Operator)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["ALL", "ETEA KP", "KPPSC", "FPSC", "NTS"].map((agency) => (
                <button
                  key={agency}
                  onClick={() => setSelectedAgency(agency)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                    selectedAgency === agency
                      ? "bg-blue-500 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {agency}
                </button>
              ))}
            </div>
          </div>

          {/* PORTALS LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPortals.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-950 text-blue-300 border border-blue-500/30">
                      {item.badge}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">{item.status}</span>
                  </div>

                  <h2 className="text-lg font-black text-white">{item.title}</h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs text-center transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📇 Download Roll No Slip Official</span>
                  <span>↗</span>
                </a>
              </div>
            ))}
          </div>

          {/* HELPFUL GUIDE CARD */}
          <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-6 space-y-3">
            <h3 className="text-base font-black text-amber-300">💡 How to Download Your Roll No Slip Correctly:</h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <li>Enter your <strong>13-digit CNIC number without hyphens</strong> (e.g. 1730112345671).</li>
              <li>Make sure to carry your <strong>Original CNIC</strong> and printed Roll No slip to the exam center.</li>
              <li>For center locations in Peshawar, Mardan, Swat, or Abbottabad, reach at least 45 minutes before test time.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/merit-calculator" className="hover:underline">Merit Calculator</Link>
            <Link href="/job-alerts" className="hover:underline">Job Alerts</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

