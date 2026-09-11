"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

const PRESET_TEMPLATES = {
  urdu_app: {
    docTitle: "درخواست برای گرانٹنگ سرٹیفکیٹ",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی / تعلیمی ادارہ",
    authorName: "محمد حمزہ (طالب علم)",
    docDate: "2026-09-11",
    globalFont: "urdu",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "بخدمت جناب پرنسپل صاحب",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "22px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "heading3",
        content: "ایچ ایم ٹی سکسیس اکیڈمی، پشاور کینٹ",
        font: "urdu",
        align: "right",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#475569",
      },
      {
        id: "3",
        type: "heading2",
        content: "عنوان: درخواست برائے اجراء کمپیوٹر کورس سرٹیفکیٹ",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "18px",
        color: "#1e3a8a",
      },
      {
        id: "4",
        type: "paragraph",
        content:
          "مودبانہ گزارش ہے کہ فدوی نے ایچ ایم ٹی سکسیس اکیڈمی کے تحت فری کمپیوٹر کورس بیچ 02 کامیابی کے ساتھ مکمل کر لیا ہے۔ تمام پریکٹیکل اسائنمنٹس اور فائنل موک ٹیسٹ مکمل کر لیے گئے ہیں۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "5",
        type: "paragraph",
        content:
          "لہٰذا التماس ہے کہ فدوی کو کورس مکمل کرنے کا رسمی تصدیق شدہ سرٹیفکیٹ جاری فرمایا جائے تاکہ فدوی آئندہ ملازمت کے لیے درخواست دے سکے۔ آپ کی عین نوازش ہوگی۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "6",
        type: "signature",
        content: "العارض:\nمحمد حمزہ\nرول نمبر: HMT-2026-889\nبیچ: 02 فری کمپیوٹر کورس",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#0f172a",
      },
    ],
  },
  english_letter: {
    docTitle: "OFFICIAL RECOMMENDATION & CERTIFICATE REQUEST",
    docSubtitle: "HMT Financial Services & Success Academy",
    authorName: "Muhammad Hamza",
    docDate: "2026-09-11",
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "To, The Director of Admissions & Examination",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "20px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "heading2",
        content: "Subject: Request for Official Course Completion & Verification Letter",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "16px",
        color: "#1e3a8a",
      },
      {
        id: "3",
        type: "paragraph",
        content:
          "Respected Sir/Madam,\n\nI am writing to formally request the issuance of my official completion certificate for the Free Professional Computer Application Course (Batch 02). I have successfully completed all core operational modules including Microsoft Word formatting, advanced Excel formulas, presentation design, and administrative record management.",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
      {
        id: "4",
        type: "bulletList",
        content:
          "Verified module attendance and assignment submissions\nCleared final evaluation mock examination with high grade\nEligible for academic and professional recruitment verification",
        font: "english",
        align: "left",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "14px",
        color: "#334155",
      },
      {
        id: "5",
        type: "paragraph",
        content:
          "Your prompt assistance in issuing the certificate will allow me to attach it to my job applications. Thank you for your continued mentorship and guidance.",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
      {
        id: "6",
        type: "signature",
        content: "Sincerely,\nMuhammad Hamza\nStudent ID: HMT-2026-889\nContact: +92 300 1234567",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "14px",
        color: "#0f172a",
      },
    ],
  },
  arabic_doc: {
    docTitle: "طلب الحصول على شهادة إتمام الدورة التدريبية",
    docSubtitle: "أكاديمية اتش ام تي للخدمات المالية والتعليمية",
    authorName: "محمد حمزة",
    docDate: "2026-09-11",
    globalFont: "arabic",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "بسم الله الرحمن الرحيم",
        font: "arabic",
        align: "center",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "24px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "heading2",
        content: "إلى المحترم/ مدير الأكاديمية التعليمية",
        font: "arabic",
        align: "right",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "20px",
        color: "#1e3a8a",
      },
      {
        id: "3",
        type: "paragraph",
        content:
          "السلام عليكم ورحمة الله وبركاته،،\n\nأتقدم إليكم بهذا الطلب للحصول على شهادة إتمام دورة تطبيقات الحاسوب والمهارات المكتبية. لقد أتممت بفضل الله كافة الوحدات التعليمية والاختبارات العملية المعتمدة بمركزكم الموقر.",
        font: "arabic",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "17px",
        color: "#1e293b",
      },
      {
        id: "4",
        type: "callout",
        content: "ملاحظة: الشهادة مطلوبة لاستكمال ملف التقديم للوظائف الحكومية والخاصة.",
        font: "arabic",
        align: "right",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#065f46",
      },
      {
        id: "5",
        type: "signature",
        content: "وتفضلوا بقبول فائق الاحترام والتقدير،،\nالمقدم: محمد حمزة\nالرقم الأكاديمي: HMT-2026-889",
        font: "arabic",
        align: "right",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#0f172a",
      },
    ],
  },
};

export default function DocumentEditorPage() {
  const [docMeta, setDocMeta] = useState({
    docTitle: "My Rich Document",
    docSubtitle: "Formatted Document & MS Word Alternative",
    authorName: "Muhammad Tufail",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu", // urdu | english | arabic | sans
    direction: "rtl", // rtl | ltr
    pageSize: "A4", // A4 | Letter
    watermark: "",
    lineHeight: "1.8",
  });

  const [blocks, setBlocks] = useState([
    {
      id: "b1",
      type: "title",
      content: "درخواست برائے ایچ ایم ٹی سرٹیفکیٹ",
      font: "urdu",
      align: "center",
      bold: true,
      italic: false,
      underline: false,
      fontSize: "26px",
      color: "#0f172a",
    },
    {
      id: "b2",
      type: "heading1",
      content: "جناب عالی!",
      font: "urdu",
      align: "right",
      bold: true,
      italic: false,
      underline: false,
      fontSize: "20px",
      color: "#1e3a8a",
    },
    {
      id: "b3",
      type: "paragraph",
      content:
        "گزارش ہے کہ میں نے ایچ ایم ٹی سکسیس اکیڈمی سے فری کمپیوٹر کورس بیچ 02 مکمل کر لیا ہے۔ میں اس موبائل ڈاکومنٹ ایڈیٹر کے ذریعے اپنی درخواست ٹائپ اور فارمیٹ کر رہا ہوں تا کہ پی ڈی ایف فائل حاصل کر سکوں۔",
      font: "urdu",
      align: "justify",
      bold: false,
      italic: false,
      underline: false,
      fontSize: "16px",
      color: "#1e293b",
    },
    {
      id: "b4",
      type: "bulletList",
      content: "ایم ایس ورڈ فارمیٹنگ مکمل\nایم ایس ایکسل فارمولاج مکمل\nپاورپوائنٹ پریزنٹیشن مکمل",
      font: "urdu",
      align: "right",
      bold: false,
      italic: false,
      underline: false,
      fontSize: "15px",
      color: "#334155",
    },
    {
      id: "b5",
      type: "signature",
      content: "نیازمند:\nمحمد حمزہ\nرول نمبر: HMT-9942",
      font: "urdu",
      align: "right",
      bold: true,
      italic: false,
      underline: false,
      fontSize: "15px",
      color: "#0f172a",
    },
  ]);

  const [activeBlockId, setActiveBlockId] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const printRef = useRef(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hmt_doc_editor_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.docMeta && parsed.blocks) {
          setDocMeta(parsed.docMeta);
          setBlocks(parsed.blocks);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage on change
  const saveDraft = () => {
    try {
      localStorage.setItem("hmt_doc_editor_draft", JSON.stringify({ docMeta, blocks }));
      alert("✅ Document draft saved locally!");
    } catch (e) {
      console.error(e);
    }
  };

  const loadPreset = (key) => {
    const preset = PRESET_TEMPLATES[key];
    if (preset) {
      setDocMeta((prev) => ({
        ...prev,
        docTitle: preset.docTitle,
        docSubtitle: preset.docSubtitle,
        authorName: preset.authorName,
        docDate: preset.docDate,
        globalFont: preset.globalFont,
        direction: preset.direction,
      }));
      setBlocks(preset.blocks);
    }
  };

  // Block management
  const addBlock = (type) => {
    const newId = "b_" + Date.now();
    const newBlock = {
      id: newId,
      type: type,
      content:
        type === "title"
          ? "Document Title"
          : type === "heading1"
          ? "Heading Level 1"
          : type === "heading2"
          ? "Heading Level 2"
          : type === "heading3"
          ? "Heading Level 3"
          : type === "bulletList"
          ? "First item\nSecond item\nThird item"
          : type === "numberedList"
          ? "Step 1\nStep 2\nStep 3"
          : type === "callout"
          ? "Important note or highlight box."
          : type === "signature"
          ? "Signature\nName: \nDesignation: "
          : "Enter your paragraph text here...",
      font: docMeta.globalFont,
      align: docMeta.direction === "rtl" ? "right" : "left",
      bold: type.startsWith("heading") || type === "title",
      italic: false,
      underline: false,
      fontSize:
        type === "title"
          ? "26px"
          : type === "heading1"
          ? "22px"
          : type === "heading2"
          ? "18px"
          : type === "heading3"
          ? "16px"
          : "15px",
      color: "#0f172a",
    };
    setBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(newId);
  };

  const updateBlock = (id, field, value) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  const moveBlock = (index, dir) => {
    const newBlocks = [...blocks];
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 mm width
      const pageHeight = 297; // A4 mm height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${docMeta.docTitle.replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, "_") || "document"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Standard PDF print dialog opening instead...");
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const getFontClass = (fontName) => {
    switch (fontName) {
      case "urdu":
        return "font-urdu";
      case "english":
        return "font-english";
      case "arabic":
        return "font-arabic";
      default:
        return "font-sans";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div>
        <HeaderNav />

        {/* TOP HERO */}
        <section className="no-print relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-12 px-4 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              📝 Free Mobile MS Word Alternative & PDF Generator
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Rich Document Editor & Word to PDF Creator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Create, format, and generate official documents on your mobile or computer without Microsoft Word. Includes authentic default font support for <strong className="text-amber-300">Urdu (Jameel Noori Nastaleeq)</strong>, <strong className="text-amber-300">English (Times New Roman)</strong>, and <strong className="text-amber-300">Arabic (Sakal Majalla / Amiri)</strong>.
            </p>

            {/* PRESET BUTTONS */}
            <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => loadPreset("urdu_app")}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5"
              >
                <span>🇵🇰</span> Urdu Application Template (جمیل نوری نستعلیق)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("english_letter")}
                className="px-3.5 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold hover:bg-blue-500/30 transition flex items-center gap-1.5"
              >
                <span>🇬🇧</span> English Letter Template (Times New Roman)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("arabic_doc")}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
              >
                <span>🇸🇦</span> Arabic Document (صقل مجلة / أميري)
              </button>
            </div>
          </div>
        </section>

        {/* MAIN TWO-COLUMN WORKSPACE */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM EDIT CONTROLS */}
          <div className="no-print lg:col-span-6 space-y-6">
            
            {/* DOCUMENT GLOBAL SETTINGS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <span>⚙️</span> Document Global Settings
                </h2>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                >
                  💾 Save Draft
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Default Language Font</label>
                  <select
                    value={docMeta.globalFont}
                    onChange={(e) => setDocMeta({ ...docMeta, globalFont: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-semibold outline-none focus:border-amber-400"
                  >
                    <option value="urdu">🇵🇰 Urdu - Jameel Noori Nastaleeq</option>
                    <option value="english">🇬🇧 English - Times New Roman</option>
                    <option value="arabic">🇸🇦 Arabic - Sakal Majalla / Amiri</option>
                    <option value="sans">📱 Standard Sans-Serif (Arial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Text Direction</label>
                  <select
                    value={docMeta.direction}
                    onChange={(e) => setDocMeta({ ...docMeta, direction: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-semibold outline-none focus:border-amber-400"
                  >
                    <option value="rtl">Right to Left (RTL - Urdu / Arabic)</option>
                    <option value="ltr">Left to Right (LTR - English / Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Document Title / Header</label>
                  <input
                    type="text"
                    value={docMeta.docTitle}
                    onChange={(e) => setDocMeta({ ...docMeta, docTitle: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Author / Organization Name</label>
                  <input
                    type="text"
                    value={docMeta.authorName}
                    onChange={(e) => setDocMeta({ ...docMeta, authorName: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Document Date</label>
                  <input
                    type="date"
                    value={docMeta.docDate}
                    onChange={(e) => setDocMeta({ ...docMeta, docDate: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Line Height Spacing</label>
                  <select
                    value={docMeta.lineHeight}
                    onChange={(e) => setDocMeta({ ...docMeta, lineHeight: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-semibold outline-none focus:border-amber-400"
                  >
                    <option value="1.4">Tight (1.4)</option>
                    <option value="1.8">Normal (1.8)</option>
                    <option value="2.2">Relaxed / Urdu (2.2)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ADD BLOCK BUTTONS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                ➕ Add Content Section / Block
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => addBlock("title")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  📌 Document Title
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading1")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  H1 Heading 1
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading2")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  H2 Subheading
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  ¶ Paragraph Text
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("bulletList")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("numberedList")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  1. Numbered List
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("callout")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  💡 Highlight Box
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("signature")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400 border border-slate-700 font-bold text-slate-200 transition"
                >
                  ✍️ Signature Field
                </button>
              </div>
            </div>

            {/* BLOCK EDIT LIST */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                📄 Document Content Blocks ({blocks.length})
              </h2>

              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`rounded-2xl border transition p-4 ${
                    activeBlockId === block.id
                      ? "bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/10"
                      : "bg-slate-900/70 border-slate-800"
                  }`}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-black uppercase text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                      Block #{index + 1}: {block.type}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(index, -1);
                        }}
                        disabled={index === 0}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 text-xs"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(index, 1);
                        }}
                        disabled={index === blocks.length - 1}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 text-xs"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800/40 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Rich Block Formatting Controls */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Font</label>
                      <select
                        value={block.font}
                        onChange={(e) => updateBlock(block.id, "font", e.target.value)}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-white text-xs"
                      >
                        <option value="urdu">Jameel Noori (Urdu)</option>
                        <option value="english">Times New Roman</option>
                        <option value="arabic">Sakal Majalla / Amiri</option>
                        <option value="sans">Sans-Serif</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Align</label>
                      <select
                        value={block.align}
                        onChange={(e) => updateBlock(block.id, "align", e.target.value)}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-white text-xs"
                      >
                        <option value="right">Right (داںیاں)</option>
                        <option value="center">Center (درمیان)</option>
                        <option value="left">Left (بائیں)</option>
                        <option value="justify">Justify (برابر)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Font Size</label>
                      <select
                        value={block.fontSize}
                        onChange={(e) => updateBlock(block.id, "fontSize", e.target.value)}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-white text-xs"
                      >
                        <option value="12px">12px (Small)</option>
                        <option value="15px">15px (Normal)</option>
                        <option value="18px">18px (Medium)</option>
                        <option value="22px">22px (Large)</option>
                        <option value="28px">28px (Title)</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-1 pt-3">
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, "bold", !block.bold)}
                        className={`flex-1 py-1 rounded font-bold border text-xs ${
                          block.bold ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, "italic", !block.italic)}
                        className={`flex-1 py-1 rounded italic font-bold border text-xs ${
                          block.italic ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBlock(block.id, "underline", !block.underline)}
                        className={`flex-1 py-1 rounded underline font-bold border text-xs ${
                          block.underline ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        U
                      </button>
                    </div>
                  </div>

                  {/* Text Content Input */}
                  <textarea
                    rows={block.type === "paragraph" || block.type.includes("List") ? 4 : 2}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                    placeholder="Enter block text here..."
                    className={`w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white text-sm outline-none focus:border-amber-400 ${getFontClass(
                      block.font
                    )}`}
                    dir={docMeta.direction}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE A4 SHEET PREVIEW & EXPORT ACTIONS */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* ACTION BAR */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 border border-slate-800 p-4 sticky top-4 z-20 shadow-xl">
              <div>
                <span className="text-xs font-bold text-slate-400">Live Preview & Export</span>
                <h3 className="text-base font-black text-white">A4 Paper View</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print / Save PDF
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>📥</span> {downloadingPdf ? "Generating..." : "Download PNG"}
                </button>
              </div>
            </div>

            {/* A4 CANVAS CONTAINER */}
            <div className="overflow-x-auto pb-6">
              <div
                ref={printRef}
                className={`print-area mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 border border-slate-200 transition-all ${getFontClass(
                  docMeta.globalFont
                )}`}
                style={{
                  width: "100%",
                  maxWidth: "210mm",
                  minHeight: "297mm",
                  direction: docMeta.direction,
                  lineHeight: docMeta.lineHeight,
                }}
              >
                {/* DOCUMENT HEADER */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                      {docMeta.docTitle || "Untitled Document"}
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold">{docMeta.docSubtitle}</p>
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-500 space-y-0.5">
                    <p>Date: {docMeta.docDate}</p>
                    <p>Author: {docMeta.authorName}</p>
                  </div>
                </div>

                {/* BLOCKS RENDER */}
                <div className="space-y-4">
                  {blocks.map((block) => {
                    const blockFontClass = getFontClass(block.font || docMeta.globalFont);
                    const style = {
                      fontSize: block.fontSize,
                      textAlign: block.align,
                      fontWeight: block.bold ? "bold" : "normal",
                      fontStyle: block.italic ? "italic" : "normal",
                      textDecoration: block.underline ? "underline" : "none",
                      color: block.color || "#0f172a",
                    };

                    if (block.type === "title") {
                      return (
                        <h1 key={block.id} className={`${blockFontClass} my-2`} style={style}>
                          {block.content}
                        </h1>
                      );
                    }

                    if (block.type === "heading1") {
                      return (
                        <h2 key={block.id} className={`${blockFontClass} my-2 border-b pb-1`} style={style}>
                          {block.content}
                        </h2>
                      );
                    }

                    if (block.type === "heading2") {
                      return (
                        <h3 key={block.id} className={`${blockFontClass} my-1.5`} style={style}>
                          {block.content}
                        </h3>
                      );
                    }

                    if (block.type === "heading3") {
                      return (
                        <h4 key={block.id} className={`${blockFontClass} my-1`} style={style}>
                          {block.content}
                        </h4>
                      );
                    }

                    if (block.type === "bulletList") {
                      const items = block.content.split("\n").filter((i) => i.trim());
                      return (
                        <ul
                          key={block.id}
                          className={`list-disc list-inside space-y-1 ${blockFontClass}`}
                          style={style}
                        >
                          {items.map((it, i) => (
                            <li key={i}>{it}</li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "numberedList") {
                      const items = block.content.split("\n").filter((i) => i.trim());
                      return (
                        <ol
                          key={block.id}
                          className={`list-decimal list-inside space-y-1 ${blockFontClass}`}
                          style={style}
                        >
                          {items.map((it, i) => (
                            <li key={i}>{it}</li>
                          ))}
                        </ol>
                      );
                    }

                    if (block.type === "callout") {
                      return (
                        <div
                          key={block.id}
                          className={`p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 my-3 text-amber-950 ${blockFontClass}`}
                          style={style}
                        >
                          {block.content}
                        </div>
                      );
                    }

                    if (block.type === "signature") {
                      return (
                        <div
                          key={block.id}
                          className={`mt-10 pt-4 border-t border-slate-300 max-w-xs ${blockFontClass} ${
                            block.align === "right" ? "mr-0 ml-auto" : "ml-0 mr-auto"
                          }`}
                          style={style}
                        >
                          <p className="whitespace-pre-line">{block.content}</p>
                        </div>
                      );
                    }

                    // Default Paragraph
                    return (
                      <p key={block.id} className={`whitespace-pre-line my-2 ${blockFontClass}`} style={style}>
                        {block.content}
                      </p>
                    );
                  })}
                </div>

                {/* DOCUMENT FOOTER */}
                <div className="mt-16 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 flex justify-between items-center">
                  <span>Generated via HMT Success Academy Rich Document Editor</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HMT Financial Services & Success Academy. All rights reserved.</p>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <Link href="/free-services" className="hover:underline">
              Free Hub
            </Link>
            <Link href="/tools" className="hover:underline">
              Free Tools
            </Link>
            <Link href="/cv-builder" className="hover:underline">
              CV Builder
            </Link>
            <Link href="/portal" className="hover:underline">
              Student Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
