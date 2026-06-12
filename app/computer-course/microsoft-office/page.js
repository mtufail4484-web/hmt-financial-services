import React from 'react';

// 🚀 GOOGLE SEO METADATA
export const metadata = {
  title: "Microsoft Office 2021 Professional Plus Free Download | HMT Academy",
  description: "Download Microsoft Office 2021 Professional Plus for free. Highly recommended setup for HMT Computer Course students with full installation guide.",
  keywords: ["microsoft office 2021 download", "ms office free download pakistan", "office 2021 pro plus", "hmt computer course tools"],
};

export default function MicrosoftOfficePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Required Course Software
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
            Microsoft Office <span className="text-emerald-600">2021 Pro Plus</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            HMT Success Academy ke Computer Course Batch 2 ke liye makhsoos MS Office ka setup, taake aap Excel aur Word ki practice asani se kar sakein.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden md:flex">
          
          {/* Left Side: System Requirements */}
          <div className="p-8 md:w-1/2 bg-slate-900 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-emerald-400">System Requirements:</h2>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Windows 10 or Windows 11 (64-bit)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Minimum 4 GB RAM</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Contains: Word, Excel, PowerPoint</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">Easy Lifetime Activation Guide</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-400 italic">
                Disclaimer: Yeh setup sirf educational aur practice purposes ke liye students ko faraham kiya ja raha hai.
              </p>
            </div>
          </div>

          {/* Right Side: Download Action */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center items-center text-center bg-white">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Secure Download Link</h3>
            <p className="text-sm text-slate-500 mb-6 px-4">
              Niche diye gaye Google Drive high-speed link se zip file download karein.
            </p>
            
            {/* 📥 ACTUAL DOWNLOAD BUTTON */}
            <a 
              href="https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Download Office 2021 Setup
            </a>

            <a 
              href="/computer-course" 
              className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              ← Back to Course Hub
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}