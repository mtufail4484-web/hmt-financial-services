"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const INITIAL_PAST_PAPERS = [
  {
    id: "etea-pst-2024",
    title: "ETEA PST Solved Past Paper 2024 (Complete)",
    category: "ETEA KP",
    examType: "Primary School Teacher (PST)",
    year: "2024",
    format: "PDF",
    description: "Complete authentic solved paper for ETEA Primary School Teacher (PST) test held in KP with detailed answer keys for Pedagogy, Science, and English.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 1420,
    featured: true,
  },
  {
    id: "kppsc-tehsildar-2023",
    title: "KPPSC Tehsildar & Naib Tehsildar Solved Paper",
    category: "KPPSC",
    examType: "Tehsildar / Naib Tehsildar",
    year: "2023",
    format: "PDF",
    description: "Original KPPSC paper covering KPK History, Pakistan Affairs, General Knowledge, Land Revenue Laws, and English Essay guidelines.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 980,
    featured: true,
  },
  {
    id: "etea-ct-math-science-2024",
    title: "ETEA CT (Certified Teacher) Math & Science Notes",
    category: "ETEA KP",
    examType: "Certified Teacher (CT)",
    year: "2024",
    format: "PDF Notes",
    description: "Handwritten and typed chapter-wise notes for Class 6th to 8th Science and Math textbooks for ETEA CT exam preparation.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 2150,
    featured: true,
  },
  {
    id: "fpsc-assistant-2024",
    title: "FPSC Assistant & UDC General Knowledge MCQs",
    category: "FPSC",
    examType: "Assistant (BS-16) / UDC",
    year: "2024",
    format: "PDF",
    description: "Top 500 repeated General Knowledge, Current Affairs, and Islamic Studies MCQs asked in FPSC screening exams.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 890,
    featured: false,
  },
  {
    id: "computer-office-notes-2026",
    title: "HMT Computer Course MS Office 2021 Master Guide",
    category: "Computer Science",
    examType: "HMT Success Academy",
    year: "2026",
    format: "PDF Notes",
    description: "Complete guide on MS Word shortcuts, Excel formulas (VLOOKUP, INDEX MATCH, XLOOKUP), and PowerPoint presentation tips by Muhammad Tufail.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 3400,
    featured: true,
  },
  {
    id: "ppsc-educators-2023",
    title: "PPSC Educators Science & Arts Solved MCQs",
    category: "PPSC",
    examType: "Educators (EST / ESE)",
    year: "2023",
    format: "PDF",
    description: "Comprehensive solved past paper compilation for Punjab Public Service Commission educators screening test.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 760,
    featured: false,
  },
  {
    id: "css-everyday-science",
    title: "CSS General Science & Ability Past Papers Notes",
    category: "CSS / PMS",
    examType: "CSS Competitive Exam",
    year: "2024",
    format: "PDF Notes",
    description: "High-scoring concise notes for Biological Science, Physical Science, Environmental Science, and Basic Ability Math for CSS/PMS.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 1120,
    featured: false,
  },
  {
    id: "islamiyat-pakstudies-top500",
    title: "Islamiyat & Pakistan Studies Top 500 Most Repeated MCQs",
    category: "General Knowledge",
    examType: "All Pakistan Exams",
    year: "2025",
    format: "PDF",
    description: "Essential compilation of Islamic History, Prophets, Battles, Quranic facts, and 1857-1947 Freedom Movement history for all competitive tests.",
    fileUrl: "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view",
    downloadCount: 2900,
    featured: true,
  },
];

const CATEGORIES = [
  "All",
  "ETEA KP",
  "KPPSC",
  "FPSC",
  "PPSC",
  "CSS / PMS",
  "Computer Science",
  "General Knowledge",
];

export default function PastPapersPage() {
  const [papers, setPapers] = useState(INITIAL_PAST_PAPERS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaperModal, setSelectedPaperModal] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "past_papers"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Merge custom uploaded papers with initial list so user always sees data
            const combined = [...fetched];
            INITIAL_PAST_PAPERS.forEach((item) => {
              if (!combined.some((p) => p.id === item.id)) {
                combined.push(item);
              }
            });
            setPapers(combined);
          }
        },
        (error) => {
          console.warn("Firestore past_papers listener warning:", error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore error:", e);
    }
  }, []);

  const filteredPapers = papers.filter((paper) => {
    const matchesCategory =
      selectedCategory === "All" || paper.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (paper.examType && paper.examType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleShareWhatsApp = (paper) => {
    const text = `📚 Download Free Past Paper: *${paper.title}*\nCategory: ${paper.category}\nExam: ${paper.examType}\n\nGet yours for free on HMT Success Academy Hub:\nhttps://www.hmtfinancialservices.com/past-papers`;
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
                📚 100% Free Study Material
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PDF Downloads
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ETEA Past Papers & KPPSC Solved Study Notes Hub
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Download authentic solved past papers, textbook summaries, and MCQ notes for ETEA KP, KPPSC, FPSC, PPSC, CSS, and Computer Science curated by <strong className="text-amber-300">Muhammad Tufail (HMT Success Academy)</strong>.
            </p>

            {/* SEARCH & FILTER BAR */}
            <div className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search past paper, ETEA, PST, KPPSC, Math..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900/90 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY TABS */}
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
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

        {/* PAPERS GRID */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>📖 Solved Papers & Notes</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold">
                {filteredPapers.length} Available
              </span>
            </h2>
            <Link
              href="/free-services"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>← Back to Free Hub</span>
            </Link>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-lg font-bold text-slate-400">No papers found for "{searchQuery}"</p>
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
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="group relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:shadow-amber-500/10"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                        {paper.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-950">
                          📅 {paper.year || "2025"}
                        </span>
                        <span className="text-[10px] font-black text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          {paper.format || "PDF"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-xs font-bold text-amber-400/90 mt-1">
                      🎯 Exam: {paper.examType}
                    </p>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                      {paper.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2">
                      <span>📥 {paper.downloadCount || 1000}+ Downloads</span>
                      <span>Verified by HMT</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs text-center shadow-md hover:from-amber-300 hover:to-yellow-400 transition flex items-center justify-center gap-1"
                      >
                        <span>📥 Download PDF</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedPaperModal(paper)}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1 border border-slate-700"
                      >
                        <span>👁️ View Details</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(paper)}
                      className="w-full py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 font-bold text-[11px] text-center transition flex items-center justify-center gap-1 border border-green-500/30"
                    >
                      <span>💬 Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* PAPER DETAILS MODAL */}
      {selectedPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedPaperModal.category}
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  {selectedPaperModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400">Target Exam:</span>
                  <p className="font-bold text-amber-300">{selectedPaperModal.examType}</p>
                </div>
                <div>
                  <span className="text-slate-400">Year / Publisher:</span>
                  <p className="font-bold text-white">{selectedPaperModal.year} • HMT Academy</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Description & Key Topics Covered:</span>
                <p className="leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                  {selectedPaperModal.description}
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-200">
                <p className="font-bold">💡 How to study this paper:</p>
                <p className="mt-1 leading-relaxed">
                  Review each solved MCQ carefully. Write down repeated formula concepts and history dates in your note register.
                </p>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <a
                href={selectedPaperModal.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs text-center shadow-lg hover:bg-amber-300 transition"
              >
                📥 Open / Download File
              </a>
              <button
                onClick={() => setSelectedPaperModal(null)}
                className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Paid Services)</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/mock-test" className="hover:underline">Mock Tests</Link>
            <Link href="/daily-quiz" className="hover:underline">Daily Quiz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
