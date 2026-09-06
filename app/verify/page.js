"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

const HMT_LOGO = "/hmt-logo-new.png?v=30";

export default function VerifyPage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState("");
  const [verifyType, setVerifyType] = useState("student"); // student | certificate

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = rollNo.trim().toUpperCase();
    if (!cleanQuery) return;
    router.push(`/verify/${encodeURIComponent(cleanQuery)}?type=${verifyType}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        <main className="max-w-xl mx-auto px-4 py-16 text-slate-950">
          <div className="rounded-3xl border border-amber-400/60 bg-white p-8 shadow-2xl space-y-6">
            <img src={HMT_LOGO} alt="HMT Success Academy" className="mx-auto h-24 w-24 object-contain" />

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-[#031735]">Official Verification Portal</h1>
              <p className="text-xs font-bold text-slate-500">
                Verify HMT Success Academy Student ID Cards and Computer Course Certificates
              </p>
            </div>

            {/* TOGGLE TYPE */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-black">
              <button
                type="button"
                onClick={() => setVerifyType("student")}
                className={`py-2 rounded-xl transition ${
                  verifyType === "student"
                    ? "bg-[#031735] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📇 Student ID Card
              </button>

              <button
                type="button"
                onClick={() => setVerifyType("certificate")}
                className={`py-2 rounded-xl transition ${
                  verifyType === "certificate"
                    ? "bg-[#031735] text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📜 Course Certificate
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {verifyType === "student" ? "Enter Student Roll Number:" : "Enter Certificate Reg Number:"}
                </label>
                <input
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder={verifyType === "student" ? "e.g. C-26-HMT001" : "e.g. HMT-CERT-2026-001"}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 text-center text-base sm:text-lg font-black uppercase outline-none focus:border-amber-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-[#031735] to-[#08295a] px-4 py-3.5 text-xs sm:text-sm font-black text-white hover:from-[#08295a] hover:to-[#031735] transition shadow-lg"
              >
                🔍 Verify Official Record Now
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <Link href="/free-services" className="text-xs font-bold text-amber-600 hover:underline">
                ← Back to HMT Free Student Hub
              </Link>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}

