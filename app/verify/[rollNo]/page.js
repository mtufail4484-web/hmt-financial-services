"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const HMT_LOGO = "/hmt-logo-new.png?v=30";

const normalizeRollNo = (value = "") => String(value).trim().toUpperCase().replace(/\s+/g, "");

export default function VerifyStudentPage() {
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("loading");
  const rollNo = normalizeRollNo(decodeURIComponent(String(params?.rollNo || "")));

  useEffect(() => {
    const verifyStudent = async () => {
      if (!rollNo) {
        setStatus("missing");
        return;
      }

      try {
        const studentSnap = await getDoc(doc(db, "publicStudentVerifications", rollNo));

        if (!studentSnap.exists()) {
          setStatus("missing");
          return;
        }

        const publicStudent = studentSnap.data();
        if (publicStudent.accountStatus && publicStudent.accountStatus !== "active") {
          setStatus("inactive");
          return;
        }

        setStudent(publicStudent);
        setStatus("verified");
      } catch (err) {
        console.error("Student verification failed:", err);
        setStatus("error");
      }
    };

    verifyStudent();
  }, [rollNo]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-amber-400/60 bg-white text-slate-950 shadow-2xl overflow-hidden">
        <div className="bg-[#031735] px-6 py-7 text-center text-white">
          <img src={HMT_LOGO} alt="HMT Success Academy" className="mx-auto h-20 w-20 object-contain" />
          <h1 className="mt-3 text-2xl font-black tracking-wide">HMT Success Academy</h1>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.25em] text-amber-300">Student Verification</p>
        </div>

        <div className="p-6">
          {status === "loading" && (
            <p className="text-center text-sm font-bold text-slate-600">Checking student record...</p>
          )}

          {status === "missing" && (
            <div className="rounded-2xl bg-red-50 p-5 text-center text-red-700">
              <p className="text-lg font-black">Student Not Found</p>
              <p className="mt-1 text-sm font-bold">No verified record exists for {rollNo}.</p>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl bg-amber-50 p-5 text-center text-amber-800">
              <p className="text-lg font-black">Verification Unavailable</p>
              <p className="mt-1 text-sm font-bold">Please try again later.</p>
            </div>
          )}

          {status === "inactive" && (
            <div className="rounded-2xl bg-amber-50 p-5 text-center text-amber-800">
              <p className="text-lg font-black">Student Not Active</p>
              <p className="mt-1 text-sm font-bold">This student record is not currently active.</p>
            </div>
          )}

          {status === "verified" && student && (
            <div>
              {student.certificateIssued ? (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-7xl opacity-10">🎓</div>
                    <p className="text-sm font-black uppercase tracking-[0.15em] text-amber-200">Official Certificate Verified</p>
                    <p className="mt-2 text-2xl font-black tracking-tight">{student.rollNo}</p>
                    <div className="mt-3 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/25">
                      Verification ID: {student.certificateId || `HMT-CERT-${student.rollNo}`}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 text-xs sm:text-sm font-bold text-slate-800">
                    <h3 className="text-slate-900 font-extrabold text-sm border-b pb-2 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <span>🎖️ Certificate Details (سرٹیفکیٹ کی تفصیل)</span>
                    </h3>
                    <div className="flex justify-between gap-4 border-b pb-2 text-slate-600">
                      <span>Graduate Name</span>
                      <span className="text-slate-950 font-black">{student.name || "Verified Student"}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b pb-2 text-slate-600">
                      <span>Course Title</span>
                      <span className="text-slate-950 font-black">{student.course || "Free Computer Course 2026"}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b pb-2 text-slate-600">
                      <span>Issued On</span>
                      <span className="text-slate-950 font-black">
                        {student.certificateIssuedAt ? new Date(student.certificateIssuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                      </span>
                    </div>
                    <div className="border-b pb-3 space-y-2 text-slate-600">
                      <span className="block text-slate-600 font-bold">Passed Competency Suite:</span>
                      <div className="grid grid-cols-3 gap-2 text-center text-white mt-1 pt-1">
                        <div className="bg-[#031735] text-amber-300 font-black rounded-lg py-1.5 px-1 text-[10px] sm:text-[11px] border border-amber-400/40 shadow-xs">
                          MS WORD
                        </div>
                        <div className="bg-[#031735] text-amber-300 font-black rounded-lg py-1.5 px-1 text-[10px] sm:text-[11px] border border-amber-400/40 shadow-xs">
                          MS EXCEL
                        </div>
                        <div className="bg-[#031735] text-amber-300 font-black rounded-lg py-1.5 px-1 text-[10px] sm:text-[11px] border border-amber-400/40 shadow-xs">
                          POWERPOINT
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-600 items-center">
                      <span>Status</span>
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Verified Graduate
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="rounded-2xl bg-green-50 p-4 text-center text-green-700">
                    <p className="text-xl font-black">Verified Active Enrollment</p>
                    <p className="mt-1 text-sm font-bold">{student.rollNo}</p>
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 p-4 text-sm font-bold">
                    <div className="flex justify-between gap-4 border-b pb-2"><span>Course</span><span>{student.course || "Free Computer Course 2026"}</span></div>
                    <div className="flex justify-between gap-4"><span>Status</span><span className="text-green-700">Active Student</span></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
