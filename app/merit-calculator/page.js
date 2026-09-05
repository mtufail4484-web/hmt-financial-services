"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

export default function MeritCalculatorPage() {
  const [postType, setPostType] = useState("teaching"); // teaching | computer | custom
  const [copied, setCopied] = useState(false);

  // Teaching post state (Matric 10, FSc 15, BS 15, BEd 10, ETEA 50)
  const [matricObt, setMatricObt] = useState("950");
  const [matricTotal, setMatricTotal] = useState("1100");
  const [fscObt, setFscObt] = useState("920");
  const [fscTotal, setFscTotal] = useState("1100");
  const [bsObt, setBsObt] = useState("3.4");
  const [bsTotal, setBsTotal] = useState("4.0");
  const [bedObt, setBedObt] = useState("800");
  const [bedTotal, setBedTotal] = useState("1000");
  const [eteaScore, setEteaScore] = useState("68");

  // Computer Operator state (Matric 10, FSc 15, DIT 15, Grad 10, Test 50)
  const [compMatricObt, setCompMatricObt] = useState("900");
  const [compMatricTotal, setCompMatricTotal] = useState("1100");
  const [compFscObt, setCompFscObt] = useState("880");
  const [compFscTotal, setCompFscTotal] = useState("1100");
  const [ditObt, setDitObt] = useState("1150");
  const [ditTotal, setDitTotal] = useState("1400");
  const [compGradObt, setCompGradObt] = useState("3.2");
  const [compGradTotal, setCompGradTotal] = useState("4.0");
  const [compTestScore, setCompTestScore] = useState("72");

  // Custom Weightage state
  const [custMatricW, setCustMatricW] = useState("10");
  const [custFscW, setCustFscW] = useState("20");
  const [custGradW, setCustGradW] = useState("20");
  const [custTestW, setCustTestW] = useState("50");
  const [custMatricObt, setCustMatricObt] = useState("900");
  const [custMatricTotal, setCustMatricTotal] = useState("1100");
  const [custFscObt, setCustFscObt] = useState("850");
  const [custFscTotal, setCustFscTotal] = useState("1100");
  const [custGradObt, setCustGradObt] = useState("3.0");
  const [custGradTotal, setCustGradTotal] = useState("4.0");
  const [custTestScore, setCustTestScore] = useState("65");

  const calcPercent = (obt, tot) => {
    const o = parseFloat(obt) || 0;
    const t = parseFloat(tot) || 1;
    if (t <= 0) return 0;
    return Math.min(100, (o / t) * 100);
  };

  // Teaching Calculations
  const teachingMatricWeight = (calcPercent(matricObt, matricTotal) * 10) / 100;
  const teachingFscWeight = (calcPercent(fscObt, fscTotal) * 15) / 100;
  const teachingBsWeight = (calcPercent(bsObt, bsTotal) * 15) / 100;
  const teachingBedWeight = (calcPercent(bedObt, bedTotal) * 10) / 100;
  const teachingEteaWeight = ((Math.min(100, Math.max(0, parseFloat(eteaScore) || 0))) * 50) / 100;
  const totalTeachingMerit = (
    teachingMatricWeight +
    teachingFscWeight +
    teachingBsWeight +
    teachingBedWeight +
    teachingEteaWeight
  ).toFixed(2);

  // Computer Operator Calculations
  const compMatricW = (calcPercent(compMatricObt, compMatricTotal) * 10) / 100;
  const compFscW = (calcPercent(compFscObt, compFscTotal) * 15) / 100;
  const compDitW = (calcPercent(ditObt, ditTotal) * 15) / 100;
  const compGradW = (calcPercent(compGradObt, compGradTotal) * 10) / 100;
  const compTestW = ((Math.min(100, Math.max(0, parseFloat(compTestScore) || 0))) * 50) / 100;
  const totalCompMerit = (compMatricW + compFscW + compDitW + compGradW + compTestW).toFixed(2);

  // Custom Calculations
  const cMatW = parseFloat(custMatricW) || 0;
  const cFscW = parseFloat(custFscW) || 0;
  const cGradW = parseFloat(custGradW) || 0;
  const cTestW = parseFloat(custTestW) || 0;
  const customMatricContrib = (calcPercent(custMatricObt, custMatricTotal) * cMatW) / 100;
  const customFscContrib = (calcPercent(custFscObt, custFscTotal) * cFscW) / 100;
  const customGradContrib = (calcPercent(custGradObt, custGradTotal) * cGradW) / 100;
  const customTestContrib = ((Math.min(100, Math.max(0, parseFloat(custTestScore) || 0))) * cTestW) / 100;
  const totalCustomMerit = (customMatricContrib + customFscContrib + customGradContrib + customTestContrib).toFixed(2);

  const activeTotalMerit =
    postType === "teaching"
      ? totalTeachingMerit
      : postType === "computer"
      ? totalCompMerit
      : totalCustomMerit;

  const getMeritBadge = (score) => {
    const s = parseFloat(score);
    if (s >= 75) return { label: "🔥 TOP SELECTION BRACKET (EXCELLENT)", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    if (s >= 65) return { label: "⚡ HIGH COMPETITIVE RANGE", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    if (s >= 55) return { label: "📈 MODERATE CHANCE / AVERAGE RANGE", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" };
    return { label: "📚 KEEP PRACTICING / BOOST TEST SCORE", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
  };

  const badge = getMeritBadge(activeTotalMerit);

  const copyBreakdown = () => {
    const title =
      postType === "teaching"
        ? "ETEA Teaching Post Merit"
        : postType === "computer"
        ? "KPPSC / ETEA Computer Operator Merit"
        : "Custom Weightage Merit";

    const text = `📊 *${title} Report*\nCalculated via HMT Financial Services & Success Academy\n\n🎯 *Total Merit Score:* ${activeTotalMerit} / 100\n\n🔹 Status: ${badge.label}\n\nCalculate your merit score free at:\nhttps://www.hmtfinancialservices.com/merit-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              🧮 Official ETEA & KPPSC Formula 2026
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ETEA Merit Aggregate Calculator
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Instantly calculate your total recruitment merit score out of 100 for ETEA PST, CT, DM, PET, SST, and KPPSC Computer Operator posts by <strong className="text-amber-300">Muhammad Tufail</strong>.
            </p>
          </div>
        </section>

        {/* CALCULATOR MAIN SECTION */}
        <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT FORM */}
          <div className="lg:col-span-7 space-y-6">
            {/* POST PRESET SELECTOR */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h2 className="text-base font-black text-white flex items-center justify-between">
                <span>🎯 Select Target Post Formula</span>
                <span className="text-xs text-amber-400 font-normal">100% Free Tool</span>
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPostType("teaching")}
                  className={`p-3 rounded-2xl text-xs font-black border text-left transition flex flex-col gap-1 ${
                    postType === "teaching"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>📚 Teaching Posts</span>
                  <span className="text-[10px] opacity-80">PST • CT • DM • SST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostType("computer")}
                  className={`p-3 rounded-2xl text-xs font-black border text-left transition flex flex-col gap-1 ${
                    postType === "computer"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>💻 Computer Operator</span>
                  <span className="text-[10px] opacity-80">KPPSC • ETEA • Clerk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostType("custom")}
                  className={`p-3 rounded-2xl text-xs font-black border text-left transition flex flex-col gap-1 ${
                    postType === "custom"
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span>⚙️ Custom Weights</span>
                  <span className="text-[10px] opacity-80">Set Your % Ratios</span>
                </button>
              </div>
            </div>

            {/* MARKS FORM */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5">
              <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                📝 Enter Academic & Test Marks
              </h2>

              {postType === "teaching" && (
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
              )}

              {postType === "computer" && (
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

              {postType === "custom" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300">
                    💡 Specify percentage weightage for each stage (Total weights should equal 100%).
                  </div>

                  {/* WEIGHTS ROW */}
                  <div className="grid grid-cols-4 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px]">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Matric %</label>
                      <input
                        type="number"
                        value={custMatricW}
                        onChange={(e) => setCustMatricW(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">FSc %</label>
                      <input
                        type="number"
                        value={custFscW}
                        onChange={(e) => setCustFscW(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Grad %</label>
                      <input
                        type="number"
                        value={custGradW}
                        onChange={(e) => setCustGradW(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-amber-400 block mb-1 font-bold">Test %</label>
                      <input
                        type="number"
                        value={custTestW}
                        onChange={(e) => setCustTestW(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-amber-500/50 p-1.5 text-amber-300 font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* MATRIC MARKS */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Matric Obtained</label>
                      <input
                        type="number"
                        value={custMatricObt}
                        onChange={(e) => setCustMatricObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={custMatricTotal}
                        onChange={(e) => setCustMatricTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* FSC MARKS */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">FSc Obtained</label>
                      <input
                        type="number"
                        value={custFscObt}
                        onChange={(e) => setCustFscObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total Marks</label>
                      <input
                        type="number"
                        value={custFscTotal}
                        onChange={(e) => setCustFscTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* GRAD MARKS */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Graduation Obtained</label>
                      <input
                        type="number"
                        step="0.01"
                        value={custGradObt}
                        onChange={(e) => setCustGradObt(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Total CGPA / Marks</label>
                      <input
                        type="number"
                        step="0.01"
                        value={custGradTotal}
                        onChange={(e) => setCustGradTotal(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* TEST SCORE */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40">
                    <label className="text-amber-300 block mb-1 font-black text-xs">
                      ⚡ Written / ETEA Test Score (Out of 100)
                    </label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={custTestScore}
                      onChange={(e) => setCustTestScore(e.target.value)}
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
              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border block ${badge.color}`}>
                {badge.label}
              </span>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Calculated Merit Aggregate</p>
                <div className="text-5xl sm:text-6xl font-black text-amber-400 mt-2 font-mono">
                  {activeTotalMerit} <span className="text-2xl text-slate-400 font-normal">/ 100</span>
                </div>
              </div>

              {/* PROGRESS METER */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, parseFloat(activeTotalMerit)))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>75% Top Merit</span>
                  <span>100%</span>
                </div>
              </div>

              {/* MERIT WEIGHTS BREAKDOWN TABLE */}
              <div className="bg-slate-950 rounded-2xl p-4 text-xs space-y-2 border border-slate-800 text-left">
                <h3 className="font-black text-white border-b border-slate-800 pb-2">📊 Score Breakdown</h3>
                {postType === "teaching" && (
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
                )}

                {postType === "computer" && (
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
                      <span className="text-amber-300">Screening Test (50%):</span>
                      <span className="font-mono text-amber-300">{compTestW.toFixed(2)} / 50</span>
                    </div>
                  </>
                )}

                {postType === "custom" && (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>Matric ({cMatW}%):</span>
                      <span className="font-mono font-bold text-amber-300">{customMatricContrib.toFixed(2)} / {cMatW}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>FSc Inter ({cFscW}%):</span>
                      <span className="font-mono font-bold text-amber-300">{customFscContrib.toFixed(2)} / {cFscW}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Graduation ({cGradW}%):</span>
                      <span className="font-mono font-bold text-amber-300">{customGradContrib.toFixed(2)} / {cGradW}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800 pt-1">
                      <span className="text-amber-300">Test Score ({cTestW}%):</span>
                      <span className="font-mono text-amber-300">{customTestContrib.toFixed(2)} / {cTestW}</span>
                    </div>
                  </>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={copyBreakdown}
                  className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <span>{copied ? "✅ Copied!" : "📋 Copy Summary"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <span>🖨️ Print Report</span>
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
            <Link href="/portal" className="hover:underline">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

