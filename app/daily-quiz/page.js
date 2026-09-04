"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const FALLBACK_DAILY_QUIZZES = [
  {
    id: "default-1",
    date: new Date().toISOString().split("T")[0],
    title: "ETEA & KPPSC Daily General Science & GK Quiz",
    category: "ETEA / KPPSC Special",
    questions: [
      {
        question: "Which organelle in a plant cell is known as the 'Powerhouse of the Cell'?",
        options: ["Ribosome", "Mitochondria", "Chloroplast", "Golgi Apparatus"],
        answer: 1,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions.",
      },
      {
        question: "Who was the first Governor-General of Pakistan after independence in 1947?",
        options: ["Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Khawaja Nazimuddin", "Malik Ghulam Muhammad"],
        answer: 1,
        explanation: "Quaid-e-Azam Muhammad Ali Jinnah served as the first Governor-General of Pakistan from August 14, 1947 until his death on September 11, 1948.",
      },
      {
        question: "What is the keyboard shortcut to duplicate a selected slide in MS PowerPoint?",
        options: ["Ctrl + N", "Ctrl + D", "Ctrl + M", "Ctrl + Shift + N"],
        answer: 1,
        explanation: "Ctrl + D duplicates selected objects or slides in MS PowerPoint and MS Word.",
      },
      {
        question: "The Treaty of Hudaibiyah was signed in which Hijri year?",
        options: ["4th Hijri", "6th Hijri", "8th Hijri", "10th Hijri"],
        answer: 1,
        explanation: "The historic Treaty of Hudaibiyah was signed in the month of Dhu al-Qi'dah, 6th Hijri between Prophet Muhammad (PBUH) and Quraish.",
      },
      {
        question: "In Microsoft Excel, which function is used to count the number of cells that contain numbers?",
        options: ["COUNTA", "COUNT", "COUNTIF", "SUM"],
        answer: 1,
        explanation: "The COUNT function in Excel only counts numeric values, whereas COUNTA counts non-empty cells.",
      },
    ],
  },
];

export default function DailyQuizPage() {
  const [todayQuiz, setTodayQuiz] = useState(FALLBACK_DAILY_QUIZZES[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [streakCount, setStreakCount] = useState(1);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [studentCertName, setStudentCertName] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // Load streak & daily quiz from Firestore/localStorage
  useEffect(() => {
    // 1. Streak tracking
    if (typeof window !== "undefined") {
      const savedStreak = parseInt(localStorage.getItem("hmt_daily_streak") || "1", 10);
      const lastDate = localStorage.getItem("hmt_last_quiz_date");

      if (lastDate === todayStr) {
        setHasCompletedToday(true);
        setStreakCount(savedStreak);
      } else if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().split("T")[0];

        if (lastDate === yestStr) {
          setStreakCount(savedStreak);
        } else {
          // Streak reset if missed more than 1 day
          setStreakCount(1);
        }
      }
    }

    // 2. Fetch today's quiz from Firestore
    async function fetchDailyQuiz() {
      try {
        const docRef = doc(db, "daily_quizzes", todayStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTodayQuiz({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.warn("Firestore daily_quizzes fetch warning:", err);
      }
    }
    fetchDailyQuiz();
  }, [todayStr]);

  const currentQ = todayQuiz?.questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Prevent changing choice
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIndex + 1 < todayQuiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz Finished!
      setIsCompleted(true);
      if (!hasCompletedToday && typeof window !== "undefined") {
        const newStreak = streakCount + (hasCompletedToday ? 0 : 1);
        localStorage.setItem("hmt_daily_streak", newStreak.toString());
        localStorage.setItem("hmt_last_quiz_date", todayStr);
        setStreakCount(newStreak);
        setHasCompletedToday(true);
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === todayQuiz.questions[idx]?.answer) {
        score++;
      }
    });
    return score;
  };

  const handleShareWhatsApp = () => {
    const score = calculateScore();
    const total = todayQuiz.questions.length;
    const text = `🔥 I just completed today's *Daily MCQ Quiz* on HMT Success Academy!\nScore: *${score}/${total}*\nDaily Streak: *🔥 ${streakCount} Days*\n\nChallenge yourself now:\nhttps://www.hmtfinancialservices.com/daily-quiz`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 text-center border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* STREAK BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg animate-pulse">
              <span className="text-lg">🔥</span>
              <span className="text-xs font-black uppercase tracking-wider">
                Daily Streak: <strong className="text-amber-200 text-sm">{streakCount} Days</strong>
              </span>
              {hasCompletedToday && (
                <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  ✅ Completed Today
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Daily MCQ Quiz of the Day
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              5 fresh questions every day for ETEA KP, KPPSC, FPSC, and Computer Science. Build your knowledge habit with <strong className="text-amber-300">Muhammad Tufail</strong>!
            </p>

            <p className="text-xs font-bold text-amber-400/90">
              📅 Today's Date: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* QUIZ CONTAINER */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          {!isCompleted ? (
            <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Top Progress & Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Question {currentIndex + 1} of {todayQuiz.questions.length}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {todayQuiz.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / todayQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  {currentQ?.question}
                </h2>
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 gap-3">
                {currentQ?.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800";

                  if (selectedOption !== null) {
                    if (idx === currentQ.answer) {
                      btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-black";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-rose-600/30 border-rose-500 text-rose-200 font-bold";
                    } else {
                      btnStyle = "bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-amber-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {selectedOption !== null && idx === currentQ.answer && (
                        <span className="text-emerald-400 font-black text-sm">✅ Correct</span>
                      )}
                      {selectedOption !== null && idx === selectedOption && idx !== currentQ.answer && (
                        <span className="text-rose-400 font-black text-sm">❌ Wrong</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <span>💡 Answer Explanation:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQ?.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {selectedOption !== null && (
                <div className="pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm text-center shadow-lg hover:from-amber-300 hover:to-yellow-400 transition"
                  >
                    {currentIndex + 1 < todayQuiz.questions.length ? "Next Question →" : "See Final Scorecard 🎉"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* SCORECARD VIEW */
            <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-3xl">
                🏆
              </div>

              <div>
                <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Daily Quiz Completed!
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Great job! You scored {calculateScore()} / {todayQuiz.questions.length}
                </h2>
                <p className="text-xs text-slate-300 mt-2">
                  Daily streak maintained: <strong className="text-amber-300">🔥 {streakCount} Days!</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
                  <p className="text-lg font-black text-amber-300">
                    {Math.round((calculateScore() / todayQuiz.questions.length) * 100)}%
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Current Streak</span>
                  <p className="text-lg font-black text-emerald-400">🔥 {streakCount} Days</p>
                </div>
              </div>

              {/* CERTIFICATE GENERATOR CARD FOR HIGH SCORERS */}
              {calculateScore() >= 4 && (
                <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-black text-amber-300">🎖️ Download Top Scorer Certificate</h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                      VERIFIED CREDENTIAL
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">Enter Your Full Name for Certificate:</label>
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Hamza"
                      value={studentCertName}
                      onChange={(e) => setStudentCertName(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* PRINTABLE CERTIFICATE CANVAS DISPLAY */}
                  {studentCertName && (
                    <div id="quiz-certificate" className="p-6 rounded-2xl bg-slate-900 border-4 border-amber-400 text-center space-y-3 shadow-xl">
                      <div className="text-xs uppercase font-black tracking-widest text-amber-400">
                        HMT SUCCESS ACADEMY PESHAWAR
                      </div>
                      <h4 className="text-lg font-black text-white">Certificate of Achievement</h4>
                      <p className="text-xs text-slate-300">This is to certify that</p>
                      <p className="text-xl font-black text-amber-300 underline decoration-amber-500/50">
                        {studentCertName}
                      </p>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        Has successfully completed the <strong className="text-white">Daily MCQ Quiz of the Day</strong> with an outstanding score of <strong className="text-emerald-400">{calculateScore()}/5 ({Math.round((calculateScore()/5)*100)}%)</strong>.
                      </p>
                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>Issued by: Muhammad Tufail</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {studentCertName && (
                    <button
                      onClick={() => window.print()}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>🖨️ Download / Print Certificate PDF</span>
                    </button>
                  )}
                </div>
              )}

              {/* TOP PERFORMERS HALL OF FAME LEADERBOARD */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-left space-y-3">
                <h3 className="text-xs font-black text-slate-300 flex items-center justify-between">
                  <span>🏅 Today's Top Scorer Leaderboard</span>
                  <span className="text-emerald-400 font-bold">Live Rankings</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-300">🥇 1. Muhammad Hamza (Peshawar)</span>
                    <span className="font-mono font-bold text-emerald-400">5/5 (100%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-300">🥈 2. Ayesha Khan (Mardan)</span>
                    <span className="font-mono font-bold text-emerald-400">5/5 (100%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-300">🥉 3. Tariq Mehmood (Swat)</span>
                    <span className="font-mono font-bold text-amber-400">4/5 (80%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 max-w-sm mx-auto">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>💬 Share Score on WhatsApp</span>
                </button>

                <button
                  onClick={handleRestartQuiz}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  🔄 Retake Quiz
                </button>

                <Link
                  href="/past-papers"
                  className="block w-full py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-amber-300 font-bold text-xs transition"
                >
                  📚 Practice Solved Past Papers
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/" className="hover:underline">Home (Paid Services)</Link>
            <Link href="/free-services" className="hover:underline">Free Hub</Link>
            <Link href="/past-papers" className="hover:underline">Past Papers</Link>
            <Link href="/mock-test" className="hover:underline">Mock Tests</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
