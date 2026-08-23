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
      </div>
    </main>
  );
}
