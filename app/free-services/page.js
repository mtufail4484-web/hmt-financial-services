"use client";

import Link from "next/link";
import HeaderNav from "../HeaderNav";

export default function FreeServicesPage() {
  const freePortals = [
    {
      title: "ETEA & Competitive Exam Past Papers",
      subtitle: "ETEA KP • KPPSC • FPSC • Solved Notes PDF",
      desc: "Free downloadable authentic solved past papers, PST/CT/SST revision notes, FPSC General Knowledge, and MS Office textbook guides.",
      image: "/hmt-logo-new.png",
      link: "/past-papers",
      badge: "📚 PAST PAPERS REPOSITORY",
      btnText: "📥 Browse & Download PDFs",
      color: "from-amber-500 to-yellow-600",
    },
    {
      title: "Daily MCQ Quiz of the Day",
      subtitle: "5 Fresh Daily MCQs • 🔥 Streak Tracker",
      desc: "Practice 5 fresh competitive exam MCQs daily, build your daily preparation streak, view detailed explanations, and earn score badges.",
      image: "/hmt-logo-new.png",
      link: "/daily-quiz",
      badge: "⚡ DAILY PRACTICE QUIZ",
      btnText: "🔥 Start Today's Quiz",
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Govt & ETEA Job Announcements Portal",
      subtitle: "ETEA Jobs • KPPSC • FPSC • PDF Advertisements",
      desc: "Real-time updates for active job advertisements in KPK and Pakistan with official PDF downloads, application deadlines, and apply guides.",
      image: "/hmt-logo-new.png",
      link: "/job-alerts",
      badge: "📢 JOB ALERTS PORTAL",
      btnText: "🔔 View Active Job Alerts",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "ETEA & KPPSC Merit Aggregate Calculator",
      subtitle: "PST • CT • SST • Computer Operator Formula",
      desc: "Instantly calculate your total recruitment merit percentage out of 100 based on official KPK government academic and test formulas.",
      image: "/hmt-logo-new.png",
      link: "/merit-calculator",
      badge: "🧮 MERIT CALCULATOR",
      btnText: "📊 Calculate Your Merit Score",
      color: "from-amber-500 to-yellow-600",
    },
    {
      title: "Roll No Slip & Exam Center Direct Finder",
      subtitle: "ETEA Slips • KPPSC • FPSC • NTS Roll Numbers",
      desc: "Direct official download links for exam roll number slips, test venue locators, and CNIC search guidelines across Pakistan.",
      image: "/hmt-logo-new.png",
      link: "/rollno-slips",
      badge: "📇 ROLL NO SLIP HUB",
      btnText: "📇 Find Your Roll No Slip",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Instant ATS Professional CV Builder",
      subtitle: "Free Resume Maker • ATS Templates • PDF Export",
      desc: "Generate clean, modern ATS-friendly resumes online. Ideal for computer course students and job seekers applying for govt & private posts.",
      image: "/Excel Automation.jpg",
      link: "/cv-builder",
      badge: "📄 FREE ATS CV BUILDER",
      btnText: "📝 Create Your CV Now",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Official WhatsApp & Community Study Groups",
      subtitle: "ETEA Group • KPPSC Group • Student Broadcast",
      desc: "Direct join buttons for official WhatsApp and Telegram study groups hosted by Muhammad Tufail for instant material sharing.",
      image: "/logo.png",
      link: "/whatsapp-groups",
      badge: "💬 STUDY GROUPS HUB",
      btnText: "💬 Join WhatsApp Groups",
      color: "from-emerald-600 to-green-700",
    },
    {
      title: "ETEA & Competitive Exam Mock Tests",
      subtitle: "ETEA KP • KPPSC • PPSC • FPSC • CSS",
      desc: "Free real-time timed mock tests with authentic question banks, skip MCQ feature, live progress tracking, and instant scorecard certificates.",
      image: "/hmt-logo-new.png",
      link: "/mock-test",
      badge: "🎯 FREE EXAM PORTAL",
      btnText: "🚀 Start Practice Mock Test",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Free Live Computer Course",
      subtitle: "Batch 02 Live • MS Office • CV Making",
      desc: "Comprehensive computer training including Windows basics, Word, Excel, PowerPoint, CV creation, and office productivity skills with progress tracking.",
      image: "/computer-course.jpg",
      link: "/computer-course",
      badge: "🎓 FREE LIVE COURSE",
      btnText: "📚 Enter Course Hub",
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Free Student Tools & Office Utilities",
      subtitle: "CV Templates • Office Formulas • Calculators",
      desc: "Free online tools for students and job seekers. Practice MS Office shortcuts and access financial productivity tools.",
      image: "/Excel Automation.jpg",
      link: "/tools",
      badge: "🛠️ FREE TOOLS",
      btnText: "⚙️ Access Free Tools",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Official Student Verification Portal",
      subtitle: "QR Verification • Student IDs • Certificates",
      desc: "Public verification system to authenticate student enrollment, roll numbers, course completion certificates, and digital ID cards.",
      image: "/hmt-logo-new.png",
      link: "/verify",
      badge: "🔍 VERIFICATION PORTAL",
      btnText: "✅ Verify Certificate",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "HMT Student Academy Portal",
      subtitle: "Lecture Progress • Assignments • Roll No Login",
      desc: "Dedicated student portal for watching course lectures, submitting assignments, tracking attendance, and communicating with academy instructors.",
      image: "/logo.png",
      link: "/portal",
      badge: "💻 ACADEMY PORTAL",
      btnText: "🔑 Student Login Portal",
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-16 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              🎁 100% Free Educational Resources
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              HMT Free Services & Student Resources Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering students and job candidates across Pakistan with free competitive exam mock test suites, live computer courses, CV creation tools, and official certificate verification.
            </p>
          </div>
        </section>

        {/* PORTALS & SERVICES GRID */}
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freePortals.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-amber-500/20"
              >
                <div>
                  {/* Top Badge & Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-950 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">100% FREE</span>
                  </div>

                  {/* Image Display */}
                  <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-950 mb-5 flex items-center justify-center p-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs font-semibold text-amber-400/90 mt-1">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <div className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs text-center shadow-lg group-hover:shadow-amber-400/30 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>{item.btnText}</span>
                    <span className="text-sm">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Commercial Services)</Link>
            <Link href="/mock-test" className="hover:underline">Mock Tests</Link>
            <Link href="/computer-course" className="hover:underline">Computer Course</Link>
            <Link href="/portal" className="hover:underline">Student Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
