import { NextResponse } from "next/server";

const HMT_SYSTEM_PROMPT = `You are HMT AI Assistant (ایچ ایم ٹی اے آئی اسسٹنٹ), the official virtual study tutor and support assistant for HMT Success Academy & HMT Financial Services, founded by Muhammad Tufail.

Core Language & Script Adaptation Rules:
1. SCRIPT MATCHING:
   - If the user asks in Urdu Script (e.g. "ایٹیا کا میرٹ فارمولا کیا ہے؟" or "ایکسل میں VLOOKUP کیسے استعمال کریں؟"), you MUST reply in natural, accurate Urdu script (اردو).
   - If the user asks in Roman Urdu or Pashto (e.g. "ETEA PST merit aggregate kaise calculate karein?" or "CV builder free hai kya?"), reply in easy, natural Roman Urdu.
   - If the user asks in English, reply in English.
2. Tone & Identity:
   - Always be polite, respectful (use "Assalam o Alaikum" / "السلام علیکم"), encouraging, and direct.
3. FOUNDER PROFILE & LOCATION RULES:
   - In general intros or website descriptions for HMT Success Academy and HMT Financial Services, state only the founder's name "Muhammad Tufail" without mentioning any district.
   - IF someone explicitly asks about Muhammad Tufail's background, origin, or current location, explain: Muhammad Tufail is originally from District Buner, KP, and is currently living in Lahore.
4. DIRECT PAGE LINKS & NAVIGATION (Always provide clickable links):
   - Student Portal: [Student Portal](/portal)
   - Live Computer Course: [Computer Course Portal](/computer-course)
   - ATS CV Builder: [Free ATS CV Builder](/cv-builder)
   - ETEA Merit Calculator: [ETEA Merit Calculator](/merit-calculator)
   - Solved Past Papers: [Past Papers Hub](/past-papers)
   - Daily MCQ Quiz: [Daily MCQ Quiz](/daily-quiz)
   - Roll No Slips: [Roll No Slip Finder](/rollno-slips)
   - Certificate Verification: [Verification Portal](/verify)
   - WhatsApp Groups: [WhatsApp Study Groups](/whatsapp-groups)
5. Format: Use clean bullet points, code blocks for formulas, and clear headings.`;

export async function POST(req) {
  try {
    const { messages, userMessage } = await req.json();

    const promptText = userMessage || (messages && messages[messages.length - 1]?.content) || "";

    if (!promptText.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // Always ensure a valid Gemini API key (with base64 fallback so it never fails on any host)
    const base64Key = "QVEuQWI4Uk42SVlTWU1MU1NBMkt1Y3YyUm5xTUZ2ZGlPeGVUN2FpUWpud0tPR0NvWUY5UkE=";
    const fallbackKey = Buffer.from(base64Key, "base64").toString("utf-8");
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || fallbackKey;

    if (apiKey) {
      const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash"];
      
      for (const model of modelsToTry) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          
          const contentsPayload = [
            {
              role: "user",
              parts: [{ text: `${HMT_SYSTEM_PROMPT}\n\nUser Query: ${promptText}` }],
            },
          ];

          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: contentsPayload }),
          });

          if (res.ok) {
            const data = await res.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiResponse) {
              return NextResponse.json({ reply: aiResponse });
            }
          }
        } catch (e) {
          console.warn(`Gemini model ${model} call failed, trying next:`, e);
        }
      }
    }

    // Smart Knowledge Engine (Urdu + Roman Urdu + English)
    const lower = promptText.toLowerCase();
    const isUrduScript = /[\u0600-\u06FF]/.test(promptText);
    let reply = "";

    // 0. SPECIFIC FOUNDER INQUIRY
    if (lower.includes("buner") || lower.includes("lahore") || lower.match(/\b(tufail kon|who is tufail|tufail background|tufail location|tufail address|طفیل کون|ضلع بنیر|بونیر)\b/i)) {
      if (isUrduScript) {
        reply = `👤 **محمد طفیل کا تعارف:**\n\n- **بانی**: محمد طفیل HMT Success Academy اور HMT Financial & Digital Services کے بانی ہیں۔\n- **آبائی علاقہ**: ان کا تعلق اصل میں **ضلع بنیر (خیبر پختونخوا)** سے ہے۔\n- **موجودہ رہائش**: وہ اس وقت **لاہور** میں مقیم ہیں۔\n- **رابطہ**: آپ واٹس ایپ +92 342 2981356 پر براہ راست رابطہ کر سکتے ہیں۔`;
      } else {
        reply = `👤 **Muhammad Tufail Profile:**\n\n- **Founder**: Muhammad Tufail is the founder of HMT Success Academy and HMT Financial & Digital Services.\n- **Hometown**: He is originally from **District Buner, KP**.\n- **Current Residence**: He is currently living in **Lahore**.\n- **Official WhatsApp**: +92 342 2981356`;
      }
    }
    // 1. ATS CV BUILDER & RESUME (Match specific CV link requests first)
    else if (lower.includes("cv") || lower.includes("resume") || lower.includes("سی وی") || lower.includes("رزومے")) {
      if (isUrduScript) {
        reply = `📄 **مفت ATS سی وی بلڈر کا ڈائریکٹ لنک:**\n\n- **[Free ATS CV Builder](/cv-builder)** پیج پر جائیں۔\n- اپنی کوالیفکیشن اور تجربہ درج کریں اور صرف ایک کلک میں A4 PDF سی وی ڈاؤن لوڈ کریں۔\n- یہ ETEA، بینک، پولیس اور پرائیویٹ جابز کے لیے 100% مفت ہے!`;
      } else {
        reply = `📄 **Free ATS CV Builder Direct Link:**\n\n- Visit our **[Free ATS CV Builder](/cv-builder)** page.\n- Fill in your details and download an A4 PDF job resume in seconds!\n- 100% free for all ETEA, KPPSC, and Bank applications.`;
      }
    }
    // 2. ETEA MERIT CALCULATOR
    else if (lower.includes("merit") || lower.includes("aggregate") || lower.includes("میرٹ") || lower.includes("calculator")) {
      if (isUrduScript) {
        reply = `📚 **ETEA KP میرٹ کیلکولیٹر کا ڈائریکٹ لنک:**\n\n- **[ETEA Merit Calculator](/merit-calculator)** پیج پر جائیں۔\n- ETEA ٹیسٹ (50%)، FSc (15%)، گریجویشن (15%)، میٹرک (10%) اور B.Ed/CT (10%) درج کر کے 100 میں سے اپنا مکمل میرٹ آن لائن معلوم کریں۔`;
      } else {
        reply = `📚 **ETEA Merit Calculator Direct Link:**\n\n- Visit our **[ETEA Merit Calculator](/merit-calculator)** page.\n- Calculate your aggregate score out of 100 for ETEA PST, CT, SST, and KPPSC posts instantly!`;
      }
    }
    // 3. ROLL NO SLIPS & EXAM CENTERS
    else if (lower.includes("roll no") || lower.includes("slip") || lower.includes("رول نمبر") || lower.includes("سلپ")) {
      if (isUrduScript) {
        reply = `📇 **رول نمبر سلپ کا ڈائریکٹ لنک:**\n\n- **[Roll No Slip Finder](/rollno-slips)** پیج پر جائیں۔\n- اپنا ٹیسٹنگ ایجنسی (ETEA, KPPSC, FPSC) منتخب کریں اور CNIC نمبر درج کر کے سلپ ڈاؤن لوڈ کریں۔`;
      } else {
        reply = `📇 **Roll Number Slip Direct Link:**\n\n- Visit our **[Roll No Slip Finder](/rollno-slips)** page.\n- Select your testing agency and enter your 13-digit CNIC to download your roll number slip directly.`;
      }
    }
    // 4. PAST PAPERS & QUIZ
    else if (lower.includes("paper") || lower.includes("past") || lower.includes("پاسٹ") || lower.includes("پیپر") || lower.includes("quiz") || lower.includes("mcq")) {
      if (isUrduScript) {
        reply = `📖 **پاسٹ پیپرز اور کوئز کے لنکس:**\n\n- **[Solved Past Papers Hub](/past-papers)**\n- **[Daily MCQ Quiz](/daily-quiz)**`;
      } else {
        reply = `📖 **Past Papers & Quiz Direct Links:**\n\n- **[Solved Past Papers Hub](/past-papers)**\n- **[Daily MCQ Quiz Portal](/daily-quiz)**`;
      }
    }
    // 5. COMPUTER COURSE & EXCEL / WORD
    else if (lower.includes("course") || lower.includes("vlookup") || lower.includes("excel") || lower.includes("word") || lower.includes("ایکسل") || lower.includes("ورڈ") || lower.includes("کورس")) {
      if (isUrduScript) {
        reply = `💻 **کمپیوٹر کورس کا ڈائریکٹ لنک:**\n\n- **[Live Computer Course](/computer-course)** پیج پر جائیں اور تمام ایکسل، ورڈ، اور ٹائپنگ ٹیوٹوریل سیکھیں۔`;
      } else {
        reply = `💻 **Computer Course Direct Link:**\n\n- Visit our **[Live Computer Course Portal](/computer-course)** to master Excel formulas (VLOOKUP, XLOOKUP), MS Word, and DIT modules.`;
      }
    }
    // 6. WHATSAPP & CONTACT
    else if (lower.includes("whatsapp") || lower.includes("group") || lower.includes("tufail") || lower.includes("contact") || lower.includes("واٹس ایپ") || lower.includes("رابطہ")) {
      reply = `💬 **WhatsApp Groups & Contact:**\n\n- Join official study groups on **[WhatsApp Groups Hub](/whatsapp-groups)**!\n- Contact Instructor **Muhammad Tufail**: +92 342 2981356`;
    }
    // 7. GENERAL PORTAL LINKS / ALL LINKS
    else if (lower.includes("portal") || lower.includes("link") || lower.includes("پورٹل") || lower.includes("لنک") || lower.includes("website") || lower.includes("url")) {
      if (isUrduScript) {
        reply = `🌐 **HMT Success Academy پورٹل کے تمام اہم لنکس:**\n\n- 📄 **مفت ATS سی وی بلڈر**: **[Free ATS CV Builder](/cv-builder)**\n- 🎓 **اسٹوڈنٹ پورٹل**: **[Student Portal](/portal)**\n- 📊 **ایٹیا میرٹ کیلکولیٹر**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📖 **حل شدہ پاسٹ پیپرز**: **[Past Papers Hub](/past-papers)**\n- 💻 **کمپیوٹر کورس**: **[Live Computer Course](/computer-course)**\n- 📇 **رول نمبر سلپ**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **روزانہ ایم سی کیوز کوئز**: **[Daily MCQ Quiz](/daily-quiz)**\n- 💬 **واٹس ایپ گروپس**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      } else {
        reply = `🌐 **HMT Success Academy All Portal Links:**\n\n- 📄 **Free ATS CV Builder**: **[Free ATS CV Builder](/cv-builder)**\n- 🎓 **Student Portal**: **[HMT Student Portal](/portal)**\n- 📊 **ETEA Merit Calculator**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📖 **Solved Past Papers**: **[Past Papers Hub](/past-papers)**\n- 💻 **Computer Course**: **[Live Computer Course Portal](/computer-course)**\n- 📇 **Roll No Slips**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **Daily MCQ Quiz**: **[Daily MCQ Quiz Portal](/daily-quiz)**\n- 💬 **WhatsApp Groups**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      }
    }
    // 8. IDENTITY & WHO ARE YOU
    else if (lower.match(/\b(aap kon|kon ho|who are you|tum kon|ap kon|who r u|naam kya|your name|کون ہو|آپ کون)\b/i)) {
      if (isUrduScript) {
        reply = `🤖 **میں HMT AI اسسٹنٹ (ایچ ایم ٹی اے آئی اسسٹنٹ) ہوں۔**\n\nمیں HMT Success Academy اور HMT Financial Services کا آفیشل ورچوئل ٹیوشن اسسٹنٹ ہوں، جسے **محمد طفیل** نے قائم کیا ہے۔\n\nمیں آپ کی درج ذیل تمام امور میں 100% مفت رہنمائی کر سکتا ہوں:\n- 📚 **ETEA KP اور KPPSC امتحانات کی تیاری**\n- 📊 **مائیکروسافٹ ایکسل (VLOOKUP) اور ورڈ**\n- 📄 **مفت ATS سی وی اور رول نمبر سلپ**\n\nآپ مجھ سے کوئی بھی سوال پوچھ سکتے ہیں!`;
      } else {
        reply = `🤖 **Main HMT AI Assistant (ایچ ایم ٹی اے آئی اسسٹنٹ) hoon!**\n\nMain HMT Success Academy aur HMT Financial Services ka official virtual study tutor hoon, founded by **Muhammad Tufail**.\n\nMain aap ki in tamam cheezon mein 100% free madad kar sakta hoon:\n- 📚 **ETEA KP (PST, CT, SST) & KPPSC Merit Calculator**\n- 📊 **MS Excel Formulas (VLOOKUP, XLOOKUP) & Word**\n- 📄 **Free ATS CV Builder & Roll No Slips Download**\n\nAap Roman Urdu, Urdu Script ya English mein koi bhi sawal pooch saktay hain!`;
      }
    }
    // 9. GREETINGS & INTRODUCTIONS
    else if (lower.match(/\b(hi|hello|hey|aoa|assalam|salam|سلام|السلام|کیسے|حال|kaise ho|kya haal)\b/)) {
      if (isUrduScript) {
        reply = `و علیکم السلام! 👋\n\nمیں **HMT AI اسسٹنٹ** ہوں۔ میں آپ کی ایٹیا (ETEA) امتحانات، مائیکروسافٹ ایکسل، ورڈ، اور ایچ ایم ٹی کی تمام خدمات میں بہترین رہنمائی کر سکتا ہوں۔\n\nآپ مجھ سے کیا پوچھنا چاہتے ہیں؟`;
      } else {
        reply = `Walaikum Assalam! 👋\n\nMain **HMT AI Assistant** hoon. Main ETEA test preparation, MS Excel formulas, ATS CV building aur KPPSC exam guidance mein aap ki poori madad kar sakta hoon.\n\nAap kis baaray mein poochna chahtay hain?`;
      }
    }
    // 10. GENERAL HELP & DEFAULT RESPONDER
    else {
      if (isUrduScript) {
        reply = `🌐 **HMT Success Academy پورٹل لنکس:**\n\n- 📄 **مفت ATS سی وی بلڈر**: **[Free ATS CV Builder](/cv-builder)**\n- 🎓 **اسٹوڈنت پورٹل**: **[Student Portal](/portal)**\n- 📊 **ایٹیا میرٹ کیلکولیٹر**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📖 **حل شدہ پاسٹ پیپرز**: **[Past Papers Hub](/past-papers)**\n- 💻 **کمپیوٹر کورس**: **[Live Computer Course](/computer-course)**\n- 📇 **رول نمبر سلپ**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **روزانہ ایم سی کیوز کوئز**: **[Daily MCQ Quiz](/daily-quiz)**\n- 💬 **واٹس ایپ گروپس**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      } else {
        reply = `🌐 **HMT Success Academy Direct Portal Links:**\n\n- 📄 **Free ATS CV Builder**: **[Free ATS CV Builder](/cv-builder)**\n- 🎓 **Student Portal**: **[HMT Student Portal](/portal)**\n- 📊 **ETEA Merit Calculator**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📖 **Solved Past Papers**: **[Past Papers Hub](/past-papers)**\n- 💻 **Computer Course**: **[Live Computer Course Portal](/computer-course)**\n- 📇 **Roll No Slips**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **Daily MCQ Quiz**: **[Daily MCQ Quiz Portal](/daily-quiz)**\n- 💬 **WhatsApp Groups**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}



