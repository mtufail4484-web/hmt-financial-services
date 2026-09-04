import { NextResponse } from "next/server";

const HMT_SYSTEM_PROMPT = `You are HMT AI Assistant (ایچ ایم ٹی اے آئی اسسٹنٹ), the official virtual study tutor and support assistant for HMT Success Academy & HMT Financial Services, hosted by Muhammad Tufail in Peshawar, KP, Pakistan.

Core Language & Script Adaptation Rules:
1. SCRIPT MATCHING:
   - If the user asks in Urdu Script (e.g. "ایٹیا کا میرٹ فارمولا کیا ہے؟" or "ایکسل میں VLOOKUP کیسے استعمال کریں؟"), you MUST reply in natural, accurate Urdu script (اردو).
   - If the user asks in Roman Urdu or Pashto (e.g. "ETEA PST merit aggregate kaise calculate karein?" or "CV builder free hai kya?"), reply in easy, natural Roman Urdu.
   - If the user asks in English, reply in English.
2. Tone & Identity:
   - Always be polite, respectful (use "Assalam o Alaikum" / "السلام علیکم"), encouraging, and direct.
3. Expertise & Knowledge Scope:
   - Competitive Exams: ETEA KP (PST 50% test weightage, CT, SST, Police Constable), KPPSC (Computer Operator, Tehsildar), FPSC, PPSC, NTS.
   - MS Office & IT Skills: Excel formulas (VLOOKUP, XLOOKUP, IF, SUMIF, Pivot Tables), Word formatting, DIT Diploma, Typing skills.
   - HMT Direct Services & Tools:
     * Free ATS CV Builder (/cv-builder)
     * ETEA Merit Aggregate Calculator (/merit-calculator)
     * Roll No Slip Finder (/rollno-slips)
     * Daily MCQ Quiz (/daily-quiz)
     * Solved Past Papers Hub (/past-papers)
     * WhatsApp Study Groups (/whatsapp-groups)
     * Verification Portal (/verify)
4. Format: Use clean bullet points, code blocks for formulas, and clear headings.`;

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

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      // Call Google Gemini 1.5 Flash API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
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
        const aiResponse =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "السلام علیکم! I am HMT AI Assistant. How can I assist you with ETEA preparation or computer courses today?";
        return NextResponse.json({ reply: aiResponse });
      }
    }

    // Smart Built-in Fallback Knowledge Engine (Urdu + Roman Urdu + English)
    const lower = promptText.toLowerCase();
    let fallbackReply = "";

    const isUrduScript = /[\u0600-\u06FF]/.test(promptText);

    if (lower.includes("vlookup") || lower.includes("xlookup") || lower.includes("excel") || lower.includes("ایکسل") || lower.includes("فارمولا")) {
      if (isUrduScript) {
        fallbackReply = `📊 **مائیکروسافٹ ایکسل گائیڈ (Excel Guide):**\n\n- **VLOOKUP فارمولا**: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n- **مثال**: \`=VLOOKUP(A2, Sheet1!A1:D100, 2, FALSE)\` یہ سیل A2 کی ویلیو کو تلاش کر کے دوسرا کالم دکھائے گا۔\n- **مفت کورس**: آپ HMT کے لائیو کمپیوٹر کورس میں مزید ایکسل فارمولے سیکھ سکتے ہیں۔`;
      } else {
        fallbackReply = `📊 **Microsoft Excel Formula Guide:**\n\n- **VLOOKUP Syntax**: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n- **Roman Urdu Tip**: VLOOKUP se aap kisi bhi ID ya naam ka data doosray table se minute mein search kar saktay hain.\n- **Example**: \`=VLOOKUP(A2, Sheet1!A1:D100, 2, FALSE)\`\n- Master Excel in our **[HMT Computer Course](/computer-course)**!`;
      }
    } else if (lower.includes("pst") || lower.includes("ct") || lower.includes("etea") || lower.includes("ایٹیا") || lower.includes("میرٹ") || lower.includes("aggregate")) {
      if (isUrduScript) {
        fallbackReply = `📚 **ETEA KP میرٹ فارمولا گائیڈ:**\n\n- **ایٹیا ٹیسٹ**: 50% مارکس\n- **ایف ایس سی (FSc)**: 15% مارکس\n- **بی ایس / بی اے (Graduation)**: 15% مارکس\n- **میٹرک (Matric)**: 10% مارکس\n- **بی ایڈ / سی ٹی (B.Ed/CT)**: 10% مارکس\n\nاپنا مکمل میرٹ 100 میں سے حساب کرنے کے لیے ہمارے **[ETEA Merit Calculator](/merit-calculator)** کا استعمال کریں۔`;
      } else {
        fallbackReply = `📚 **ETEA KP Recruitment & Merit Guide:**\n\n- **Selection Weightage**: ETEA Test (50%), FSc (15%), Graduation (15%), B.Ed/CT (10%), Matric (10%).\n- Roman Urdu: Aap apna exact aggregate 100 mein se hamare **[ETEA Merit Calculator](/merit-calculator)** par 1 minute mein calculate kar saktay hain!\n- ETEA Solved Past Papers ke liye **[Past Papers Hub](/past-papers)** check karein.`;
      }
    } else if (lower.includes("cv") || lower.includes("resume") || lower.includes("سی وی") || lower.includes("رزومے")) {
      if (isUrduScript) {
        fallbackReply = `📄 **مفت ATS سی وی بلڈر (Free CV Builder):**\n\n- ہمارے **[Free ATS CV Builder](/cv-builder)** پیج پر جائیں۔\n- اپنی معلومات درج کریں اور صرف ایک کلک میں پروفیشنل A4 PDF سی وی ڈاؤن لوڈ کریں۔\n- یہ ETEA اور جاب اپلائی کے لیے 100% مفت ہے۔`;
      } else {
        fallbackReply = `📄 **HMT Free ATS CV Builder:**\n\n- Roman Urdu: Hamara CV Builder bilkul free hai! Bas **[Free ATS CV Builder](/cv-builder)** page par jayein, apni detail fill karein aur A4 PDF download karein.\n- Best for ETEA, Police, Bank and Computer Operator job applications!`;
      }
    } else if (lower.includes("roll no") || lower.includes("slip") || lower.includes("رول نمبر") || lower.includes("سلپ")) {
      if (isUrduScript) {
        fallbackReply = `📇 **رول نمبر سلپ ڈاؤن لوڈ گائیڈ:**\n\n- ہمارے **[Roll No Slip Finder](/rollno-slips)** پر جائیں۔\n- اپنا ٹیسٹنگ ایجنسی (ETEA, KPPSC, FPSC) منتخب کریں اور CNIC نمبر درج کر کے سلپ ڈاؤن لوڈ کریں۔`;
      } else {
        fallbackReply = `📇 **Roll Number Slip Download Guide:**\n\n- Visit our **[Roll No Slip Finder](/rollno-slips)** page.\n- Select ETEA / KPPSC / FPSC / NTS and enter your 13-digit CNIC to download your roll number slip directly.`;
      }
    } else if (lower.includes("tufail") || lower.includes("contact") || lower.includes("whatsapp") || lower.includes("طفیل") || lower.includes("رابطہ")) {
      fallbackReply = `💬 **HMT Success Academy Contact Details:**\n\n- **Founder & Instructor**: Muhammad Tufail (Peshawar, KP)\n- **Official WhatsApp**: +92 342 2981356\n- Join student groups on **[WhatsApp Groups Hub](/whatsapp-groups)**!`;
    } else {
      if (isUrduScript) {
        fallbackReply = `🤖 **السلام علیکم! میں HMT AI اسسٹنٹ ہوں۔**\n\nمیں آپ کی درج ذیل تمام امور میں مدد کر سکتا ہوں:\n1. 📊 **مائیکروسافٹ ایکسل اور ورڈ کے فارمولے**\n2. 📚 **ETEA PST، CT اور KPPSC میرٹ فارمولا**\n3. 📄 **مفت ATS سی وی اور رول نمبر سلپ**\n4. 🎓 **HMT کمپیوٹر کورس اور پاسٹ پیپرز**\n\nآپ اپنا سوال اردو یا انگلش میں پوچھ سکتے ہیں!`;
      } else {
        fallbackReply = `🤖 **Assalam o Alaikum! I am HMT AI Assistant.**\n\nI speak **English, Roman Urdu, and Urdu Script (اردو)**!\n\nI can help you with:\n1. 📊 **MS Excel & Word Tutorials** (VLOOKUP, formatting, typing)\n2. 📚 **ETEA & KPPSC Merit Calculator** (PST, CT, Computer Operator)\n3. 📄 **Free ATS CV Builder & Roll No Slips**\n4. 🎓 **HMT Computer Course & Past Papers**\n\nPlease ask your question in any language!`;
      }
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error) {
    console.error("AI Tutor API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}

