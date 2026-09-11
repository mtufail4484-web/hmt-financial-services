"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeaderNav from "../HeaderNav";

// TEMPLATE CATEGORIES AND SUB-TEMPLATES
const TEMPLATE_CATEGORIES = [
  { id: "application", label: "📝 Formal Applications (درخواستیں)" },
  { id: "letter", label: "✉️ Formal Letters (خطوط و مراسلات)" },
  { id: "report", label: "📋 Reports & Certificates (رپورٹ و سرٹیفکیٹ)" },
  { id: "custom", label: "🎨 Custom Blank Document (کسٹم یا خالی صفحہ)" },
];

const SUB_TEMPLATES = {
  application: [
    { id: "sick_leave_urdu", label: "🤒 Sick Leave Application (درخواست برائے بیماری کی رخصت - اردو)" },
    { id: "urgent_leave_urdu", label: "🏠 Urgent Work Leave Application (درخواست برائے ضروری کام - اردو)" },
    { id: "cert_request_urdu", label: "🎓 Certificate Issuance Application (درخواست برائے اجراء سرٹیفکیٹ - اردو)" },
    { id: "fee_concession_urdu", label: "💰 Fee Concession Application (درخواست برائے رعایت فیس - اردو)" },
    { id: "leave_english", label: "🏥 Official Leave Application (English - Times New Roman)" },
    { id: "job_application_english", label: "💼 Job Application & Cover Letter (English)" },
  ],
  letter: [
    { id: "recommendation_english", label: "📜 Recommendation Letter (English)" },
    { id: "experience_cert_urdu", label: "💼 Experience Certificate Letter (تجربہ کار سرٹیفکیٹ - اردو)" },
    { id: "formal_inquiry_english", label: "✉️ Business Inquiry Letter (English)" },
    { id: "inquiry_urdu", label: "📩 سرکاری معلوماتی مراسلہ (اردو)" },
  ],
  report: [
    { id: "meeting_minutes", label: "📝 Meeting Minutes Document (رودادِ اجلاس)" },
    { id: "noc_certificate", label: "📜 No Objection Certificate (NOC - عدم اعتراض سرٹیفکیٹ)" },
    { id: "progress_report", label: "📊 Academic Progress Report (کارکردگی رپورٹ)" },
  ],
  custom: [
    { id: "blank_urdu", label: "🇵🇰 Blank Urdu Canvas (جمیل نوری نستعلیق)" },
    { id: "blank_english", label: "🇬🇧 Blank English Canvas (Times New Roman)" },
    { id: "blank_arabic", label: "🇸🇦 Blank Arabic Canvas (صقل مجلة / أميري)" },
  ],
};

// FULL DATA DEFINITION FOR TEMPLATES
const PRESET_TEMPLATES = {
  // SICK LEAVE URDU
  sick_leave_urdu: {
    docTitle: "درخواست برائے بیماری کی رخصت",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی / تعلیمی ادارہ",
    authorName: "محمد علی (طالب علم)",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "بخدمت جناب پرنسپل صاحب / ہیڈ ماسٹر صاحب",
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
        content: "عنوان: درخواست برائے رخصت بوجہ بیماری (دو ایام)",
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
          "جناب عالی!\nمودبانہ گزارش ہے کہ فدوی کو گزشتہ رات سے تیز بخار اور جسمانی علالت لاحق ہے۔ معالج ڈاکٹر صاحب نے دو دن مکمل آرام کا مشورہ دیا ہے۔ جس کی بنا پر فدوی حاضرِ کلاس ہونے سے قاصر ہے۔",
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
          "لہٰذا التماس ہے کہ فدوی کو دو یوم کی رخصتِ بیماری منظور فرمائی جائے۔ آپ کی عین نوازش ہوگی۔",
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
        content: "العارض:\nمحمد علی\nرول نمبر: HMT-4092\nکلاس: فری کمپیوٹر کورس بیچ 02\nتاریخ: " + new Date().toISOString().split("T")[0],
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

  // URGENT WORK LEAVE URDU
  urgent_leave_urdu: {
    docTitle: "درخواست برائے ضروری کام",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی / ادارہ",
    authorName: "عمر فاروق",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "بخدمت جناب ڈائریکٹر صاحب / ہیڈ آف ڈیپارٹمنٹ",
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
        type: "heading2",
        content: "عنوان: درخواست برائے رخصت بوجہ ضروری کام (ایک یوم)",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "18px",
        color: "#1e3a8a",
      },
      {
        id: "3",
        type: "paragraph",
        content:
          "مودبانہ التماس ہے کہ فدوی کو گھر پر انتہائی ضروری کام درپیش ہے جس کی وجہ سے فدوی آج ادارے میں حاضر ہونے سے قاصر ہے۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "4",
        type: "paragraph",
        content: "مہربانی فرما کر فدوی کو ایک یوم کی رخصت عنایت فرمائی جائے۔ ممنون ہوں گا۔",
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
        type: "signature",
        content: "العارض:\nعمر فاروق\nرول نمبر / شناختی نمبر: HMT-8821\nشعبہ: کمپیوٹر سائنس",
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

  // CERTIFICATE REQUEST URDU
  cert_request_urdu: {
    docTitle: "درخواست برائے اجراء کمپیوٹر کورس سرٹیفکیٹ",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی",
    authorName: "محمد حمزہ",
    docDate: new Date().toISOString().split("T")[0],
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
        type: "heading2",
        content: "عنوان: درخواست برائے اجراء تصدیق شدہ سرٹیفکیٹ",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "18px",
        color: "#1e3a8a",
      },
      {
        id: "3",
        type: "paragraph",
        content:
          "گزارش ہے کہ فدوی نے ایچ ایم ٹی سکسیس اکیڈمی کے تحت فری کمپیوٹر کورس بیچ 02 کامیابی کے ساتھ مکمل کر لیا ہے۔ تمام عملی اسائنمنٹس اور موک ٹیسٹ کلیئر کر لیے گئے ہیں۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "4",
        type: "paragraph",
        content:
          "لہٰذا التماس ہے کہ فدوی کو رسمی سرٹیفکیٹ جاری فرمایا جائے تا کہ میں نوکری کے لیے اپلائی کر سکوں۔ آپ کی نوازش ہوگی۔",
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
        type: "signature",
        content: "العارض:\nمحمد حمزہ\nرول نمبر: HMT-2026-889",
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

  // FEE CONCESSION URDU
  fee_concession_urdu: {
    docTitle: "درخواست برائے رعایت فیس",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی",
    authorName: "سلمان خان",
    docDate: new Date().toISOString().split("T")[0],
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
        type: "heading2",
        content: "عنوان: درخواست برائے خصوصی رعایتِ فیس",
        font: "urdu",
        align: "right",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "18px",
        color: "#1e3a8a",
      },
      {
        id: "3",
        type: "paragraph",
        content:
          "ادب کے ساتھ گزارش ہے کہ فدوی کا تعلق ایک کم آمدن گھرانے سے ہے۔ والد صاحب کی محدود آمدن کے باعث فدوی کے تعلیمی اخراجات ادا کرنا دشوار ہو رہا ہے۔ فدوی کی تعلیمی کارکردگی اور حاضری باقاعدہ بہترین ہے۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "4",
        type: "paragraph",
        content: "التماس ہے کہ فدوی کی ماہانہ فیس میں خصوصی رعایت فرمائی جائے تا کہ تعلیم جاری رکھی جا سکے۔",
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
        type: "signature",
        content: "العارض:\nسلمان خان\nرول نمبر: HMT-7712",
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

  // LEAVE ENGLISH
  leave_english: {
    docTitle: "OFFICIAL LEAVE APPLICATION",
    docSubtitle: "HMT Success Academy & Education Center",
    authorName: "Muhammad Hamza",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "To,\nThe Principal / Academic Director,\nHMT Success Academy, Peshawar",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "18px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "heading2",
        content: "Subject: Application for Leave of Absence (2 Days)",
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
          "Respected Sir/Madam,\n\nMost respectfully I beg to state that I am suffering from severe fever and doctor has advised complete bed rest for two days. Consequently, I am unable to attend regular lectures.",
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
        type: "paragraph",
        content: "Kindly grant me leave for two days. I shall be deeply grateful to you for this act of kindness.",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
      {
        id: "5",
        type: "signature",
        content: "Yours Obediently,\nMuhammad Hamza\nRoll No: HMT-2026-889\nBatch: Computer Course Batch 02",
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

  // JOB APPLICATION ENGLISH
  job_application_english: {
    docTitle: "JOB APPLICATION & COVER LETTER",
    docSubtitle: "Computer Operator / Office Assistant Position",
    authorName: "Muhammad Hamza",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "To,\nThe HR Manager / Administrator,\nOrganization Name, Peshawar",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "18px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "heading2",
        content: "Subject: Application for the Post of Computer Operator / Office Assistant",
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
          "Respected Sir,\n\nI am writing to express my strong interest in the Computer Operator position at your esteemed organization. Having recently completed the Master Computer Application & Office Automation Course from HMT Success Academy, I possess extensive practical skills in MS Word, MS Excel, PowerPoint, and document formatting.",
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
          "Proficient in English and Urdu document typing & formatting\nExpertise in Excel VLOOKUP, formulas, and marksheet generation\nStrong organizational skills with verified academic certifications",
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
        type: "signature",
        content: "Sincerely,\nMuhammad Hamza\nPhone: +92 300 1234567\nEmail: hamza@example.com",
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

  // RECOMMENDATION ENGLISH
  recommendation_english: {
    docTitle: "OFFICIAL RECOMMENDATION LETTER",
    docSubtitle: "HMT Success Academy - Academic Reference",
    authorName: "Muhammad Tufail (Director)",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "TO WHOM IT MAY CONCERN",
        font: "english",
        align: "center",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "22px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content:
          "This letter serves to formally recommend Mr. Muhammad Hamza, who has completed the Free Professional Computer Application Course under HMT Success Academy. During his tenure, he demonstrated exceptional dedication, high ethical standards, and proficient technical mastery.",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
      {
        id: "3",
        type: "signature",
        content: "Issued by,\nMuhammad Tufail\nDirector & Master Instructor\nHMT Success Academy",
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

  // EXPERIENCE CERT URDU
  experience_cert_urdu: {
    docTitle: "تجربہ کار سرٹیفکیٹ (مراسلہ)",
    docSubtitle: "ایچ ایم ٹی فنانشل سروسز",
    authorName: "محمد طفیل (ڈائریکٹر)",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "جس سے بھی متعلق ہو (تصدیق نامہ)",
        font: "urdu",
        align: "center",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "22px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content:
          "تصدیق کی جاتی ہے کہ مسٹر محمد حمزہ نے ہمارے ادارے میں بحیثیت کمپیوٹر آپریٹر و ڈیٹا اینٹری اسسٹنٹ خدمات انجام دیں۔ ان کا کردار، اخلاق اور کام کی معیار انتہائی شاندار اور تسلی بخش رہا ہے۔",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
      {
        id: "3",
        type: "signature",
        content: "دستخط کنندہ:\nمحمد طفیل\nچیف ایگزیکٹو، ایچ ایم ٹی سروسز",
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

  // MEETING MINUTES
  meeting_minutes: {
    docTitle: "ROODAD-E-IJLAS / MEETING MINUTES",
    docSubtitle: "Executive Committee Meeting",
    authorName: "General Secretary",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "OFFICIAL MEETING MINUTES RECORD",
        font: "english",
        align: "center",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "20px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content: "Meeting Date: " + new Date().toISOString().split("T")[0] + "\nLocation: Main Campus Conference Hall\nChairperson: Director HMT Success Academy",
        font: "english",
        align: "left",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "14px",
        color: "#334155",
      },
      {
        id: "3",
        type: "heading2",
        content: "Key Decision Points & Action Items:",
        font: "english",
        align: "left",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e3a8a",
      },
      {
        id: "4",
        type: "numberedList",
        content:
          "Approved launch of Batch 03 Computer Course registrations\nFinalized examination rules for ETEA mock test portal\nResolved student identity verification and certificate issuance flow",
        font: "english",
        align: "left",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "14px",
        color: "#1e293b",
      },
      {
        id: "5",
        type: "signature",
        content: "Recorded by:\nSecretary Executive Committee",
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

  // NOC CERTIFICATE
  noc_certificate: {
    docTitle: "NO OBJECTION CERTIFICATE (NOC / عدم اعتراض)",
    docSubtitle: "HMT Academic Office",
    authorName: "Registrar Office",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "heading1",
        content: "NO OBJECTION CERTIFICATE (NOC)",
        font: "english",
        align: "center",
        bold: true,
        italic: false,
        underline: true,
        fontSize: "22px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content:
          "This is to certify that this institution has No Objection to Mr. Muhammad Hamza (Roll No: HMT-2026-889) applying for higher education or competitive examination certification.",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
      {
        id: "3",
        type: "signature",
        content: "Issued by Registrar,\nHMT Academic Board",
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

  // BLANK URDU
  blank_urdu: {
    docTitle: "عنوانِ دستاویز",
    docSubtitle: "ذیلی عنوان",
    authorName: "مصنف کا نام",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "title",
        content: "یہاں اپنا عنوان درج کریں",
        font: "urdu",
        align: "center",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "26px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content: "یہاں اپنا تفصیل یا پیراگراف درج کریں...",
        font: "urdu",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "16px",
        color: "#1e293b",
      },
    ],
  },

  // BLANK ENGLISH
  blank_english: {
    docTitle: "Document Title",
    docSubtitle: "Subtitle Here",
    authorName: "Author Name",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "english",
    direction: "ltr",
    blocks: [
      {
        id: "1",
        type: "title",
        content: "Enter Document Title Here",
        font: "english",
        align: "center",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "26px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content: "Enter your paragraph content here...",
        font: "english",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "15px",
        color: "#1e293b",
      },
    ],
  },

  // BLANK ARABIC
  blank_arabic: {
    docTitle: "عنوان المستند",
    docSubtitle: "العنوان الفرعي",
    authorName: "اسم الكاتب",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "arabic",
    direction: "rtl",
    blocks: [
      {
        id: "1",
        type: "title",
        content: "بسم الله الرحمن الرحيم",
        font: "arabic",
        align: "center",
        bold: true,
        italic: false,
        underline: false,
        fontSize: "26px",
        color: "#0f172a",
      },
      {
        id: "2",
        type: "paragraph",
        content: "اكتب النص هنا...",
        font: "arabic",
        align: "justify",
        bold: false,
        italic: false,
        underline: false,
        fontSize: "17px",
        color: "#1e293b",
      },
    ],
  },
};

export default function DocumentEditorPage() {
  // Category and Subcategory selection state
  const [selectedCategory, setSelectedCategory] = useState("application");
  const [selectedSubTemplate, setSelectedSubTemplate] = useState("sick_leave_urdu");

  // Autofill placeholder state
  const [autofill, setAutofill] = useState({
    applicantName: "محمد حمزہ",
    rollNo: "HMT-2026-889",
    instituteName: "ایچ ایم ٹی سکسیس اکیڈمی",
    recipientName: "جناب پرنسپل صاحب",
    docDate: new Date().toISOString().split("T")[0],
  });

  const [docMeta, setDocMeta] = useState({
    docTitle: "درخواست برائے بیماری کی رخصت",
    docSubtitle: "ایچ ایم ٹی سکسیس اکیڈمی / تعلیمی ادارہ",
    authorName: "محمد علی (طالب علم)",
    docDate: new Date().toISOString().split("T")[0],
    globalFont: "urdu", // urdu | english | arabic | sans
    direction: "rtl", // rtl | ltr
    lineHeight: "1.8",
  });

  const [blocks, setBlocks] = useState(PRESET_TEMPLATES.sick_leave_urdu.blocks);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const printRef = useRef(null);

  // When primary category changes, update available subtemplates and pick first one
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const subList = SUB_TEMPLATES[catId];
    if (subList && subList.length > 0) {
      const firstSub = subList[0].id;
      setSelectedSubTemplate(firstSub);
      loadPreset(firstSub);
    }
  };

  // When subtemplate dropdown changes, load it
  const handleSubTemplateChange = (subId) => {
    setSelectedSubTemplate(subId);
    loadPreset(subId);
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

  // Apply quick autofill form variables to current document
  const applyAutofill = () => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => {
        let updatedText = b.content;
        if (autofill.applicantName) {
          updatedText = updatedText.replace(/محمد حمزہ|محمد علی|عمر فاروق|سلمان خان|Muhammad Hamza/g, autofill.applicantName);
        }
        if (autofill.rollNo) {
          updatedText = updatedText.replace(/HMT-2026-889|HMT-4092|HMT-8821|HMT-7712/g, autofill.rollNo);
        }
        if (autofill.instituteName) {
          updatedText = updatedText.replace(/ایچ ایم ٹی سکسیس اکیڈمی|HMT Success Academy/g, autofill.instituteName);
        }
        if (autofill.recipientName) {
          updatedText = updatedText.replace(/جناب پرنسپل صاحب|جناب ڈائریکٹر صاحب|The Principal|The HR Manager/g, autofill.recipientName);
        }
        return { ...b, content: updatedText };
      })
    );
    alert("✅ Document fields updated with your custom details!");
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
          : type === "bulletList"
          ? "First item\nSecond item\nThird item"
          : type === "numberedList"
          ? "Step 1\nStep 2\nStep 3"
          : type === "callout"
          ? "Important note or highlight box."
          : type === "signature"
          ? "Signature / دستخط\nName / نام: \nDesignation / عہدہ: "
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
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${docMeta.docTitle.replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, "_") || "document"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
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
        <section className="no-print relative overflow-hidden bg-gradient-to-b from-[#031530] via-slate-900 to-slate-950 py-10 px-4 border-b border-slate-800 text-center">
          <div className="max-w-5xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
              📝 Mobile MS Word & Multi-Purpose Document Creator
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Pick Template & Create Professional Documents
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Select any document category below (Applications, Formal Letters, Reports, or Custom Blank Document) and customize pre-formatted text with <strong className="text-amber-300">Urdu (Jameel Noori Nastaleeq)</strong>, <strong className="text-amber-300">English (Times New Roman)</strong>, or <strong className="text-amber-300">Arabic (Sakal Majalla / Amiri)</strong>.
            </p>

            {/* DYNAMIC TWO-TIER DROPDOWN SELECTOR */}
            <div className="pt-3 max-w-3xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {/* 1ST DROPDOWN: CATEGORY */}
                <div>
                  <label className="block text-xs font-black uppercase text-amber-400 mb-1">
                    1️⃣ Document Type / Category (قسم منتخب کریں)
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-amber-500/40 px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-400"
                  >
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2ND DROPDOWN: SUB-TEMPLATE */}
                <div>
                  <label className="block text-xs font-black uppercase text-amber-400 mb-1">
                    2️⃣ Template Option (ٹیمپلیٹ چنیں)
                  </label>
                  <select
                    value={selectedSubTemplate}
                    onChange={(e) => handleSubTemplateChange(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-amber-500/40 px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold outline-none focus:border-amber-400"
                  >
                    {(SUB_TEMPLATES[selectedCategory] || []).map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN TWO-COLUMN WORKSPACE */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: AUTOFILL & EDIT CONTROLS */}
          <div className="no-print lg:col-span-6 space-y-6">
            
            {/* QUICK AUTOFILL FORM */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>⚡</span> Quick Fill Details (فوری معلومات تبدیل کریں)
                </h2>
                <button
                  type="button"
                  onClick={applyAutofill}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition shadow"
                >
                  ⚡ Auto-Apply to Document
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Name (نام)</label>
                  <input
                    type="text"
                    value={autofill.applicantName}
                    onChange={(e) => setAutofill({ ...autofill, applicantName: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Roll No / ID (رول نمبر)</label>
                  <input
                    type="text"
                    value={autofill.rollNo}
                    onChange={(e) => setAutofill({ ...autofill, rollNo: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Institute / Company (ادارہ)</label>
                  <input
                    type="text"
                    value={autofill.instituteName}
                    onChange={(e) => setAutofill({ ...autofill, instituteName: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Addressed To (بخدمت)</label>
                  <input
                    type="text"
                    value={autofill.recipientName}
                    onChange={(e) => setAutofill({ ...autofill, recipientName: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* GLOBAL STYLING */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <h2 className="text-base font-black text-amber-400 border-b border-slate-800 pb-2">
                ⚙️ Global Document Formatting
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Font Family</label>
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
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Document Header Title</label>
                  <input
                    type="text"
                    value={docMeta.docTitle}
                    onChange={(e) => setDocMeta({ ...docMeta, docTitle: e.target.value })}
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
              </div>
            </div>

            {/* ADD BLOCK BUTTONS */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                ➕ Add Custom Block / Section
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => addBlock("title")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  📌 Title
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading1")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  H1 Heading
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  ¶ Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("bulletList")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("numberedList")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  1. Number List
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("callout")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  💡 Highlight Box
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("signature")}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 border border-slate-700 font-bold text-slate-200"
                >
                  ✍️ Signature
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
                      ? "bg-slate-900 border-amber-400 shadow-lg"
                      : "bg-slate-900/70 border-slate-800"
                  }`}
                  onClick={() => setActiveBlockId(block.id)}
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-black uppercase text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
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
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 disabled:opacity-30 text-xs"
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
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 disabled:opacity-30 text-xs"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Format Controls */}
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
                      <label className="block text-[10px] font-bold text-slate-500">Size</label>
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

                  {/* Text Input */}
                  <textarea
                    rows={block.type === "paragraph" || block.type.includes("List") ? 4 : 2}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                    className={`w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white text-sm outline-none focus:border-amber-400 ${getFontClass(
                      block.font
                    )}`}
                    dir={docMeta.direction}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE A4 PREVIEW & EXPORT ACTIONS */}
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 flex items-center gap-1.5"
                >
                  <span>🖨️</span> Print / Save PDF
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>📥</span> {downloadingPdf ? "Generating..." : "Download PNG"}
                </button>
              </div>
            </div>

            {/* A4 PAPER CANVAS */}
            <div className="overflow-x-auto pb-6">
              <div
                ref={printRef}
                className={`print-area mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 border border-slate-200 ${getFontClass(
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
                {/* HEADER */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                      {docMeta.docTitle || "Untitled Document"}
                    </h1>
                    {docMeta.docSubtitle && (
                      <p className="text-xs text-slate-600 font-semibold">{docMeta.docSubtitle}</p>
                    )}
                  </div>
                  <div className="text-right text-[11px] font-semibold text-slate-500">
                    <p>Date: {docMeta.docDate}</p>
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

                    if (block.type === "bulletList") {
                      const items = block.content.split("\n").filter((i) => i.trim());
                      return (
                        <ul key={block.id} className={`list-disc list-inside space-y-1 ${blockFontClass}`} style={style}>
                          {items.map((it, i) => (
                            <li key={i}>{it}</li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "numberedList") {
                      const items = block.content.split("\n").filter((i) => i.trim());
                      return (
                        <ol key={block.id} className={`list-decimal list-inside space-y-1 ${blockFontClass}`} style={style}>
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

                {/* FOOTER */}
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
          </div>
        </div>
      </footer>
    </div>
  );
}
