"use client";

import { useState, useEffect } from "react";
// 🔗 Next.js client-side navigation use karne ke liye Link import kiya hai
import Link from "next/link"; 

export default function ComputerCourse() {
  // 🟢 ALL STUDENT PORTAL LINKS FULLY INTEGRATED WITH YOUR LIVE LINKS
  const youtubePlaylistLink = "https://www.youtube.com/playlist?list=PL7-zXwiLK4QpTLwRwytLdvhBJplS1lnhA";
  const googleDriveLink = "https://drive.google.com/drive/folders/1-d9C9vTIUD-Y_Q0GKltyQHM7_9TWm_tB?usp=sharing"; 
  const googleFormSubmissionLink = "https://forms.gle/LM17vUDFQZzE3a8o9"; 
  const cvTemplateLink = "https://docs.google.com/document/d/1vQ4FWdqN2Uq2UygMlaLePHqdeKXZ28_D/edit?usp=drive_link&ouid=112391314571199093147&rtpof=true&sd=true";
  const office2021Link = "https://drive.google.com/file/d/11-Qk552kmKxK56-TWgi5afMQQv9Ej40O/view?usp=drive_link";
  const whatsappChannelLink = "https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H";
  const youtubeSubscribeLink = "https://youtube.com/@hmtsuccessacademy?sub_confirmation=1";

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* HEADING (MAIN TITLE) */}
        <h1
          style={{
            fontSize: "40px",
            color: "#0b2c5f",
            textAlign: "center",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          FREE COMPUTER COURSE
        </h1>

        <h3
          style={{
            textAlign: "center",
            color: "#6c757d",
            marginBottom: "15px",
            fontSize: "22px",
            fontWeight: "bold"
          }}
        >
          💻 Batch 02 — HMT Success Academy
        </h3>

        {/* ACTIVE COURSE STATUS BANNER */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ color: "red", margin: "0 0 5px 0", fontWeight: "bold", fontSize: "26px" }}>
            🔴 CLASSES ARE IN PROGRESS / BATCH 02 IS LIVE!
          </h2>
          <h3 style={{ color: "red", margin: 0, fontSize: "22px", direction: "rtl", fontFamily: "Segoe UI, Arial" }}>
            🔴 کمپیوٹر کلاسز باقاعدہ شروع ہو چکی ہیں!
          </h3>
        </div>

        {/* STATUS BAR SECTION (UPDATED FOR COURSE PROGRESSION) */}
        <div
          style={{
            background: "#0b2c5f",
            color: "white",
            textAlign: "center",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
          }}
        >
          <div>
            <span style={{ fontSize: "26px", fontWeight: "bold", display: "block" }}>✨ STATUS: COURSE IS IN PROGRESS!</span>
            <span style={{ fontSize: "18px", display: "block", marginTop: "5px", direction: "rtl" }}>
              کمپیوٹر کورس کی کلاسز باقاعدگی سے جاری ہیں۔ نیچے دیے گئے اسٹوڈنٹ پورٹل پر لاگ ان کریں، ویڈیوز دیکھیں اور حاضری یقینی بنائیں۔ 👇
            </span>
          </div>
        </div>

        {/* COURSE IMAGE */}
        <img
          src="/computer-course.jpg"
          alt="Computer Course"
          style={{
            width: "100%",
            borderRadius: "20px",
            marginBottom: "30px",
          }}
        />

        {/* SUBSCRIBE BUTTON WITH AUTO-CONFIRM LINK */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <a
            href={youtubeSubscribeLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "red",
              color: "white",
              padding: "18px 30px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "20px",
              display: "inline-block",
              boxShadow: "0 4px 15px rgba(255, 0, 0, 0.3)",
              textAlign: "center"
            }}
          >
            <span style={{ display: "block" }}>🔴 Subscribe to YouTube Channel</span>
            <span style={{ display: "block", fontSize: "16px", fontWeight: "normal", marginTop: "5px", direction: "rtl" }}>
              چینل کو سبسکرائب کریں تاکہ روزانہ نئی لائیو کلاس کا نوٹیفکیشن مل سکے
            </span>
          </a>
        </div>

        {/* LIVE CLASS PLAYLIST PLAYER */}
        <div
          style={{
            background: "#fff3cd",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
            <h2 style={{ color: "#0b2c5f", margin: 0 }}>🎥 COURSE PLAYLIST (ALL CLASSES)</h2>
            <h2 style={{ color: "#0b2c5f", margin: 0, direction: "rtl", fontFamily: "Segoe UI, Arial" }}>کمپیوٹر کورس مکمل پلے لسٹ 🎥</h2>
          </div>
          
          <p style={{ fontSize: "18px", marginBottom: "20px", lineHeight: "1.6", color: "#333" }}>
            <strong>English:</strong> Click the top-right corner icon inside the video box below to view all uploaded and completed classes of Batch 02 in sequence!
            <br />
            <span style={{ display: "block", marginTop: "8px", color: "#664d03" }}>
              <strong>Urdu:</strong> پچھلی تمام کلاسز اور نئی ویڈیوز دیکھنے کے لیے نیچے پلے لسٹ پلیئر کا استعمال کریں۔ تمام ویڈیوز ترتیب وار یہاں موجود رہیں گی۔
            </span>
          </p>

          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "15px" }}>
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PL7-zXwiLK4QpTLwRwytLdvhBJplS1lnhA"
              title="HMT Computer Course Batch 2 Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
        </div>

        {/* EXPANDED DOWNLOAD & SUBMISSION DASHBOARD */}
        <div
          style={{
            background: "#e8fff1",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0b2c5f", marginBottom: "5px", textAlign: "center" }}>🎁 Course Download & Submission Center</h2>
          <h3 style={{ color: "#155724", margin: "0 0 20px 0", textAlign: "center", direction: "rtl", fontFamily: "Segoe UI, Arial" }}>ڈاؤن لوڈز اور ہوم ورک جمع کرنے کا مین پورٹل 🎁</h3>
          
          {/* Grid Container for Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "10px"
            }}
          >
            {/* ⭐ NEW: PROFESSIONAL STUDENT PORTAL ACCESS BUTTON */}
            <Link
              href="/portal"
              style={{
                background: "#0d6efd",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                textAlign: "center",
                border: "2px solid #0056b3"
              }}
            >
              <span style={{ display: "block" }}>🔑 Go to Student Portal / Login</span>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "normal", marginTop: "3px", direction: "rtl" }}>
                لاگ ان کر کے 30 منٹ کلاس مکمل کریں
              </span>
            </Link>

            {/* 1. PRACTICE FILES */}
            <a
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#28a745",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 12 rgba(40, 167, 69, 0.2)",
                textAlign: "center"
              }}
            >
              <span style={{ display: "block" }}>📥 Daily Practice Files</span>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "normal", marginTop: "3px", direction: "rtl" }}>
                روزانہ کی پریکٹس فائلز
              </span>
            </a>

            {/* 2. SUBMIT HOMEWORK */}
            <a
              href={googleFormSubmissionLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#6c757d", // Changed to gray since main actions are portal/files
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(108, 117, 125, 0.2)",
                textAlign: "center"
              }}
            >
              <span style={{ display: "block" }}>📤 Submit Homework Here</span>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "normal", marginTop: "3px", direction: "rtl" }}>
                اپنا ہوم ورک جمع کروائیں
              </span>
            </a>

            {/* 3. CV TEMPLATE */}
            <a
              href={cvTemplateLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#6f42c1",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(111, 66, 193, 0.2)",
                textAlign: "center"
              }}
            >
              <span style={{ display: "block" }}>📄 CV Template (Word File)</span>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "normal", marginTop: "3px", direction: "rtl" }}>
                پیشہ ورانہ سی وی ٹیمپلیٹ
              </span>
            </a>

            {/* 4. OFFICE 2021 INSTALLER */}
            <a
              href={office2021Link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#fd7e14",
                color: "white",
                padding: "15px 20px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(253, 126, 20, 0.2)",
                textAlign: "center"
              }}
            >
              <span style={{ display: "block" }}>💿 Microsoft Office 2021</span>
              <span style={{ display: "block", fontSize: "12px", fontWeight: "normal", marginTop: "3px", direction: "rtl" }}>
                آفس 2021 سافٹ ویئر ڈاؤن لوڈ
              </span>
            </a>
          </div>
        </div>

        {/* WHAT YOU WILL LEARN */}
        <div
          style={{
            background: "#eef4ff",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            <h2 style={{ color: "#0b2c5f", margin: 0 }}>📚 What You Will Learn</h2>
            <h2 style={{ color: "#0b2c5f", margin: 0, direction: "rtl", fontFamily: "Segoe UI, Arial" }}>آپ اس کورس میں کیا سیکھیں گے؟ 📚</h2>
          </div>

          <ul style={{ fontSize: "20px", lineHeight: "2", paddingLeft: "20px", color: "#1e3a63" }}>
            <li><strong>Computer Basics</strong> (کمپیوٹر کی بنیادی معلومات)</li>
            <li><strong>MS Word Typing</strong> (ایم ایس ورڈ پر ٹائپنگ کرنا)</li>
            <li><strong>MS Excel Work</strong> (ایم ایس ایکسل پر کام کرنا)</li>
            <li><strong>PowerPoint Presentations</strong> (پاورپوائنٹ پریزنٹیشن بنانا)</li>
            <li><strong>Professional CV Making</strong> (موبائل اور کمپیوٹر پر سی وی بنانا)</li>
            <li><strong>Office Work Skills</strong> (دفاتر میں استعمال ہونے والی مہارتیں)</li>
            <li><strong>Internet Basics & Email</strong> (انٹرنیٹ اور ای میل کا استعمال)</li>
            <li><strong>Practical Projects</strong> (عملی طور پر کام سیکھنا)</li>
          </ul>
        </div>

        {/* WHATSAPP BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <a
            href={whatsappChannelLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25D366",
              color: "white",
              padding: "18px 35px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "22px",
              display: "inline-block",
              boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
              textAlign: "center"
            }}
          >
            <span style={{ display: "block" }}>💬 Connected on WhatsApp Channel</span>
            <span style={{ display: "block", fontSize: "16px", fontWeight: "normal", marginTop: "5px", direction: "rtl" }}>
              روزانہ کلاس الرٹس حاصل کرنے کے لیے واٹس ایپ چینل وزٹ کریں
            </span>
          </a>
        </div>

        {/* NEXT COURSE */}
        <div
          style={{
            background: "#0b2c5f",
            color: "white",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "5px" }}>🤖 UPCOMING COURSE</h2>
          <h3 style={{ color: "#ffc107", margin: "0 0 15px 0", direction: "rtl", fontFamily: "Segoe UI, Arial" }}>اگلا آنے والا بڑا کورس: آرٹیفیشل انٹیلیجنس (AI) 🤖</h3>
          
          <p style={{ fontSize: "20px", lineHeight: "1.8" }}>
            <strong>Artificial Intelligence (AI) Mastery</strong>
            <br />
            ChatGPT • Advanced AI Tools • AI Video Editing & Production
            <br />
            <span style={{ color: "#ffc107", fontWeight: "bold" }}>Launching Immediately After This Batch!</span>
          </p>
        </div>
      </div>
    </div>
  );
}