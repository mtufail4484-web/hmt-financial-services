"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HMT_LOGO = "/hmt-logo-new.png?v=30";

export default function VerifyPage() {
  const router = useRouter();
  const [rollNo, setRollNo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanRollNo = rollNo.trim().toUpperCase();
    if (!cleanRollNo) return;
    router.push(`/verify/${encodeURIComponent(cleanRollNo)}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-amber-400/60 bg-white p-7 text-slate-950 shadow-2xl">
        <img src={HMT_LOGO} alt="HMT Success Academy" className="mx-auto h-24 w-24 object-contain" />
        <h1 className="mt-4 text-center text-2xl font-black text-[#031735]">Verify Student</h1>
        <p className="mt-2 text-center text-sm font-bold text-slate-500">Enter the roll number printed on the HMT student card.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="C-26-HMT001"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-center text-lg font-black uppercase outline-none focus:border-amber-500"
          />
          <button type="submit" className="w-full rounded-2xl bg-[#031735] px-4 py-3 text-sm font-black text-white hover:bg-[#08295a]">
            Check Student
          </button>
        </form>
      </div>
    </main>
  );
}
