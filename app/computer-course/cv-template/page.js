import React from 'react';

// 🚀 GOOGLE SEO METADATA
export const metadata = {
  title: "Free Professional CV Template Download (Word Format) | HMT Academy",
  description: "Download 100% free professional CV templates in Microsoft Word (.docx) format. Ready-to-use resume formats for freshers and experienced professionals in Pakistan.",
  keywords: ["free cv template", "cv format word", "resume download pakistan", "hmt computer course", "professional cv format"],
};

export default function CvTemplatePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Free Student Resource
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
            Professional CV Template <span className="text-blue-600">Word Format</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            HMT Success Academy ke students aur tamam professionals ke liye aik behtareen aur standard CV format, jo aap ke career ko boost karega.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden md:flex">
          
          {/* Left Side: Preview Features */}
          <div className="p-8 md:w-1/2 bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-blue-400">CV Key Features:</h2>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">ATS Friendly Layout (Job Selection Safe)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Easily Editable in MS Word</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Clean & Modern Typography</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Perfect for Freshers & Experts</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 italic">
                Note: Yeh template Microsoft Word (.docx) format mein hai. Download karne ke baad aap is ko apne mutabiq edit kar sakte hain.
              </p>
            </div>
          </div>

          {/* Right Side: Download Action */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center items-center text-center bg-white">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Download</h3>
            <p className="text-sm text-slate-500 mb-6 px-4">
              Niche diye gaye button par click karein aur apni CV template foran save karein.
            </p>
            
            {/* 📥 ACTUAL DOWNLOAD BUTTON */}
            <a 
              href="/files/HMT-Professional-CV-Template.docx" 
              download
              className="w-full inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CV Template (.docx)
            </a>

            <a 
              href="/computer-course" 
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Course Hub
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}