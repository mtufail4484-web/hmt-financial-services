"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

export default function MeritCalculatorPage() {
  const [postType, setPostType] = useState("teaching"); // teaching | computer | generic

  // Teaching post state
  const [matricObt, setMatricObt] = useState("950");
  const [matricTotal, setMatricTotal] = useState("1100");
  const [fscObt, setFscObt] = useState("920");
  const [fscTotal, setFscTotal] = useState("1100");
  const [bsObt, setBsObt] = useState("3.4");
  const [bsTotal, setBsTotal] = useState("4.0");
  const [bedObt, setBedObt] = useState("800");
  const [bedTotal, setBedTotal] = useState("1000");
  const [eteaScore, setEteaScore] = useState("68");

  // Computer Operator state
  const [compMatricObt, setCompMatricObt] = useState("900");
  const [compMatricTotal, setCompMatricTotal] = useState("1100");
  const [compFscObt, setCompFscObt] = useState("880");
  const [compFscTotal, setCompFscTotal] = useState("1100");
  const [ditObt, setDitObt] = useState("1150");
  const [ditTotal, setDitTotal] = useState("1400");
  const [compGradObt, setCompGradObt] = useState("3.2");
  const [compGradTotal, setCompGradTotal] = useState("4.0");
  const [compTestScore, setCompTestScore] = useState("72");

  // Calculate Teaching Merit (100 Marks Scale)
  // Matric (10), Inter (15), Graduation (15), B.Ed (10), ETEA Test (50)
  const calcPercent = (obt, tot) => {
    const o = parseFloat(obt) || 0;
    const t = parseFloat(tot) || 1;
    return (o / t) * 100;
  };

  const teachingMatricWeight = (calcPercent(matricObt, matricTotal) * 10) / 100;
  const teachingFscWeight = (calcPercent(fscObt, fscTotal) * 15) / 100;
  const teachingBsWeight = (calcPercent(bsObt, bsTotal) * 15) / 100;
  const teachingBedWeight = (calcPercent(bedObt, bedTotal) * 10) / 100;
  const teachingEteaWeight = ((parseFloat(eteaScore) || 0) * 50) / 100;

  const totalTeachingMerit = (
    teachingMatricWeight +
    teachingFscWeight +
    teachingBsWeight +
    teachingBedWeight +
    teachingEteaWeight
  ).toFixed(2);

  // Calculate Computer Operator Merit
  // Matric (10), FSc (15), DIT (15), Graduation (10), Test (50)
  const compMatricW = (calcPercent(compMatricObt, compMatricTotal) * 10) / 100;
  const compFscW = (calcPercent(compFscObt, compFscTotal) * 15) / 100;
  const compDitW = (calcPercent(ditObt, ditTotal) * 15) / 100;
  const compGradW = (calcPercent(compGradObt, compGradTotal) * 10) / 100;
  const compTestW = ((parseFloat(compTestScore) || 0) * 50) / 100;

  const totalCompMerit = (compMatricW + compFscW + compDitW + compGradW + compTestW).toFixed(2);

  const activeTotalMerit = postType === "teaching" ? totalTeachingMerit : totalCompMerit;

  const getMeritBadge = (score) => {
    const s = parseFloat(score);
    if (s >= 75) return { label: "🔥 TOP SELECTION BRACKET", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    if (s >= 65) return { label: "⚡ COMPETITIVE RANGE", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    return { label: "📚 KEEP PRACTICING / BOOST TEST SCORE", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
  };

  const badge = getMeritBadge(activeTotalMerit);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              🧮 Official ETEA & KPPSC Formula
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ETEA Merit Aggregate Calculator
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Instantly calculate your total recruitment merit score out of 100 for ETEA PST, CT, SST, and KPPSC Computer Operator posts by <strong className="text-amber-300">Muhammad Tufail</strong>.
            </p>
          </div>
        </section>

        {/* CALCULATOR MAIN SECTION */}
        <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT FORM */}
          <div className="lg:col-span-7 space-y-6">
            {/* POST PRESET SELECTOR */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h2 className="text-base font-black text-white">🎯 Select Target Post Formula</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPostType("teaching")}
                  className={`p-3.5 rounded-2xl text-xs font-black border text-left transition flex flex-col gap-1 ${
                    postType === "teaching"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>📚 ETEA Teaching Posts</span>
                  <span className="text-[10px] opacity-80">PST • CT • DM • PET • SST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostType("computer")}
                  className={`p-3.5 rounded-2xl text-xs font-black border text-left transition flex flex-col gap-1 ${
                    postType === "computer"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>💻 Computer Operator</span>
                  <span className="text-[10px] opacity-80">KPPSC • ETEA • Junior Clerk</span>
                </button>
              </div>
            </div>

            {/* MARKS FORM */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5">
              <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                📝 Enter Academic & Test Marks
              </h2>

              {postType === "teaching" ? (
                <div className="space-y-4 text-xs">
                  {/* MATRIC */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Matric Obtained (10%)</label>
                      <input
                        type="number"
                        value={matricObt}
                        onChange={(e) => setMatricObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={matricTotal}
                        onChange={(e) => setMatricTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* FSC */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">FSc / Intermediate (15%)</label>
                      <input
                        type="number"
                        value={fscObt}
                        onChange={(e) => setFscObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={fscTotal}
                        onChange={(e) => setFscTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* GRADUATION */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Graduation / BS (15%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={bsObt}
                        onChange={(e) => setBsObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total CGPA / Marks</label>
                      <input
                        type="number"
                        step="0.01"
                        value={bsTotal}
                        onChange={(e) => setBsTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* B.ED / PROFESSIONAL */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">B.Ed / Professional (10%)</label>
                      <input
                        type="number"
                        value={bedObt}
                        onChange={(e) => setBedObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={bedTotal}
                        onChange={(e) => setBedTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* ETEA TEST */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40">
                    <label className="text-amber-300 block mb-1 font-black text-xs">
                      ⚡ ETEA Written Test Score (Out of 100) — Weight: 50%
                    </label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={eteaScore}
                      onChange={(e) => setEteaScore(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-amber-500/50 p-2.5 text-amber-300 font-black text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* MATRIC */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Matric Obtained (10%)</label>
                      <input
                        type="number"
                        value={compMatricObt}
                        onChange={(e) => setCompMatricObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={compMatricTotal}
                        onChange={(e) => setCompMatricTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* FSC */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">FSc Intermediate (15%)</label>
                      <input
                        type="number"
                        value={compFscObt}
                        onChange={(e) => setCompFscObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={compFscTotal}
                        onChange={(e) => setCompFscTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* DIT DIPLOMA */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">DIT Diploma Marks (15%)</label>
                      <input
                        type="number"
                        value={ditObt}
                        onChange={(e) => setDitObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total DIT Marks</label>
                      <input
                        type="number"
                        value={ditTotal}
                        onChange={(e) => setDitTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* GRADUATION */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Graduation / BA / BSc (10%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={compGradObt}
                        onChange={(e) => setCompGradObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total CGPA / Marks</label>
                      <input
                        type="number"
                        step="0.01"
                        value={compGradTotal}
                        onChange={(e) => setCompGradTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* SCREENING TEST */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40">
                    <label className="text-amber-300 block mb-1 font-black text-xs">
                      ⚡ Screening Test Score (Out of 100) — Weight: 50%
                    </label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={compTestScore}
                      onChange={(e) => setCompTestScore(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-amber-500/50 p-2.5 text-amber-300 font-black text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT RESULT DISPLAY CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-6 rounded-3xl bg-slate-900 border border-amber-500/40 p-6 space-y-6 shadow-2xl text-center">
              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border ${badge.color}`}>
                {badge.label}
              </span>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Calculated Merit Score</p>
                <div className="text-5xl sm:text-6xl font-black text-amber-400 mt-2 font-mono">
                  {activeTotalMerit} <span className="text-2xl text-slate-400 font-normal">/ 100</span>
                </div>
              </div>

              {/* MERIT WEIGHTS BREAKDOWN TABLE */}
              <div className="bg-slate-950 rounded-2xl p-4 text-xs space-y-2 border border-slate-800 text-left">
                <h3 className="font-black text-white border-b border-slate-800 pb-2">📊 Weightage Contribution</h3>
                {postType === "teaching" ? (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Matric (10%):</span>
                      <span className="font-mono font-bold text-amber-300">{teachingMatricWeight.toFixed(2)} / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>FSc / Inter (15%):</span>
                      <span className="font-mono font-bold text-amber-300">{teachingFscWeight.toFixed(2)} / 15</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Graduation (15%):</span>
                      <span className="font-mono font-bold text-amber-300">{teachingBsWeight.toFixed(2)} / 15</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>B.Ed / Cert (10%):</span>
                      <span className="font-mono font-bold text-amber-300">{teachingBedWeight.toFixed(2)} / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-1">
                      <span className="text-amber-300">ETEA Test (50%):</span>
                      <span className="font-mono text-amber-300">{teachingEteaWeight.toFixed(2)} / 50</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Matric (10%):</span>
                      <span className="font-mono font-bold text-amber-300">{compMatricW.toFixed(2)} / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>FSc Inter (15%):</span>
                      <span className="font-mono font-bold text-amber-300">{compFscW.toFixed(2)} / 15</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>DIT Diploma (15%):</span>
                      <span className="font-mono font-bold text-amber-300">{compDitW.toFixed(2)} / 15</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Graduation (10%):</span>
                      <span className="font-mono font-bold text-amber-300">{compGradW.toFixed(2)} / 10</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-1">
                      <span className="text-amber-300">Written Test (50%):</span>
                      <span className="font-mono text-amber-300">{compTestW.toFixed(2)} / 50</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🖨️ Print / Save Merit Report</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/daily-quiz" className="hover:underline">Daily Quiz</Link>
            <Link href="/past-papers" className="hover:underline">Past Papers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
