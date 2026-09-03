"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- COMMISSIONS & TESTING AGENCIES ---
const EXAM_CATEGORIES = [
  {
    id: "etea",
    name: "ETEA KP - Testing & Evaluation Agency",
    subtitle: "Medical/Engineering Entry Tests, PST, CT, SST & Police Recruitment",
    badge: "KP ETEA",
    color: "from-purple-700 to-violet-900",
    lightBg: "bg-purple-50 text-purple-900 border-purple-300",
    icon: "📝",
    totalQuestions: 20,
    timeMinutes: 20,
    passingPercent: 50,
    subjects: ["Pedagogy & Teaching", "General Science", "English Grammar", "Mathematics", "Islamic Studies"],
  },
  {
    id: "kppsc",
    name: "KPPSC - Khyber Pakhtunkhwa PSC",
    subtitle: "Provincial Civil Service, Tehsildar, Lecturer & Subject Specialist",
    badge: "KPPSC",
    color: "from-amber-600 to-yellow-800",
    lightBg: "bg-amber-50 text-amber-900 border-amber-300",
    icon: "🏔️",
    totalQuestions: 20,
    timeMinutes: 20,
    passingPercent: 55,
    subjects: ["KP Geography & History", "General Knowledge", "English Precis", "Islamic Studies", "Everyday Science"],
  },
  {
    id: "ppsc",
    name: "PPSC - Punjab Public Service Commission",
    subtitle: "PMS, Tehsildar, Sub-Inspector, Assistant, Lecturer & Land Record Officer",
    badge: "PPSC",
    color: "from-emerald-700 to-teal-900",
    lightBg: "bg-emerald-50 text-emerald-900 border-emerald-300",
    icon: "📜",
    totalQuestions: 20,
    timeMinutes: 20,
    passingPercent: 50,
    subjects: ["Pakistan Studies", "Islamic Studies", "General Knowledge", "Urdu Grammar", "Basic Computer"],
  },
  {
    id: "fpsc",
    name: "FPSC - Federal Public Service Commission",
    subtitle: "Inspector FIA, Custom Inspector, SST, CSS Screening & AD Tests",
    badge: "FPSC",
    color: "from-blue-700 to-indigo-900",
    lightBg: "bg-blue-50 text-blue-900 border-blue-300",
    icon: "🏛️",
    totalQuestions: 20,
    timeMinutes: 20,
    passingPercent: 60,
    subjects: ["English Grammar", "Everyday Science", "Pakistan Affairs", "General Knowledge", "Math & Logic"],
  },
  {
    id: "css_pms",
    name: "CSS & PMS Elite Civil Services",
    subtitle: "Central Superior Services & Provincial Management Service",
    badge: "CSS / PMS",
    color: "from-rose-700 to-pink-900",
    lightBg: "bg-rose-50 text-rose-900 border-rose-300",
    icon: "⚖️",
    totalQuestions: 20,
    timeMinutes: 20,
    passingPercent: 60,
    subjects: ["Current Affairs", "International Relations", "Pakistan Affairs", "Everyday Science", "English Precis"],
  },
  {
    id: "nts_gat",
    name: "NTS / GAT / NAT General Aptitude",
    subtitle: "National Testing Service & University Entry Exams",
    badge: "NTS / GAT",
    color: "from-cyan-700 to-blue-900",
    lightBg: "bg-cyan-50 text-cyan-900 border-cyan-300",
    icon: "📊",
    totalQuestions: 15,
    timeMinutes: 15,
    passingPercent: 50,
    subjects: ["Verbal Reasoning", "Analytical Ability", "Quantitative Reasoning"],
  },
  {
    id: "banking",
    name: "Banking & Financial Officers",
    subtitle: "State Bank of Pakistan, NBP, Commercial Banking Officer Exams",
    badge: "Banking",
    color: "from-emerald-800 to-green-950",
    lightBg: "bg-emerald-50 text-emerald-900 border-emerald-300",
    icon: "🏦",
    totalQuestions: 15,
    timeMinutes: 15,
    passingPercent: 55,
    subjects: ["Commercial Banking", "Accounting Concepts", "Economic Concepts", "Quantitative Math"],
  },
  {
    id: "it_officer",
    name: "Computer & IT Specialist Exams",
    subtitle: "System Administrator, Software Engineer & IT Officer Screening",
    badge: "IT Officer",
    color: "from-sky-700 to-indigo-950",
    lightBg: "bg-sky-50 text-sky-900 border-sky-300",
    icon: "💻",
    totalQuestions: 15,
    timeMinutes: 15,
    passingPercent: 60,
    subjects: ["Networking", "DBMS", "Operating Systems", "Cybersecurity", "Programming"],
  },
];

// --- EXPANDED AUTHENTIC MCQ QUESTION BANK ---
const QUESTION_BANK = {
  etea: [
    {
      id: "etea-1",
      commission: "ETEA KP",
      section: "Pedagogy & Teaching",
      question: "In Bloom's Taxonomy, which level represents the highest order of cognitive thinking?",
      options: ["Knowledge", "Application", "Evaluation / Creating", "Comprehension"],
      correctAnswer: 2,
      explanation:
        "In Benjamin Bloom's taxonomy of educational objectives, 'Evaluation' (or 'Creating' in the revised taxonomy) represents the highest level of cognitive processing.",
      difficulty: "Medium",
    },
    {
      id: "etea-2",
      commission: "ETEA KP",
      section: "General Science",
      question: "What is the SI unit of Electric Current?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      correctAnswer: 1,
      explanation:
        "The SI base unit of electric current is the Ampere (symbol: A), named after French physicist André-Marie Ampère.",
      difficulty: "Easy",
    },
    {
      id: "etea-3",
      commission: "ETEA KP",
      section: "English Grammar",
      question: "Identify the part of speech of the underlined word: 'She sang **melodiously**.'",
      options: ["Adjective", "Adverb", "Noun", "Conjunction"],
      correctAnswer: 1,
      explanation:
        "'Melodiously' modifies the verb 'sang', describing how she sang; therefore it is an Adverb of manner.",
      difficulty: "Easy",
    },
    {
      id: "etea-4",
      commission: "ETEA KP",
      section: "Mathematics",
      question: "Solve the quadratic equation: x² - 9 = 0. What are the roots?",
      options: ["x = 3 only", "x = -3 only", "x = ±3", "x = ±9"],
      correctAnswer: 2,
      explanation:
        "x² - 9 = 0 => x² = 9 => x = ±√9 = ±3.",
      difficulty: "Easy",
    },
    {
      id: "etea-5",
      commission: "ETEA KP",
      section: "Pedagogy & Teaching",
      question: "According to Jean Piaget's theory of cognitive development, the 'Concrete Operational Stage' occurs between ages:",
      options: ["0 to 2 years", "2 to 7 years", "7 to 11 years", "12 years and above"],
      correctAnswer: 2,
      explanation:
        "Piaget's Concrete Operational Stage spans from approximately age 7 to 11, characterized by logical thinking about concrete events.",
      difficulty: "Hard",
    },
    {
      id: "etea-6",
      commission: "ETEA KP",
      section: "General Science",
      question: "What is the chemical symbol for Gold in the Periodic Table?",
      options: ["Ag", "Au", "Fe", "Pb"],
      correctAnswer: 1,
      explanation:
        "Gold's chemical symbol 'Au' derives from its Latin name 'Aurum', meaning 'glowing dawn'.",
      difficulty: "Easy",
    },
    {
      id: "etea-7",
      commission: "ETEA KP",
      section: "General Science",
      question: "Which organelle is known as the 'Powerhouse of the Cell'?",
      options: ["Ribosome", "Nucleus", "Mitochondria", "Golgi Apparatus"],
      correctAnswer: 2,
      explanation:
        "Mitochondria generate most of the chemical energy (ATP) needed to power the cell's biochemical reactions.",
      difficulty: "Easy",
    },
    {
      id: "etea-8",
      commission: "ETEA KP",
      section: "Islamic Studies",
      question: "Which charter formed the first written constitution in human history by Prophet Muhammad (PBUH)?",
      options: ["Treaty of Hudaibiyyah", "Pact of Medina (Misaq-e-Medina)", "Farewell Sermon", "Conquest of Makkah"],
      correctAnswer: 1,
      explanation:
        "Misaq-e-Medina (622 CE) was drafted by Prophet Muhammad (PBUH) as the first constitutional document guaranteeing equal rights and protection for all tribes.",
      difficulty: "Medium",
    },
    {
      id: "etea-9",
      commission: "ETEA KP",
      section: "Pedagogy & Teaching",
      question: "What is the primary objective of Formative Assessment in classroom teaching?",
      options: [
        "To assign final letter grades at year-end",
        "To monitor ongoing student learning and provide immediate feedback",
        "To rank students for scholarship awards",
        "To evaluate school infrastructure",
      ],
      correctAnswer: 1,
      explanation:
        "Formative Assessment is diagnostic, aimed at helping teachers adjust teaching strategies and providing students ongoing feedback during learning.",
      difficulty: "Medium",
    },
    {
      id: "etea-10",
      commission: "ETEA KP",
      section: "Mathematics",
      question: "Find the median of the data set: 12, 5, 22, 17, 9, 30, 15.",
      options: ["12", "15", "17", "9"],
      correctAnswer: 1,
      explanation:
        "First sort the data: 5, 9, 12, 15, 17, 22, 30. The middle (4th) value out of 7 numbers is 15.",
      difficulty: "Medium",
    },
  ],
  kppsc: [
    {
      id: "kppsc-1",
      commission: "KPPSC",
      section: "KP Geography & History",
      question: "Which famous mountain pass connects Peshawar in Pakistan with Kabul in Afghanistan?",
      options: ["Bolan Pass", "Khyber Pass", "Tochi Pass", "Karakoram Pass"],
      correctAnswer: 1,
      explanation:
        "The Khyber Pass is a historic mountain pass in the Spin Ghar mountains connecting the Peshawar valley of Pakistan with Kabul in Afghanistan, stretching approximately 53 km.",
      difficulty: "Easy",
    },
    {
      id: "kppsc-2",
      commission: "KPPSC",
      section: "General Knowledge",
      question: "What is the highest mountain peak of the Hindu Kush range?",
      options: ["Nanga Parbat", "K2", "Tirich Mir", "Rakaposhi"],
      correctAnswer: 2,
      explanation:
        "Tirich Mir (7,708 meters / 25,289 ft), located in Chitral District of Khyber Pakhtunkhwa, is the highest peak of the Hindu Kush mountain range.",
      difficulty: "Medium",
    },
    {
      id: "kppsc-3",
      commission: "KPPSC",
      section: "English Precis",
      question: "Select the word that is nearest in meaning to 'GREGARIOUS':",
      options: ["Introverted", "Sociable & outgoing", "Aggressive", "Solitary"],
      correctAnswer: 1,
      explanation:
        "'Gregarious' describes a person fond of company or living in flocks/communities; its direct synonym is 'Sociable' or 'Outgoing'.",
      difficulty: "Medium",
    },
    {
      id: "kppsc-4",
      commission: "KPPSC",
      section: "Islamic Studies",
      question: "Which Sahabi (RA) was appointed as the first Governor of Syria by Hazrat Umar Farooq (RA)?",
      options: ["Hazrat Khalid bin Walid (RA)", "Hazrat Abu Ubaidah ibn al-Jarrah (RA)", "Hazrat Muawiyah ibn Abi Sufyan (RA)", "Hazrat Amr ibn al-Aas (RA)"],
      correctAnswer: 1,
      explanation:
        "Hazrat Abu Ubaidah ibn al-Jarrah (RA) served as commander and governor of Syria, succeeded later by Hazrat Muawiyah (RA) after the plague of Amwas.",
      difficulty: "Hard",
    },
    {
      id: "kppsc-5",
      commission: "KPPSC",
      section: "Everyday Science",
      question: "Which vitamin is essential for blood clotting?",
      options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
      correctAnswer: 3,
      explanation:
        "Vitamin K plays a vital role in blood clotting by producing prothrombin and other coagulation factors.",
      difficulty: "Easy",
    },
    {
      id: "kppsc-6",
      commission: "KPPSC",
      section: "KP History",
      question: "What was the ancient name of Peshawar during the Kushan Empire era?",
      options: ["Purushapura", "Taxila", "Gandhara", "Margalla"],
      correctAnswer: 0,
      explanation:
        "Peshawar was known as Purushapura under Emperor Kanishka in the 2nd century CE when it served as the capital of the Kushan Empire.",
      difficulty: "Medium",
    },
    {
      id: "kppsc-7",
      commission: "KPPSC",
      section: "Pakistan Affairs",
      question: "On which river is the Warsak Dam built in Khyber Pakhtunkhwa?",
      options: ["Indus River", "Kabul River", "Swat River", "Kurram River"],
      correctAnswer: 1,
      explanation:
        "Warsak Dam is a mass concrete gravity dam located on the Kabul River, approximately 20 km northwest of Peshawar.",
      difficulty: "Easy",
    },
    {
      id: "kppsc-8",
      commission: "KPPSC",
      section: "General Knowledge",
      question: "Which is the largest and deepest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      correctAnswer: 2,
      explanation:
        "The Pacific Ocean covers over 30% of the Earth's surface and contains Mariana Trench, the deepest point on Earth.",
      difficulty: "Easy",
    },
  ],
  ppsc: [
    {
      id: "ppsc-1",
      commission: "PPSC",
      section: "Pakistan Studies",
      question: "Who was the founder and first editor-in-chief of the English newspaper 'Dawn'?",
      options: ["Liaquat Ali Khan", "Quaid-e-Azam Muhammad Ali Jinnah", "Maulana Muhammad Ali Jauhar", "Hussain Shaheed Suhrawardy"],
      correctAnswer: 1,
      explanation:
        "Quaid-e-Azam Muhammad Ali Jinnah founded 'Dawn' in Delhi in 1941 as a mouthpiece for the All-India Muslim League to represent the Muslim cause to the English-speaking world.",
      difficulty: "Medium",
    },
    {
      id: "ppsc-2",
      commission: "PPSC",
      section: "Islamic Studies",
      question: "In which Battle was the Holy Prophet Muhammad (PBUH) injured and his tooth blessed with martyrdom?",
      options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq (Trench)", "Battle of Hunayn"],
      correctAnswer: 1,
      explanation:
        "During the Battle of Uhud (3 AH / 625 CE), the Holy Prophet Muhammad (PBUH) sustained injuries to his face and tooth when rumors of his martyrdom spread temporarily.",
      difficulty: "Easy",
    },
    {
      id: "ppsc-3",
      commission: "PPSC",
      section: "General Knowledge",
      question: "Which is the largest dam in Pakistan by structural volume?",
      options: ["Tarbela Dam", "Mangla Dam", "Warsak Dam", "Diamer-Bhasha Dam"],
      correctAnswer: 0,
      explanation:
        "Tarbela Dam on the Indus River in Khyber Pakhtunkhwa is the world's largest earth-filled dam and the largest dam by structural volume in Pakistan.",
      difficulty: "Easy",
    },
    {
      id: "ppsc-4",
      commission: "PPSC",
      section: "Urdu Grammar",
      question: "علامہ اقبال کا پہلا اردو شعری مجموعہ کونسا ہے؟",
      options: ["بالِ جبریل", "بانگِ درا", "ضربِ کلیم", "ارمغانِ حجاز"],
      correctAnswer: 1,
      explanation:
        "'بانگِ درا' علامہ محمد اقبال کا پہلا اردو مجموعہ کلام ہے جو 1924 میں شائع ہوا۔",
      difficulty: "Easy",
    },
    {
      id: "ppsc-5",
      commission: "PPSC",
      section: "Basic Computer",
      question: "What is the shortcut key to permanently delete a file in Windows without sending it to the Recycle Bin?",
      options: ["Ctrl + Delete", "Shift + Delete", "Alt + Delete", "Ctrl + Shift + Esc"],
      correctAnswer: 1,
      explanation:
        "Pressing Shift + Delete in Windows bypasses the Recycle Bin and immediately purges the selected file.",
      difficulty: "Easy",
    },
    {
      id: "ppsc-6",
      commission: "PPSC",
      section: "Pakistan Studies",
      question: "Who was the first Chief Justice of Pakistan?",
      options: ["Justice Muhammad Munir", "Justice Sir Abdul Rashid", "Justice Alvin Robert Cornelius", "Justice M.R. Kayani"],
      correctAnswer: 1,
      explanation:
        "Justice Sir Mian Abdul Rashid administered the oath of office to Quaid-e-Azam Muhammad Ali Jinnah as Governor-General in August 1947 and served as the 1st Chief Justice of Pakistan.",
      difficulty: "Medium",
    },
    {
      id: "ppsc-7",
      commission: "PPSC",
      section: "Urdu Literature",
      question: "مسدسِ حالی کا اصل نام کیا تھا؟",
      options: ["مد و جزرِ اسلام", "شکوہ و جوابِ شکوہ", "یادگارِ غالب", "حیاتِ جاوید"],
      correctAnswer: 0,
      explanation:
        "مولانا الطاف حسین حالی کی مشہور نظم 'مسدسِ حالی' کا اصل نام 'مد و جزرِ اسلام' تھا جو 1879 میں لکھی گئی۔",
      difficulty: "Hard",
    },
    {
      id: "ppsc-8",
      commission: "PPSC",
      section: "Everyday Science",
      question: "What is the hardest naturally occurring substance on Earth?",
      options: ["Quartz", "Granite", "Diamond", "Titanium"],
      correctAnswer: 2,
      explanation:
        "Diamond is a solid form of pure carbon with atoms arranged in a crystal structure, rating 10 on the Mohs scale of mineral hardness.",
      difficulty: "Easy",
    },
  ],
  fpsc: [
    {
      id: "fpsc-1",
      commission: "FPSC",
      section: "General Knowledge",
      question: "Which organ of the United Nations is primarily responsible for maintaining international peace and security?",
      options: [
        "International Court of Justice",
        "United Nations Security Council (UNSC)",
        "General Assembly",
        "Economic and Social Council",
      ],
      correctAnswer: 1,
      explanation:
        "Under the UN Charter, the Security Council has primary responsibility for the maintenance of international peace and security. It has 15 members (5 permanent with veto power and 10 non-permanent).",
      difficulty: "Medium",
    },
    {
      id: "fpsc-2",
      commission: "FPSC",
      section: "Pakistan Affairs",
      question: "The Simla Deputation met Lord Minto in which year to present demands for separate electorates?",
      options: ["1905", "1906", "1909", "1916"],
      correctAnswer: 1,
      explanation:
        "On October 1, 1906, a delegation of 35 Muslim leaders led by Sir Aga Khan III met Viceroy Lord Minto at Simla to demand separate electorates for Muslims, leading to the formation of the All-India Muslim League in December 1906.",
      difficulty: "Medium",
    },
    {
      id: "fpsc-3",
      commission: "FPSC",
      section: "Everyday Science",
      question: "Which layer of the atmosphere contains the protective Ozone Layer?",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
      correctAnswer: 1,
      explanation:
        "The ozone layer is located in the lower region of the Stratosphere, approximately 15 to 35 kilometers above Earth's surface, absorbing most of the harmful ultraviolet (UV) radiation from the Sun.",
      difficulty: "Easy",
    },
    {
      id: "fpsc-4",
      commission: "FPSC",
      section: "English Grammar",
      question: "Choose the correct preposition: 'He is proficient _____ five different languages.'",
      options: ["with", "at", "in", "on"],
      correctAnswer: 2,
      explanation:
        "The adjective 'proficient' is correctly followed by the preposition 'in' when referring to skills, subjects, or languages.",
      difficulty: "Easy",
    },
    {
      id: "fpsc-5",
      commission: "FPSC",
      section: "Math & Logic",
      question: "If a car travels at a constant speed of 90 km/h, how many meters does it travel in 1 second?",
      options: ["15 meters", "20 meters", "25 meters", "30 meters"],
      correctAnswer: 2,
      explanation:
        "To convert km/h to m/s, multiply by 5/18. Distance per sec = 90 × (5/18) = 5 × 5 = 25 meters/second.",
      difficulty: "Medium",
    },
    {
      id: "fpsc-6",
      commission: "FPSC",
      section: "General Knowledge",
      question: "Where is the seat of the International Court of Justice (ICJ) located?",
      options: ["Geneva, Switzerland", "The Hague, Netherlands", "New York, USA", "Vienna, Austria"],
      correctAnswer: 1,
      explanation:
        "The International Court of Justice (ICJ) is headquartered at the Peace Palace in The Hague, Netherlands.",
      difficulty: "Medium",
    },
    {
      id: "fpsc-7",
      commission: "FPSC",
      section: "Pakistan Affairs",
      question: "On which date was the 1973 Constitution of Pakistan formally promulgated?",
      options: ["March 23, 1973", "April 10, 1973", "August 14, 1973", "December 25, 1973"],
      correctAnswer: 2,
      explanation:
        "The Constitution of 1973 was passed by the National Assembly on April 10, 1973, and came into force on Independence Day, August 14, 1973.",
      difficulty: "Medium",
    },
  ],
  css_pms: [
    {
      id: "cp1",
      commission: "CSS / PMS",
      section: "General Knowledge",
      question: "Which narrow maritime strait connects the Persian Gulf with the Gulf of Oman?",
      options: ["Strait of Malacca", "Strait of Hormuz", "Bab-el-Mandeb", "Bosporus Strait"],
      correctAnswer: 1,
      explanation:
        "The Strait of Hormuz connects the Persian Gulf with the Gulf of Oman and Arabian Sea, carrying over 20% of the world's petroleum supply.",
      difficulty: "Medium",
    },
    {
      id: "cp2",
      commission: "CSS / PMS",
      section: "Pakistan Affairs",
      question: "When was the Objective Resolution adopted by the Constituent Assembly of Pakistan?",
      options: ["March 12, 1949", "August 14, 1947", "March 23, 1940", "August 11, 1948"],
      correctAnswer: 0,
      explanation:
        "The Objective Resolution was introduced by Prime Minister Liaquat Ali Khan and passed on March 12, 1949, setting out the foundational Islamic democratic framework.",
      difficulty: "Easy",
    },
    {
      id: "cp3",
      commission: "CSS / PMS",
      section: "Everyday Science",
      question: "Which chemical compound is commonly known as 'Laughing Gas'?",
      options: ["Nitrogen Dioxide (NO₂)", "Nitrous Oxide (N₂O)", "Carbon Monoxide (CO)", "Sulfur Dioxide (SO₂)"],
      correctAnswer: 1,
      explanation:
        "Nitrous Oxide (N₂O) is a colorless gas used in surgery and dentistry for its anesthetic and analgesic effects.",
      difficulty: "Easy",
    },
    {
      id: "cp4",
      commission: "CSS / PMS",
      section: "English Precis",
      question: "Choose the exact antonym of the word 'EPHEMERAL':",
      options: ["Transient", "Permanent", "Fleeting", "Short-lived"],
      correctAnswer: 1,
      explanation:
        "'Ephemeral' means lasting a very short time; its antonym is 'Permanent' or 'Enduring'.",
      difficulty: "Hard",
    },
    {
      id: "cp5",
      commission: "CSS / PMS",
      section: "General Knowledge",
      question: "What is the capital city of Kazakhstan?",
      options: ["Almaty", "Astana", "Tashkent", "Bishkek"],
      correctAnswer: 1,
      explanation:
        "Astana (renamed Nur-Sultan from 2019-2022 and reverted back to Astana in 2022) is the capital of Kazakhstan.",
      difficulty: "Medium",
    },
  ],
  nts_gat: [
    {
      id: "nt1",
      commission: "NTS / GAT",
      section: "Verbal Reasoning",
      question: "Complete the analogy: LIGHT : BLIND :: SOUND : ____?",
      options: ["Deaf", "Silence", "Voice", "Audible"],
      correctAnswer: 0,
      explanation:
        "A person lacking vision cannot sense light (blind); a person lacking hearing cannot sense sound (deaf).",
      difficulty: "Easy",
    },
    {
      id: "nt2",
      commission: "NTS / GAT",
      section: "Analytical Ability",
      question: "If CAT is coded as 3120, how is DOG coded in the same numeric cipher?",
      options: ["4157", "41515", "4157", "41514"],
      correctAnswer: 0,
      explanation:
        "Letter positions: C=3, A=1, T=20 -> 3120. D=4, O=15, G=7 -> 4157.",
      difficulty: "Medium",
    },
  ],
  banking: [
    {
      id: "bk1",
      commission: "Banking",
      section: "Commercial Banking",
      question: "What does 'CRR' stand for in monetary policy?",
      options: ["Capital Reserve Rate", "Cash Reserve Ratio", "Credit Rating Ratio", "Currency Restructuring Return"],
      correctAnswer: 1,
      explanation:
        "Cash Reserve Ratio (CRR) is the specified minimum percentage of total customer deposits that commercial banks must hold as reserves with the Central Bank.",
      difficulty: "Medium",
    },
    {
      id: "bk2",
      commission: "Banking",
      section: "Accounting Concepts",
      question: "The fundamental accounting equation is:",
      options: [
        "Assets = Liabilities + Owner's Equity",
        "Assets = Liabilities - Owner's Equity",
        "Equity = Assets + Liabilities",
        "Revenue = Expenses + Net Income",
      ],
      correctAnswer: 0,
      explanation:
        "Assets = Liabilities + Equity is the foundational balance sheet equation.",
      difficulty: "Easy",
    },
  ],
  it_officer: [
    {
      id: "it1",
      commission: "IT Officer",
      section: "Networking",
      question: "Which TCP port is used by default for secure HTTPS communication?",
      options: ["80", "21", "443", "8080"],
      correctAnswer: 2,
      explanation:
        "Port 443 is the standard port for encrypted HTTPS traffic, whereas unencrypted HTTP uses port 80.",
      difficulty: "Easy",
    },
    {
      id: "it2",
      commission: "IT Officer",
      section: "DBMS",
      question: "Which SQL command permanently removes a database table along with its schema and constraints?",
      options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"],
      correctAnswer: 2,
      explanation:
        "The DROP TABLE command completely destroys the table structure, data, and constraints.",
      difficulty: "Medium",
    },
  ],
};

export default function MockTestPortalPage() {
  // --- REGISTRATION FORM STATE ---
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Form Fields
  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Peshawar",
    province: "Khyber Pakhtunkhwa",
    targetCommission: "ETEA KP - Testing & Evaluation Agency",
    qualification: "BS / Bachelor's Degree",
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Initial Zeroed Student Profile for New Students
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    rollNumber: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    targetCommission: "",
    qualification: "",
    streakDays: 0,
    totalTestsTaken: 0,
    avgScore: 0,
    globalPercentile: "0%",
    totalPoints: 0,
  });

  // Test Config State
  const [selectedExamCategory, setSelectedExamCategory] = useState(EXAM_CATEGORIES[0]);
  const [examMode, setExamMode] = useState("full_mock");
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(true);

  // Active Exam Session State
  const [examActive, setExamActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState({});
  const [inSkippedReviewPhase, setInSkippedReviewPhase] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Test History & Bookmarks starting EMPTY for real calculations
  const [savedQuestionIds, setSavedQuestionIds] = useState([]);
  const [testHistory, setTestHistory] = useState([]);

  // Practice Filter
  const [practiceSearch, setPracticeSearch] = useState("");
  const [practiceCommissionFilter, setPracticeCommissionFilter] = useState("All");

  // Certificate printing ref
  const certRef = useRef(null);

  // Load registration & candidate info from LocalStorage on mount
  useEffect(() => {
    try {
      const savedReg = localStorage.getItem("hmt_mock_registered_candidate");
      const savedHist = localStorage.getItem("hmt_mock_test_history");
      const savedVault = localStorage.getItem("hmt_saved_question_ids");

      let loadedHistory = [];
      if (savedHist) {
        loadedHistory = JSON.parse(savedHist);
        setTestHistory(loadedHistory);
      }

      if (savedVault) {
        setSavedQuestionIds(JSON.parse(savedVault));
      }

      if (savedReg) {
        const parsed = JSON.parse(savedReg);

        // Recalculate stats dynamically from actual test history
        const totalTests = loadedHistory.length;
        const avgScore =
          totalTests > 0
            ? Math.round(loadedHistory.reduce((acc, item) => acc + (item.percentage || 0), 0) / totalTests)
            : 0;
        const totalPoints = loadedHistory.reduce((acc, item) => acc + (item.finalScore * 10 || 0), 0);
        const globalPercentile = totalTests > 0 ? `${Math.min(99, Math.round(avgScore * 1.05))}%` : "0%";

        const updatedProfile = {
          ...parsed,
          totalTestsTaken: totalTests,
          avgScore: avgScore,
          totalPoints: totalPoints,
          globalPercentile: globalPercentile,
          streakDays: totalTests > 0 ? 1 : 0,
        };

        setStudentProfile(updatedProfile);
        setCandidateForm(parsed);
        setIsRegistered(true);
      } else {
        setShowRegistrationModal(true);
      }
    } catch (err) {
      console.warn("Storage check failed", err);
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    let timer = null;
    if (examActive && !testSubmitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examActive, testSubmitted, timeRemaining]);

  // Handle Form Submission (Data Collection)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!candidateForm.fullName || !candidateForm.phone || !candidateForm.city) {
      alert("Please fill in your Name, Phone Number, and City.");
      return;
    }

    setIsSubmittingForm(true);

    const rollNo = `HMT-${candidateForm.city.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const candidateData = {
      ...candidateForm,
      name: candidateForm.fullName,
      rollNumber: rollNo,
      registeredAt: new Date().toISOString(),
      streakDays: testHistory.length > 0 ? 1 : 0,
      totalTestsTaken: testHistory.length,
      avgScore:
        testHistory.length > 0
          ? Math.round(testHistory.reduce((acc, item) => acc + (item.percentage || 0), 0) / testHistory.length)
          : 0,
      globalPercentile: testHistory.length > 0 ? "90.0%" : "0%",
      totalPoints: testHistory.reduce((acc, item) => acc + (item.finalScore * 10 || 0), 0),
    };

    setStudentProfile(candidateData);
    setIsRegistered(true);
    setShowRegistrationModal(false);

    // Save to LocalStorage
    try {
      localStorage.setItem("hmt_mock_registered_candidate", JSON.stringify(candidateData));
    } catch (err) {
      console.warn("Failed to write to localStorage", err);
    }

    // Save to Firebase Firestore database
    try {
      await addDoc(collection(db, "mock_test_students"), {
        fullName: candidateForm.fullName,
        email: candidateForm.email || "N/A",
        phone: candidateForm.phone,
        city: candidateForm.city,
        province: candidateForm.province,
        targetCommission: candidateForm.targetCommission,
        qualification: candidateForm.qualification,
        rollNumber: rollNo,
        createdAt: serverTimestamp(),
      });
      console.log("Candidate registered successfully in Firestore!");
    } catch (error) {
      console.warn("Firestore candidate save note:", error);
    }

    setIsSubmittingForm(false);
    alert(`Welcome ${candidateForm.fullName}! You are now registered for ${candidateForm.targetCommission}.`);
  };

  // Start Exam Session
  const handleStartExam = (cat = selectedExamCategory, mode = examMode) => {
    if (!isRegistered) {
      setShowRegistrationModal(true);
      return;
    }

    setSelectedExamCategory(cat);
    setExamMode(mode);

    let rawQs = QUESTION_BANK[cat.id] || QUESTION_BANK.etea;
    if (mode === "speed_blitz") {
      rawQs = rawQs.slice(0, 5);
    }

    setQuestions(rawQs);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setSkippedQuestions({});
    setInSkippedReviewPhase(false);
    setTestSubmitted(false);

    let durationSeconds = cat.timeMinutes * 60;
    if (mode === "speed_blitz") durationSeconds = 5 * 60;
    if (mode === "practice") durationSeconds = 99999;

    setTimeRemaining(durationSeconds);
    setExamActive(true);
    setActiveTab("exam_room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Option selection
  const handleSelectOption = (qId, optionIndex) => {
    if (testSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));

    // If candidate answers a previously skipped question, remove it from skipped list
    if (skippedQuestions[qId]) {
      setSkippedQuestions((prev) => {
        const copy = { ...prev };
        delete copy[qId];
        return copy;
      });
    }
  };

  // Skip Question action (ETEA & all exam suites)
  const handleSkipQuestion = (qId) => {
    if (testSubmitted || inSkippedReviewPhase) return;

    setSkippedQuestions((prev) => ({
      ...prev,
      [qId]: true,
    }));

    // Find next unanswered question
    let nextIdx = -1;
    for (let i = currentQIndex + 1; i < questions.length; i++) {
      const q = questions[i];
      if (userAnswers[q.id] === undefined && !skippedQuestions[q.id]) {
        nextIdx = i;
        break;
      }
    }

    if (nextIdx !== -1) {
      setCurrentQIndex(nextIdx);
    } else {
      // Loop from beginning for unanswered questions
      for (let i = 0; i < currentQIndex; i++) {
        const q = questions[i];
        if (userAnswers[q.id] === undefined && !skippedQuestions[q.id]) {
          nextIdx = i;
          break;
        }
      }

      if (nextIdx !== -1) {
        setCurrentQIndex(nextIdx);
      } else {
        // Reached end of regular pass: Auto start skipped review phase if skipped questions exist
        triggerAutoSkippedReview();
      }
    }
  };

  const triggerAutoSkippedReview = () => {
    const firstSkippedIdx = questions.findIndex(
      (q) => (skippedQuestions[q.id] || true) && userAnswers[q.id] === undefined
    );

    if (firstSkippedIdx !== -1) {
      setInSkippedReviewPhase(true);
      setCurrentQIndex(firstSkippedIdx);
    }
  };

  const handleNextNavigation = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Reached the last question
      const hasSkippedUnanswered = questions.some(
        (q) => skippedQuestions[q.id] && userAnswers[q.id] === undefined
      );

      if (hasSkippedUnanswered && !inSkippedReviewPhase) {
        triggerAutoSkippedReview();
      }
    }
  };

  const handleToggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleToggleBookmark = (qId) => {
    setSavedQuestionIds((prev) => {
      let updated = [];
      if (prev.includes(qId)) {
        updated = prev.filter((id) => id !== qId);
      } else {
        updated = [...prev, qId];
      }
      try {
        localStorage.setItem("hmt_saved_question_ids", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Auto-submit
  const handleAutoSubmit = () => {
    calculateAndFinishTest(true);
  };

  // Manual submit
  const handleSubmitTest = () => {
    if (window.confirm("Are you sure you want to finish and submit your test?")) {
      calculateAndFinishTest(false);
    }
  };

  const calculateAndFinishTest = (isAuto = false) => {
    setExamActive(false);
    setTestSubmitted(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined || selected === null) {
        skippedCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const negativePenaltyPerWrong = enableNegativeMarking ? 0.25 : 0;
    const totalNegativeDeduction = incorrectCount * negativePenaltyPerWrong;
    const finalScore = Math.max(0, correctCount - totalNegativeDeduction);
    const percentage = Math.round((finalScore / questions.length) * 100);

    const accuracyRate =
      correctCount + incorrectCount > 0
        ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
        : 0;

    let grade = "F";
    let badgeText = "Needs Improvement";
    if (percentage >= 85) {
      grade = "A+";
      badgeText = "Excellence (Gold)";
    } else if (percentage >= 70) {
      grade = "A";
      badgeText = "Pass (Silver)";
    } else if (percentage >= 55) {
      grade = "B";
      badgeText = "Pass (Bronze)";
    }

    const resultObj = {
      examName: selectedExamCategory.name,
      commission: selectedExamCategory.badge,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      skippedCount,
      negativeDeduction: totalNegativeDeduction,
      finalScore,
      percentage,
      accuracyRate,
      grade,
      badgeText,
      autoSubmitted: isAuto,
      date: new Date().toLocaleDateString(),
    };

    setTestResult(resultObj);

    // Append to actual test history
    const newHistoryEntry = {
      id: "hist-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      commission: selectedExamCategory.badge,
      examName: selectedExamCategory.name,
      score: `${finalScore}/${questions.length}`,
      percentage,
      finalScore,
      negativeDeduction: totalNegativeDeduction,
      accuracy: `${accuracyRate}%`,
      timeSpent: formatTimeSpent(selectedExamCategory.timeMinutes * 60 - timeRemaining),
      badge: badgeText,
    };

    const updatedHistory = [newHistoryEntry, ...testHistory];
    setTestHistory(updatedHistory);

    try {
      localStorage.setItem("hmt_mock_test_history", JSON.stringify(updatedHistory));
    } catch (e) {}

    // Recalculate Profile Stats Dynamically
    const totalTests = updatedHistory.length;
    const newAvgScore = Math.round(updatedHistory.reduce((acc, item) => acc + item.percentage, 0) / totalTests);
    const newTotalPoints = updatedHistory.reduce((acc, item) => acc + Math.round(item.finalScore * 10), 0);
    const newPercentile = `${Math.min(99, Math.round(newAvgScore * 1.05))}%`;

    setStudentProfile((prev) => {
      const updated = {
        ...prev,
        totalTestsTaken: totalTests,
        avgScore: newAvgScore,
        totalPoints: newTotalPoints,
        globalPercentile: newPercentile,
        streakDays: 1,
      };
      try {
        localStorage.setItem("hmt_mock_registered_candidate", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const formatTimeRemaining = (secs) => {
    if (secs >= 99000) return "Untimed Practice";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTimeSpent = (secs) => {
    if (secs < 0 || secs > 9000) return "N/A";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Practice Library Filter
  const allQuestionsFlat = Object.values(QUESTION_BANK).flat();
  const filteredPracticeQs = allQuestionsFlat.filter((q) => {
    const matchesCommission =
      practiceCommissionFilter === "All" || q.commission === practiceCommissionFilter;
    const matchesSearch =
      q.question.toLowerCase().includes(practiceSearch.toLowerCase()) ||
      q.section.toLowerCase().includes(practiceSearch.toLowerCase());
    return matchesCommission && matchesSearch;
  });

  const uniqueCommissions = ["All", "ETEA KP", "KPPSC", "PPSC", "FPSC", "CSS / PMS", "NTS / GAT", "Banking", "IT Officer"];

  // Print Certificate Action
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* =========================================================
          STUDENT ENTRY & DATA COLLECTION REGISTRATION MODAL
      ========================================================= */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-blue-600/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 my-8">
            <div className="text-center space-y-3 border-b border-slate-800 pb-5">
              <div className="flex justify-center">
                <img src="/hmt-logo-new.png" alt="HMT Success Academy Logo" className="h-20 w-auto object-contain drop-shadow-xl" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                HMT Success Academy - Candidate Entry
              </h2>
              <p className="text-xs text-blue-200/90 leading-relaxed">
                Please register your candidate details to enter the portal, calculate your real test progress, and receive official scorecards.
              </p>

              {/* SOCIAL MEDIA QUICK CONNECT */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <a
                  href="https://youtube.com/@hmtsuccessacademy"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] flex items-center gap-1.5 shadow"
                >
                  ▶ Subscribe YouTube
                </a>
                <a
                  href="https://www.facebook.com/HMTSuccessAcademy"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] flex items-center gap-1.5 shadow"
                >
                  📘 Follow Facebook
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1.5 shadow"
                >
                  💬 Join WhatsApp
                </a>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Student Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Ali Raza"
                    value={candidateForm.fullName}
                    onChange={(e) => setCandidateForm({ ...candidateForm, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Mobile / WhatsApp No <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0300-1234567"
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    City / District <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peshawar, Lahore, Swat, Mardan"
                    value={candidateForm.city}
                    onChange={(e) => setCandidateForm({ ...candidateForm, city: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Province / Region</label>
                  <select
                    value={candidateForm.province}
                    onChange={(e) => setCandidateForm({ ...candidateForm, province: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Federal / Islamabad">Federal / Islamabad</option>
                    <option value="Azad Jammu & Kashmir">Azad Jammu & Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Qualification</label>
                  <select
                    value={candidateForm.qualification}
                    onChange={(e) => setCandidateForm({ ...candidateForm, qualification: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="BS / Bachelor's Degree">BS / Bachelor's Degree</option>
                    <option value="Master's / M.Sc">Master's / M.Sc</option>
                    <option value="F.Sc / Intermediate">F.Sc / Intermediate</option>
                    <option value="Matriculation">Matriculation</option>
                    <option value="MBBS / B.E. Engineering">MBBS / B.E. Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Target Exam / Testing Agency <span className="text-rose-400">*</span>
                </label>
                <select
                  value={candidateForm.targetCommission}
                  onChange={(e) => setCandidateForm({ ...candidateForm, targetCommission: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-blue-500/60 text-emerald-300 font-bold focus:outline-none"
                >
                  {EXAM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {isRegistered && (
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Close
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl transition"
                >
                  {isSubmittingForm ? "Registering Candidate..." : "🚀 Enter Mock Test Portal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TOP BRANDING BANNER WITH LOGO --- */}
      <div className="bg-gradient-to-r from-[#031735] via-[#0b2c5f] to-[#124285] border-b border-blue-900/60 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/" className="shrink-0" title="Go to HMT Home">
                  <img
                    src="/hmt-logo-new.png"
                    alt="HMT Success Academy Logo"
                    className="h-12 sm:h-14 w-auto object-contain shrink-0 drop-shadow-lg hover:opacity-90 transition"
                  />
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                    HMT Success Academy
                    <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                      ETEA • KPPSC • PPSC • FPSC
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-200/90 mt-0.5">
                    Competitive Examination Practice & Real Student Progress System
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <a
                      href="https://youtube.com/@hmtsuccessacademy"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-bold text-[10px] flex items-center gap-1 transition"
                    >
                      ▶ YouTube Channel
                    </a>
                    <a
                      href="https://www.facebook.com/HMTSuccessAcademy"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 transition"
                    >
                      📘 Facebook Page
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 transition"
                    >
                      💬 WhatsApp Channel
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Header Stats - Calculated Dynamically */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur border border-blue-800/40 rounded-2xl p-2.5 sm:px-4 shadow-lg">
              {isRegistered ? (
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="flex items-center gap-2.5 border-r border-slate-800 pr-3 hover:opacity-80 transition text-left"
                  title="Click to edit candidate information"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow">
                    {studentProfile.name ? studentProfile.name.charAt(0) : "S"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 truncate max-w-[130px]">
                      {studentProfile.name || "New Candidate"}
                    </p>
                    <p className="text-[10px] text-blue-400 font-mono">
                      {studentProfile.city || "KP"}, {studentProfile.province ? studentProfile.province.slice(0, 2) : "PK"} • ✏️ Edit
                    </p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow animate-pulse"
                >
                  📝 Register Candidate Info
                </button>
              )}

              <div className="text-center px-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Tests</p>
                <p className="text-xs font-black text-emerald-400">{studentProfile.totalTestsTaken || 0}</p>
              </div>

              <div className="text-center px-2 border-l border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Score</p>
                <p className="text-xs font-black text-cyan-400">{studentProfile.avgScore || 0}%</p>
              </div>

              <div className="text-center px-2 border-l border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Streak</p>
                <p className="text-xs font-black text-amber-400">🔥 {studentProfile.streakDays || 0} Days</p>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION BAR */}
          <nav aria-label="Portal Navigation" className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
            {[
              { id: "dashboard", label: "🏛️ Exam Suites", desc: "Select Commission" },
              { id: "exam_room", label: "⏱️ Mock Exam Room", desc: "Active Test Engine" },
              { id: "practice_library", label: "📚 Subject Practice", desc: "Question Bank" },
              { id: "analytics", label: "📊 Performance Analytics", desc: "Score Breakdown" },
              { id: "saved_questions", label: `🔖 Saved Vault (${savedQuestionIds.length})`, desc: "Bookmarked MCQs" },
              { id: "certificate", label: "📜 Verified Scorecard", desc: "Print Result" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 flex flex-col items-start ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 ring-1 ring-blue-400"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* --- MAIN PORTAL BODY --- */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* =========================================
            TAB 1: DASHBOARD & COMMISSION SUITES
        ========================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* HERO BANNER WITH LOGO */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 p-6 sm:p-8 border border-blue-800/50 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative z-10 max-w-3xl">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
                  🎯 Authentic Commission Screening Pattern (ETEA • KPPSC • PPSC • FPSC)
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Master ETEA, KPPSC, PPSC & FPSC Competitive Examinations
                </h2>
                <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                  Prepare with real exam patterns, negative marking calculations (-0.25), real-time countdown timers, subject-wise analytics, and verified solution keys.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleStartExam(EXAM_CATEGORIES[0], "full_mock")}
                    className="px-5 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-sm shadow-lg shadow-purple-950/30 transition transform hover:-translate-y-0.5"
                  >
                    📝 Start ETEA KP Mock Exam
                  </button>

                  <button
                    onClick={() => handleStartExam(EXAM_CATEGORIES[1], "full_mock")}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/30 transition transform hover:-translate-y-0.5"
                  >
                    🏔️ Start KPPSC Mock Exam
                  </button>

                  <button
                    onClick={() => handleStartExam(EXAM_CATEGORIES[2], "full_mock")}
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/30 transition transform hover:-translate-y-0.5"
                  >
                    📜 Start PPSC Punjab Mock
                  </button>

                  <button
                    onClick={() => handleStartExam(EXAM_CATEGORIES[3], "full_mock")}
                    className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-sm shadow-lg shadow-blue-950/30 transition transform hover:-translate-y-0.5"
                  >
                    🏛️ Start FPSC Federal Mock
                  </button>
                </div>
              </div>

              <div className="shrink-0 hidden md:block">
                <img
                  src="/hmt-logo-new.png"
                  alt="HMT Success Academy Logo"
                  className="w-44 h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* COMMISSION SUITES GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    🎯 Available Commission & Testing Agency Suites
                  </h3>
                  <p className="text-xs text-slate-400">Select your target commission or testing agency suite</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
                  <span className="text-slate-400">Negative Marking:</span>
                  <button
                    onClick={() => setEnableNegativeMarking(!enableNegativeMarking)}
                    className={`px-2 py-0.5 rounded ${
                      enableNegativeMarking ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {enableNegativeMarking ? "ON (-0.25)" : "OFF (0)"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {EXAM_CATEGORIES.map((cat) => {
                  const isSelected = selectedExamCategory.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`relative rounded-2xl bg-slate-900 border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-xl ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-500/40 shadow-blue-900/20"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{cat.icon}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.lightBg}`}>
                            {cat.badge}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white leading-snug">{cat.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.subtitle}</p>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Questions:</span>
                            <span className="font-bold">{cat.totalQuestions} MCQs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Time Limit:</span>
                            <span className="font-bold text-amber-400">{cat.timeMinutes} Mins</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Passing:</span>
                            <span className="font-bold text-emerald-400">{cat.passingPercent}%</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {cat.subjects.slice(0, 3).map((sub, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-medium bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60"
                            >
                              {sub}
                            </span>
                          ))}
                          {cat.subjects.length > 3 && (
                            <span className="text-[9px] font-medium text-slate-400">+{cat.subjects.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleStartExam(cat, "full_mock")}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition text-center"
                        >
                          Start Test
                        </button>
                        <button
                          onClick={() => handleStartExam(cat, "practice")}
                          className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
                          title="Untimed Practice Mode"
                        >
                          Practice
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PREVIOUS ATTEMPTS HISTORY TABLE - REAL DYNAMIC DATA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                📜 Candidate Exam Attempts Log
              </h3>
              <p className="text-xs text-slate-400 mb-4">Historical record of completed mock test attempts</p>

              {testHistory.length === 0 ? (
                <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-3xl block mb-2">📊</span>
                  <p className="text-sm text-slate-300 font-bold">No Mock Test Attempts Recorded Yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select an ETEA, KPPSC, PPSC, or FPSC test suite above to take your first test. Your scores and progress will be calculated here!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Agency</th>
                        <th className="py-3 px-4">Exam Suite</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Penalty</th>
                        <th className="py-3 px-4">Accuracy</th>
                        <th className="py-3 px-4">Time Spent</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {testHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-mono text-slate-400">{item.date}</td>
                          <td className="py-3 px-4 font-bold text-amber-400">{item.commission}</td>
                          <td className="py-3 px-4 font-semibold text-white">{item.examName}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">{item.score}</td>
                          <td className="py-3 px-4 font-bold text-cyan-400">{item.percentage}%</td>
                          <td className="py-3 px-4 text-rose-400 font-mono">-{item.negativeDeduction} pts</td>
                          <td className="py-3 px-4 text-blue-300 font-bold">{item.accuracy}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono">{item.timeSpent}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {item.badge}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: MOCK EXAM ROOM / ENGINE
        ========================================= */}
        {activeTab === "exam_room" && (
          <div>
            {!examActive && !testSubmitted && (
              <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
                <span className="text-5xl block mb-4">🎯</span>
                <h3 className="text-2xl font-bold text-white">No Active Exam Session</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Select ETEA, KPPSC, PPSC, or FPSC exam suite from the dashboard to launch your test.
                </p>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="mt-6 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition"
                >
                  Go to Exam Dashboard
                </button>
              </div>
            )}

            {/* LIVE TEST INTERFACE */}
            {examActive && !testSubmitted && questions.length > 0 && (() => {
              const answeredCount = Object.keys(userAnswers).length;
              const skippedCount = Object.keys(skippedQuestions).filter(
                (k) => skippedQuestions[k] && userAnswers[k] === undefined
              ).length;
              const totalQs = questions.length;
              const progressPercent = totalQs > 0 ? Math.min(100, Math.round(((answeredCount + skippedCount) / totalQs) * 100)) : 0;

              return (
                <div className="space-y-5">
                  {/* TEST HEADER WITH TIMER */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        {selectedExamCategory.name} • {examMode === "full_mock" ? "Full Timed Mock" : "Practice Mode"}
                      </span>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Question {currentQIndex + 1} of {questions.length}</span>
                        {skippedQuestions[questions[currentQIndex]?.id] && userAnswers[questions[currentQIndex]?.id] === undefined && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ⏩ Previously Skipped
                          </span>
                        )}
                      </h2>
                    </div>

                    {/* Real-time Timer Box */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-black border shadow-inner ${
                          timeRemaining < 120
                            ? "bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse"
                            : "bg-slate-950 text-emerald-400 border-emerald-600/50"
                        }`}
                      >
                        <span>⏱️</span>
                        <span>{formatTimeRemaining(timeRemaining)}</span>
                      </div>

                      <button
                        onClick={handleSubmitTest}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow transition"
                      >
                        Finish Test
                      </button>
                    </div>
                  </div>

                  {/* LIVE PROGRESS LINE (UPDATES AFTER EACH MCQ SAVED / SKIPPED) */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-2">
                    <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">📈 Exam Saved Progress:</span>
                        <span className="text-emerald-400 font-mono">{progressPercent}% Completed</span>
                        {inSkippedReviewPhase && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            ⚡ Skipped MCQs Review Phase (Skip Frozen)
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        Saved: <span className="text-emerald-400 font-bold">{answeredCount}</span>/{totalQs} • Skipped: <span className="text-amber-400 font-bold">{skippedCount}</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          inSkippedReviewPhase
                            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400"
                            : "bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {inSkippedReviewPhase && (
                    <div className="bg-amber-950/60 border border-amber-500/50 rounded-2xl p-3.5 text-xs text-amber-200 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏩</span>
                        <div>
                          <p className="font-black text-amber-300">Skipped MCQs Review Phase Active</p>
                          <p className="text-[11px] opacity-90">Reviewing your skipped questions. The 'Skip' option is frozen so you can select your answers before submitting.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* MAIN QUESTION DISPLAY AREA */}
                    <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                      {/* Section Badge */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-900/60 text-blue-300 border border-blue-700/60">
                          Commission: {questions[currentQIndex]?.commission} • Section: {questions[currentQIndex]?.section}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFlag(questions[currentQIndex]?.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                              flaggedQuestions[questions[currentQIndex]?.id]
                                ? "bg-purple-900/60 text-purple-300 border-purple-500"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                          >
                            {flaggedQuestions[questions[currentQIndex]?.id] ? "🚩 Flagged" : "居 Flag"}
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(questions[currentQIndex]?.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                              savedQuestionIds.includes(questions[currentQIndex]?.id)
                                ? "bg-amber-900/60 text-amber-300 border-amber-500"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                          >
                            {savedQuestionIds.includes(questions[currentQIndex]?.id) ? "🔖 Saved" : "🔖 Save"}
                          </button>
                        </div>
                      </div>

                      {/* Question Statement */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                          Q{currentQIndex + 1}. {questions[currentQIndex]?.question}
                        </h3>
                      </div>

                      {/* Options List */}
                      <div className="space-y-3 pt-2">
                        {questions[currentQIndex]?.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[questions[currentQIndex]?.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(questions[currentQIndex]?.id, optIdx)}
                              className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all duration-200 flex items-center justify-between ${
                                isSelected
                                  ? "bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40"
                                  : "bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                                    isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isSelected && <span className="text-blue-400 font-bold">✓ Selected</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Clear selection */}
                      {userAnswers[questions[currentQIndex]?.id] !== undefined && (
                        <button
                          onClick={() =>
                            setUserAnswers((prev) => {
                              const copy = { ...prev };
                              delete copy[questions[currentQIndex]?.id];
                              return copy;
                            })
                          }
                          className="text-xs text-rose-400 hover:underline font-semibold"
                        >
                          Clear Selection
                        </button>
                      )}

                      {/* Next / Skip / Previous Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
                        <button
                          onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                          disabled={currentQIndex === 0}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs disabled:opacity-40 transition"
                        >
                          ← Previous
                        </button>

                        {/* SKIP QUESTION BUTTON (ETEA & ALL SUITES) */}
                        <button
                          onClick={() => handleSkipQuestion(questions[currentQIndex]?.id)}
                          disabled={inSkippedReviewPhase || userAnswers[questions[currentQIndex]?.id] !== undefined}
                          title={
                            inSkippedReviewPhase
                              ? "Skip option is frozen during Skipped MCQs review phase"
                              : "Skip this question and review later"
                          }
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                            inSkippedReviewPhase || userAnswers[questions[currentQIndex]?.id] !== undefined
                              ? "bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed opacity-50"
                              : "bg-amber-600/30 text-amber-300 border-amber-500 hover:bg-amber-600/50 shadow"
                          }`}
                        >
                          {inSkippedReviewPhase ? "⏸️ Skip Frozen" : "⏩ Skip Question"}
                        </button>

                        <div className="text-xs font-mono text-slate-400">
                          {currentQIndex + 1} / {questions.length}
                        </div>

                        {currentQIndex < questions.length - 1 ? (
                          <button
                            onClick={handleNextNavigation}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitTest}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                          >
                            Submit Test ✓
                          </button>
                        )}
                      </div>
                    </div>

                    {/* SIDEBAR QUESTION PALETTE WITH SKIPPED HIGHLIGHT */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-sm font-bold text-white">
                          📋 Question Palette
                        </h4>
                        {skippedCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {skippedCount} Skipped
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                          const isAnswered = userAnswers[q.id] !== undefined;
                          const isSkipped = skippedQuestions[q.id] && !isAnswered;
                          const isFlagged = flaggedQuestions[q.id];
                          const isCurrent = currentQIndex === idx;

                          let styleClass = "bg-slate-950 text-slate-400 border-slate-800";
                          if (isSkipped) styleClass = "bg-amber-600/30 text-amber-300 border-amber-500 font-bold";
                          if (isAnswered) styleClass = "bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold";
                          if (isFlagged) styleClass = "bg-purple-600/40 text-purple-300 border-purple-500";
                          if (isCurrent) styleClass = "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400 font-black";

                          return (
                            <button
                              key={q.id}
                              onClick={() => setCurrentQIndex(idx)}
                              className={`h-9 rounded-lg font-mono text-xs border transition relative ${styleClass}`}
                              title={`Q${idx + 1}: ${isSkipped ? "Skipped" : isAnswered ? "Answered" : "Unanswered"}`}
                            >
                              {idx + 1}
                              {isSkipped && <span className="absolute -top-1 -right-1 text-[9px]">⏩</span>}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-emerald-600/50 border border-emerald-500"></span>
                          <span>Answered ({answeredCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-amber-600/50 border border-amber-500"></span>
                          <span>Skipped ({skippedCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-purple-600/50 border border-purple-500"></span>
                          <span>Flagged ({Object.keys(flaggedQuestions).filter((k) => flaggedQuestions[k]).length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800"></span>
                          <span>Unanswered ({totalQs - answeredCount - skippedCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TEST RESULT ANALYSIS VIEW */}
            {testSubmitted && testResult && (
              <div className="space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {testResult.commission} Official Mock Completed
                      </span>
                      <h2 className="text-2xl font-black text-white mt-2">{testResult.examName} Scorecard</h2>
                      <p className="text-xs text-slate-400">Completed on {testResult.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStartExam(selectedExamCategory, examMode)}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                      >
                        🔄 Retake Test
                      </button>
                      <button
                        onClick={() => setActiveTab("certificate")}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                      >
                        📜 View Verified Scorecard
                      </button>
                    </div>
                  </div>

                  {/* SCORE HIGHLIGHT GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Final Score</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">
                        {testResult.finalScore} / {testResult.totalQuestions}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Percentage</p>
                      <p className="text-2xl font-black text-cyan-400 mt-1">{testResult.percentage}%</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Accuracy Rate</p>
                      <p className="text-2xl font-black text-blue-400 mt-1">{testResult.accuracyRate}%</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                      <p className="text-[11px] uppercase font-bold text-slate-400">Negative Deduction</p>
                      <p className="text-2xl font-black text-rose-400 mt-1">-{testResult.negativeDeduction} pts</p>
                    </div>
                  </div>

                  {/* ANSWER KEY & EXPLANATIONS */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4">📖 Solution Key & Step-by-Step Explanations</h3>

                    <div className="space-y-4">
                      {questions.map((q, idx) => {
                        const selected = userAnswers[q.id];
                        const isCorrect = selected === q.correctAnswer;
                        const isSkipped = selected === undefined || selected === null;

                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-2xl border ${
                              isCorrect
                                ? "bg-emerald-950/20 border-emerald-800/50"
                                : isSkipped
                                ? "bg-slate-950 border-slate-800"
                                : "bg-rose-950/20 border-rose-800/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400">
                                Question {idx + 1} • {q.commission} ({q.section})
                              </span>
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  isCorrect
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : isSkipped
                                    ? "bg-slate-800 text-slate-400"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {isCorrect ? "Correct (+1.0)" : isSkipped ? "Skipped (0)" : "Wrong (-0.25)"}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-white mt-2">{q.question}</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                              {q.options.map((opt, optI) => {
                                const isThisCorrect = optI === q.correctAnswer;
                                const isThisSelected = optI === selected;

                                let optBg = "bg-slate-900 border-slate-800 text-slate-300";
                                if (isThisCorrect) optBg = "bg-emerald-900/50 border-emerald-500 text-emerald-200 font-bold";
                                if (isThisSelected && !isThisCorrect) optBg = "bg-rose-900/50 border-rose-500 text-rose-200 font-bold";

                                return (
                                  <div key={optI} className={`p-2.5 rounded-xl border ${optBg}`}>
                                    <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optI)}.</span>
                                    {opt}
                                    {isThisCorrect && <span className="ml-2 text-emerald-400">✓ Correct</span>}
                                    {isThisSelected && !isThisCorrect && <span className="ml-2 text-rose-400">Your Choice</span>}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-blue-200/90 leading-relaxed">
                              <span className="font-bold text-blue-400 block mb-1">💡 Detailed Reference Explanation:</span>
                              {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: SUBJECT PRACTICE LIBRARY
        ========================================= */}
        {activeTab === "practice_library" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">📚 ETEA • KPPSC • PPSC • FPSC Question Bank</h2>
                <p className="text-xs text-slate-400">Search and practice authentic past questions by commission agency</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search questions by keyword or topic..."
                  value={practiceSearch}
                  onChange={(e) => setPracticeSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />

                <select
                  value={practiceCommissionFilter}
                  onChange={(e) => setPracticeCommissionFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-bold"
                >
                  {uniqueCommissions.map((comm) => (
                    <option key={comm} value={comm}>
                      Commission: {comm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPracticeQs.map((q) => (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">
                      {q.commission} • {q.section}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                        savedQuestionIds.includes(q.id)
                          ? "bg-amber-900/50 text-amber-300 border-amber-500"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {savedQuestionIds.includes(q.id) ? "🔖 Saved" : "🔖 Save Question"}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white">{q.question}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    {q.options.map((opt, oI) => (
                      <div
                        key={oI}
                        className={`p-2.5 rounded-xl border ${
                          oI === q.correctAnswer
                            ? "bg-emerald-950/40 border-emerald-600 text-emerald-300 font-semibold"
                            : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + oI)}.</span>
                        {opt}
                        {oI === q.correctAnswer && <span className="ml-2 text-emerald-400 font-bold">✓</span>}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-blue-200/80">
                    <span className="font-bold text-blue-400">Solution Note: </span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 4: PERFORMANCE ANALYTICS (REAL CALCULATIONS)
        ========================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white">📊 Dynamic Performance & Score Analytics</h2>
              <p className="text-xs text-slate-400">Real performance statistics computed from your actual test history</p>

              {testHistory.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 my-6">
                  <span className="text-4xl block mb-2">📈</span>
                  <h3 className="text-base font-bold text-white">No Practice History Available Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Your subject mastery radar will be dynamically calculated once you complete your first mock test.
                  </p>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
                  >
                    Start a Test Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Overall Average Accuracy</h3>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${studentProfile.avgScore || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-slate-400">
                      <span>Calculated Avg: {studentProfile.avgScore}%</span>
                      <span className="text-emerald-400 font-bold">
                        {studentProfile.avgScore >= 80 ? "Excellence" : studentProfile.avgScore >= 60 ? "Good" : "Needs Practice"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Completed Test Count</h3>
                    <p className="text-3xl font-black text-blue-400 mt-1">{testHistory.length}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Total tests submitted & graded</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-300 mb-2">Total Points Earned</h3>
                    <p className="text-3xl font-black text-amber-400 mt-1">{studentProfile.totalPoints || 0}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Based on correct MCQ responses</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 5: SAVED REVISION VAULT
        ========================================= */}
        {activeTab === "saved_questions" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white">🔖 Saved Revision Vault</h2>
              <p className="text-xs text-slate-400">
                You have {savedQuestionIds.length} saved questions for rapid revision
              </p>
            </div>

            {savedQuestionIds.length === 0 ? (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
                <span className="text-3xl block mb-2">🔖</span>
                <p className="text-sm text-slate-300 font-bold">No Questions Bookmarked Yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Bookmark / Save" on any question during test practice to save it here for revision.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allQuestionsFlat
                  .filter((q) => savedQuestionIds.includes(q.id))
                  .map((q) => (
                    <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-400">
                          {q.commission} • {q.section}
                        </span>
                        <button
                          onClick={() => handleToggleBookmark(q.id)}
                          className="text-xs font-bold text-rose-400 hover:underline"
                        >
                          Remove from Saved
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white">{q.question}</h3>

                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-blue-200">
                        <span className="font-bold text-emerald-400">Correct Option: </span>
                        {q.options[q.correctAnswer]}
                        <p className="mt-2 text-slate-400">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 6: VERIFIED CERTIFICATE & SCORECARD WITH LOGO
        ========================================= */}
        {activeTab === "certificate" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white">📜 Verified Candidate Scorecard Certificate</h2>
                <p className="text-xs text-slate-400">Official candidate performance verification document</p>
              </div>

              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-2"
              >
                🖨️ Print / Save PDF
              </button>
            </div>

            {/* PRINTABLE CERTIFICATE CARD WITH HMT LOGO */}
            <div
              ref={certRef}
              className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border-8 border-slate-900 shadow-2xl relative overflow-hidden"
            >
              <div className="border-4 border-blue-900 p-6 sm:p-10 rounded-2xl relative">
                {/* Header with HMT Logo */}
                <div className="flex items-center justify-between border-b-2 border-blue-900 pb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/hmt-logo-new.png"
                      alt="HMT Success Academy Logo"
                      className="h-16 w-auto object-contain shrink-0 drop-shadow-md"
                    />
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-[#0b2c5f] uppercase">
                        HMT Success Academy
                      </h2>
                      <p className="text-xs font-semibold text-slate-600">
                        Competitive Exam Assessment Center • ETEA | KPPSC | PPSC | FPSC
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                      OFFICIAL SCORECARD
                    </span>
                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                      Issue Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="my-8 text-center space-y-2">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">This certifies that candidate</p>
                  <h3 className="text-3xl font-black text-slate-900 underline decoration-blue-500 decoration-2">
                    {studentProfile.name || "Candidate Name"}
                  </h3>
                  <p className="text-xs font-mono text-blue-900 font-bold">
                    Roll No: {studentProfile.rollNumber || "HMT-2026-0000"} • Location: {studentProfile.city || "Peshawar"}, {studentProfile.province || "KP"}
                  </p>
                </div>

                {/* Performance Summary */}
                <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-200 my-6">
                  <p className="text-center text-xs text-slate-700 font-medium mb-4">
                    Has appeared in the Competitive Examination Assessment for:
                  </p>
                  <h4 className="text-center text-lg font-bold text-[#0b2c5f] mb-6">
                    {selectedExamCategory.name}
                  </h4>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Calculated Score %</p>
                      <p className="text-xl font-black text-blue-900">{testResult ? testResult.percentage : studentProfile.avgScore || 0}%</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</p>
                      <p className="text-xl font-black text-emerald-700">{testResult ? testResult.accuracyRate : studentProfile.avgScore || 0}%</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-200">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Grade</p>
                      <p className="text-xl font-black text-purple-900">{testResult ? testResult.grade : (studentProfile.avgScore >= 70 ? "A" : "Pending")}</p>
                    </div>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Exam Controller</p>
                    <p className="text-[10px] text-slate-500">HMT Success Academy</p>
                  </div>

                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center font-bold text-[9px] text-blue-900 uppercase text-center p-1">
                    Official Verification Seal
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SOCIAL MEDIA CHANNELS BANNER */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-900/60 rounded-3xl p-6 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/hmt-logo-new.png" alt="HMT Logo" className="h-12 w-auto object-contain shrink-0" />
            <div>
              <h4 className="text-base font-black tracking-tight text-white">
                HMT Success Academy Official Social Channels
              </h4>
              <p className="text-xs text-blue-200/90 mt-0.5">
                Subscribe on YouTube and follow our Facebook page for daily competitive exam lectures, ETEA/KPPSC/PPSC/FPSC notes, and updates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://youtube.com/@hmtsuccessacademy"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>▶ YouTube Channel</span>
            </a>
            <a
              href="https://www.facebook.com/HMTSuccessAcademy"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>📘 Facebook Page</span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>💬 WhatsApp Channel</span>
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          © {new Date().getFullYear()} HMT Success Academy & HMT Financial Services (hmtfinancialservices.com). All rights reserved.
        </p>
      </footer>
    </div>
  );
}
