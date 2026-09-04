"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

const SAMPLE_CV_DATA = {
  fullName: "Muhammad Hamza",
  jobTitle: "Computer Operator & Office Assistant",
  email: "hamza.office@gmail.com",
  phone: "+92 300 1234567",
  city: "Peshawar, KPK, Pakistan",
  linkedin: "linkedin.com/in/mhamza-hmt",
  summary:
    "Detail-oriented and resourceful Computer Operator with certification from HMT Success Academy. Proficient in MS Office 2021 (Word, Excel, PowerPoint), data entry, automated result card generation, and document management. Seeking an office administration role in a dynamic organization.",
  education: [
    {
      degree: "Bachelor of Science (BS Computer Science)",
      institute: "University of Peshawar",
      year: "2022 - 2026",
      details: "Marks: 3.6 / 4.0 CGPA. Focused on Information Systems and Data Science.",
    },
    {
      degree: "Diploma in Information Technology (DIT)",
      institute: "KPK Board of Technical Education",
      year: "2021 - 2022",
      details: "Grade: A+. Covered Windows OS, Networking, and Office Automation.",
    },
  ],
  experience: [
    {
      title: "Data Entry & Office Assistant",
      company: "HMT Digital Services, Peshawar",
      duration: "Jan 2024 - Present",
      desc: "Managed student records, generated attendance sheets and salary registers in Microsoft Excel, and prepared client reports.",
    },
  ],
  certifications: [
    "HMT Computer Course Master Certificate (Batch 02) - HMT Success Academy",
    "Microsoft Office Specialist (Excel & Word 2021)",
  ],
  skills: [
    "Microsoft Excel (VLOOKUP, Pivot Tables, Dashboards)",
    "Microsoft Word (CV Design, Formatting, Mail Merge)",
    "PowerPoint Presentation Design",
    "English & Urdu Typing (45 WPM)",
    "Data Backup & Cloud Management",
  ],
  languages: ["English (Professional)", "Urdu (Native)", "Pashto (Native)"],
};

export default function CvBuilderPage() {
  const [cv, setCv] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    city: "",
    linkedin: "",
    summary: "",
    education: [
      { degree: "", institute: "", year: "", details: "" },
    ],
    experience: [
      { title: "", company: "", duration: "", desc: "" },
    ],
    certifications: [""],
    skills: [""],
    languages: [""],
  });

  const [theme, setTheme] = useState("modern"); // modern | gold | minimalist

  const loadSampleData = () => {
    setCv(SAMPLE_CV_DATA);
  };

  const handlePrint = () => {
    window.print();
  };

  // Education handlers
  const handleEduChange = (idx, field, val) => {
    setCv((prev) => {
      const edu = [...prev.education];
      edu[idx][field] = val;
      return { ...prev, education: edu };
    });
  };

  const addEdu = () => {
    setCv((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institute: "", year: "", details: "" }],
    }));
  };

  const removeEdu = (idx) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  // Experience handlers
  const handleExpChange = (idx, field, val) => {
    setCv((prev) => {
      const exp = [...prev.experience];
      exp[idx][field] = val;
      return { ...prev, experience: exp };
    });
  };

  const addExp = () => {
    setCv((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: "", company: "", duration: "", desc: "" }],
    }));
  };

  const removeExp = (idx) => {
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  // Skills / Certs / Languages handlers
  const handleArrayChange = (category, idx, val) => {
    setCv((prev) => {
      const list = [...prev[category]];
      list[idx] = val;
      return { ...prev, [category]: list };
    });
  };

  const addArrayItem = (category) => {
    setCv((prev) => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));
  };

  const removeArrayItem = (category, idx) => {
    setCv((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* HEADER / NAV (Hidden during print) */}
      <div className="print:hidden">
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              📄 100% Free Online CV Builder
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ATS-Friendly Resume Generator
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create professional, job-ready PDF resumes tailored for ETEA, KPPSC, Bank, and Office Computer Operator applications by <strong className="text-amber-300">Muhammad Tufail</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={loadSampleData}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg"
              >
                ✨ Load Sample Student CV Data
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg flex items-center gap-1.5"
              >
                <span>🖨️ Print / Download PDF CV</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* CV BUILDER MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: FORM INPUTS (Hidden on print) */}
        <div className="lg:col-span-6 space-y-6 print:hidden">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white">👤 1. Personal Information</h2>
              <span className="text-xs text-amber-400 font-bold">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Hamza"
                  value={cv.fullName}
                  onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Job Title / Target Post *</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Operator"
                  value={cv.jobTitle}
                  onChange={(e) => setCv({ ...cv, jobTitle: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. hamza@gmail.com"
                  value={cv.email}
                  onChange={(e) => setCv({ ...cv, email: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Phone / WhatsApp *</label>
                <input
                  type="text"
                  placeholder="e.g. +92 300 1234567"
                  value={cv.phone}
                  onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">City, Province *</label>
                <input
                  type="text"
                  placeholder="e.g. Peshawar, KPK"
                  value={cv.city}
                  onChange={(e) => setCv({ ...cv, city: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">LinkedIn / Portfolio</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/..."
                  value={cv.linkedin}
                  onChange={(e) => setCv({ ...cv, linkedin: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold text-xs">Professional Summary / Objective</label>
              <textarea
                rows={3}
                placeholder="Brief introduction summarizing your skills, certification, and career goals..."
                value={cv.summary}
                onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* EDUCATION FORM */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white">🎓 2. Academic Qualification</h2>
              <button
                type="button"
                onClick={addEdu}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30"
              >
                + Add Degree
              </button>
            </div>

            {cv.education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs relative">
                {cv.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEdu(idx)}
                    className="absolute right-3 top-3 text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    ✕ Delete
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Degree / Diploma Title</label>
                    <input
                      type="text"
                      placeholder="BS Computer Science / DIT / Matric"
                      value={edu.degree}
                      onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Institute / Board</label>
                    <input
                      type="text"
                      placeholder="University of Peshawar / BISE"
                      value={edu.institute}
                      onChange={(e) => handleEduChange(idx, "institute", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Year (Duration)</label>
                    <input
                      type="text"
                      placeholder="2022 - 2026"
                      value={edu.year}
                      onChange={(e) => handleEduChange(idx, "year", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Grade / CGPA / Details</label>
                    <input
                      type="text"
                      placeholder="Grade A+ / 3.6 CGPA"
                      value={edu.details}
                      onChange={(e) => handleEduChange(idx, "details", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WORK EXPERIENCE FORM */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white">💼 3. Work Experience / Internships</h2>
              <button
                type="button"
                onClick={addExp}
                className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30"
              >
                + Add Work History
              </button>
            </div>

            {cv.experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs relative">
                {cv.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExp(idx)}
                    className="absolute right-3 top-3 text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    ✕ Delete
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Job Role / Title</label>
                    <input
                      type="text"
                      placeholder="Computer Operator"
                      value={exp.title}
                      onChange={(e) => handleExpChange(idx, "title", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Company / Dept</label>
                    <input
                      type="text"
                      placeholder="HMT Services / School Office"
                      value={exp.company}
                      onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Duration</label>
                  <input
                    type="text"
                    placeholder="Jan 2024 - Present"
                    value={exp.duration}
                    onChange={(e) => handleExpChange(idx, "duration", e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Key Responsibilities</label>
                  <textarea
                    rows={2}
                    placeholder="Describe main tasks performed..."
                    value={exp.desc}
                    onChange={(e) => handleExpChange(idx, "desc", e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SKILLS & CERTIFICATIONS */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h2 className="text-lg font-black text-white border-b border-slate-800 pb-3">🛠️ 4. Skills & Certifications</h2>

            {/* SKILLS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Key Technical Skills</span>
                <button type="button" onClick={() => addArrayItem("skills")} className="text-amber-400 hover:underline">+ Add Skill</button>
              </div>
              {cv.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. MS Excel VLOOKUP"
                    value={skill}
                    onChange={(e) => handleArrayChange("skills", idx, e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                  />
                  {cv.skills.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem("skills", idx)} className="text-rose-400 px-2 font-bold">✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* CERTIFICATIONS */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Certifications & Diplomas</span>
                <button type="button" onClick={() => addArrayItem("certifications")} className="text-amber-400 hover:underline">+ Add Cert</button>
              </div>
              {cv.certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. HMT Computer Course Certificate"
                    value={cert}
                    onChange={(e) => handleArrayChange("certifications", idx, e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
                  />
                  {cv.certifications.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem("certifications", idx)} className="text-rose-400 px-2 font-bold">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE RESUME PREVIEW & PRINT VIEW */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-3xl print:hidden">
            <h3 className="font-black text-sm text-white">🎨 Live ATS Preview</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme("modern")}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${theme === "modern" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                Modern Navy
              </button>
              <button
                onClick={() => setTheme("gold")}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${theme === "gold" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                Gold Executive
              </button>
              <button
                onClick={() => setTheme("minimalist")}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${theme === "minimalist" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}
              >
                Minimalist ATS
              </button>
            </div>
          </div>

          {/* PRINTABLE CV PAPER CARD */}
          <div
            id="printable-cv"
            className="w-full bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-6 text-sm font-sans min-h-[800px] border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-0"
          >
            {/* CV HEADER */}
            <div className={`pb-4 border-b ${theme === "gold" ? "border-amber-500" : "border-slate-800"}`}>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
                {cv.fullName || "YOUR FULL NAME"}
              </h1>
              <p className={`text-base font-bold uppercase tracking-wide mt-1 ${theme === "gold" ? "text-amber-700" : "text-blue-800"}`}>
                {cv.jobTitle || "Job Title / Target Post"}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold mt-3">
                {cv.email && <span>📧 {cv.email}</span>}
                {cv.phone && <span>📱 {cv.phone}</span>}
                {cv.city && <span>📍 {cv.city}</span>}
                {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
              </div>
            </div>

            {/* SUMMARY */}
            {cv.summary && (
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {cv.summary}
                </p>
              </div>
            )}

            {/* EDUCATION */}
            {cv.education.some((e) => e.degree) && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  {cv.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">{edu.degree}</h3>
                        <p className="text-xs text-slate-600">{edu.institute}</p>
                        {edu.details && <p className="text-[11px] text-slate-500 italic mt-0.5">{edu.details}</p>}
                      </div>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE */}
            {cv.experience.some((e) => e.title) && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-3">
                  {cv.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xs text-slate-900">{exp.title} - <span className="text-slate-700">{exp.company}</span></h3>
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{exp.duration}</span>
                      </div>
                      {exp.desc && <p className="text-xs text-slate-700 leading-relaxed">{exp.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS */}
            {cv.skills.some((s) => s) && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Key Skills & Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cv.skills.filter(Boolean).map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs font-bold text-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {cv.certifications.some((c) => c) && (
              <div className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Certifications & Achievements
                </h2>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1">
                  {cv.certifications.filter(Boolean).map((cert, idx) => (
                    <li key={idx} className="font-medium">{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FOOTER VERIFICATION STAMP */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>Created via HMT Success Academy Free ATS CV Builder</span>
              <span>www.hmtfinancialservices.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (Hidden during print) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Paid Services)</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/past-papers" className="hover:underline">Past Papers</Link>
            <Link href="/job-alerts" className="hover:underline">Job Alerts</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
