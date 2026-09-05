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
    // 1. PORTAL LINKS & DIRECT URL REQUESTS
    else if (lower.includes("portal") || lower.includes("link") || lower.includes("پورٹل") || lower.includes("لنک") || lower.includes("website") || lower.includes("url")) {
      if (isUrduScript) {
        reply = `🌐 **HMT Success Academy پورٹل کے اہم لنکس:**\n\n- 🎓 **اسٹوڈنٹ پورٹل**: **[Student Portal](/portal)**\n- 📊 **ایٹیا میرٹ کیلکولیٹر**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📄 **مفت ATS سی وی بلڈر**: **[Free ATS CV Builder](/cv-builder)**\n- 📖 **حل شدہ پاسٹ پیپرز**: **[Past Papers Hub](/past-papers)**\n- 💻 **کمپیوٹر کورس**: **[Live Computer Course](/computer-course)**\n- 📇 **رول نمبر سلپ**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **روزانہ ایم سی کیوز کوئز**: **[Daily MCQ Quiz](/daily-quiz)**\n- 💬 **واٹس ایپ گروپس**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      } else {
        reply = `🌐 **HMT Success Academy Direct Portal Links:**\n\n- 🎓 **Student Portal**: **[HMT Student Portal](/portal)**\n- 📊 **ETEA Merit Calculator**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📄 **Free ATS CV Builder**: **[Free ATS CV Builder](/cv-builder)**\n- 📖 **Solved Past Papers**: **[Past Papers Hub](/past-papers)**\n- 💻 **Computer Course**: **[Live Computer Course Portal](/computer-course)**\n- 📇 **Roll No Slips**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **Daily MCQ Quiz**: **[Daily MCQ Quiz Portal](/daily-quiz)**\n- 💬 **WhatsApp Groups**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      }
    }
    // 2. IDENTITY & WHO ARE YOU
    else if (lower.match(/\b(aap kon|kon ho|who are you|tum kon|ap kon|who r u|naam kya|your name|کون ہو|آپ کون)\b/i)) {
      if (isUrduScript) {
        reply = `🤖 **میں HMT AI اسسٹنٹ (ایچ ایم ٹی اے آئی اسسٹنٹ) ہوں۔**\n\nمیں HMT Success Academy اور HMT Financial Services کا آفیشل ورچوئل ٹیوشن اسسٹنٹ ہوں، جسے **محمد طفیل** نے قائم کیا ہے۔\n\nمیں آپ کی درج ذیل تمام امور میں 100% مفت رہنمائی کر سکتا ہوں:\n- 📚 **ETEA KP اور KPPSC امتحانات کی تیاری**\n- 📊 **مائیکروسافٹ ایکسل (VLOOKUP) اور ورڈ**\n- 📄 **مفت ATS سی وی اور رول نمبر سلپ**\n\nآپ مجھ سے کوئی بھی سوال پوچھ سکتے ہیں!`;
      } else {
        reply = `🤖 **Main HMT AI Assistant (ایچ ایم ٹی اے آئی اسسٹنٹ) hoon!**\n\nMain HMT Success Academy aur HMT Financial Services ka official virtual study tutor hoon, founded by **Muhammad Tufail**.\n\nMain aap ki in tamam cheezon mein 100% free madad kar sakta hoon:\n- 📚 **ETEA KP (PST, CT, SST) & KPPSC Merit Calculator**\n- 📊 **MS Excel Formulas (VLOOKUP, XLOOKUP) & Word**\n- 📄 **Free ATS CV Builder & Roll No Slips Download**\n\nAap Roman Urdu, Urdu Script ya English mein koi bhi sawal pooch saktay hain!`;
      }
    }
    // 3. GREETINGS & INTRODUCTIONS
    else if (lower.match(/\b(hi|hello|hey|aoa|assalam|salam|سلام|السلام|کیسے|حال|kaise ho|kya haal)\b/)) {
      if (isUrduScript) {
        reply = `و علیکم السلام! 👋\n\nمیں **HMT AI اسسٹنٹ** ہوں۔ میں آپ کی ایٹیا (ETEA) امتحانات، مائیکروسافٹ ایکسل، ورڈ، اور ایچ ایم ٹی کی تمام خدمات میں بہترین رہنمائی کر سکتا ہوں۔\n\nآپ مجھ سے کیا پوچھنا چاہتے ہیں؟`;
      } else {
        reply = `Walaikum Assalam! 👋\n\nMain **HMT AI Assistant** hoon. Main ETEA test preparation, MS Excel formulas, ATS CV building aur KPPSC exam guidance mein aap ki poori madad kar sakta hoon.\n\nAap kis baaray mein poochna chahtay hain?`;
      }
    }
    // 4. EXCEL & SPREADSHEETS
    else if (lower.includes("vlookup") || lower.includes("xlookup") || lower.includes("excel") || lower.includes("ایکسل") || lower.includes("فارمولا") || lower.includes("formula") || lower.includes("sumif") || lower.includes("pivot")) {
      if (isUrduScript) {
        reply = `📊 **مائیکروسافٹ ایکسل گائیڈ:**\n\n- **VLOOKUP فارمولا**: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n- **XLOOKUP فارمولا**: \`=XLOOKUP(lookup_value, lookup_array, return_array)\` (ایکسل کا جدید ترین فارمولا)\n- **مثال**: \`=VLOOKUP(A2, Sheet1!A1:D100, 2, FALSE)\` سے آپ کسی بھی رول نمبر کا نام تلاش کر سکتے ہیں۔\n- مزید تفصیلات کے لیے **[HMT live Computer Course](/computer-course)** دیکھیں۔`;
      } else {
        reply = `📊 **Microsoft Excel Formula Guide:**\n\n- **VLOOKUP Syntax**: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n- **XLOOKUP (Modern)**: \`=XLOOKUP(lookup_value, lookup_array, return_array)\`\n- **Roman Urdu Tip**: VLOOKUP se aap kisi bhi ID ya Roll No ka data doosray sheet se ek second mein find kar saktay hain.\n- Learn full MS Office on our **[Computer Course Portal](/computer-course)**!`;
      }
    }
    // 5. MS WORD & TYPING & SHORTCUTS
    else if (lower.includes("word") || lower.includes("ورڈ") || lower.includes("shortcut") || lower.includes("typing") || lower.includes("ٹائپنگ") || lower.includes("dit")) {
      if (isUrduScript) {
        reply = `💻 **ایم ایس ورڈ اور ڈی آئی ٹی (DIT) ٹپس:**\n\n- **اہم شارٹ کٹس**:\n  - Ctrl + C = کاپی\n  - Ctrl + V = پیسٹ\n  - Ctrl + Z = ان ڈو (Undo)\n  - Ctrl + A = تمام ٹیکسٹ سلیکٹ کرنا\n- **DIT ڈپلوما**: ڈی آئی ٹی میں MS Word, MS Excel, Access, C++, HTML شامل ہوتے ہیں۔\n- مزید شارٹ کٹس **[کمپیوٹر کورس](/computer-course)** پر دیکھیں۔`;
      } else {
        reply = `💻 **MS Word & Typing Shortcuts:**\n\n- **Essential Shortcuts**:\n  - \`Ctrl + C\`: Copy | \`Ctrl + V\`: Paste | \`Ctrl + Z\`: Undo\n  - \`Ctrl + A\`: Select All | \`Ctrl + P\`: Print Document\n- **DIT Diploma**: Covers MS Office, Web Design, C++ & Graphics.\n- Practice typing and formatting on our **[Computer Course Hub](/computer-course)**!`;
      }
    }
    // 6. ETEA PST / CT / SST / MERIT FORMULA
    else if (lower.includes("pst") || lower.includes("ct") || lower.includes("sst") || lower.includes("etea") || lower.includes("ایٹیا") || lower.includes("میرٹ") || lower.includes("aggregate") || lower.includes("formula")) {
      if (isUrduScript) {
        reply = `📚 **ETEA KP تمام پوسٹوں کا میرٹ فارمولا:**\n\n- **ایٹیا تحریری ٹیسٹ**: 50% مارکس\n- **ایف ایس سی (FSc)**: 15% مارکس\n- **بی ایس / گریجویشن**: 15% مارکس\n- **میٹرک (Matric)**: 10% مارکس\n- **بی ایڈ / سی ٹی (B.Ed/CT)**: 10% مارکس\n\nاپنا مکمل میرٹ 100 میں سے خودکار حساب کرنے کے لیے **[ETEA Merit Calculator](/merit-calculator)** استعمال کریں۔`;
      } else {
        reply = `📚 **ETEA KP Merit Aggregate Formula:**\n\n- **ETEA Written Test**: 50%\n- **FSc**: 15%\n- **BS / Graduation**: 15%\n- **Matric**: 10%\n- **B.Ed / Professional**: 10%\n\n- Roman Urdu: Aap apna aggregate 100 mein se hamare **[ETEA Merit Calculator](/merit-calculator)** par 10 seconds mein calculate kar saktay hain!`;
      }
    }
    // 7. PAST PAPERS & SYLLABUS & PREPARATION
    else if (lower.includes("paper") || lower.includes("past") || lower.includes("پاسٹ") || lower.includes("پیپر") || lower.includes("syllabus") || lower.includes("سلیبس") || lower.includes("mcq") || lower.includes("quiz")) {
      if (isUrduScript) {
        reply = `📖 **ایٹیا اور KPPSC پاسٹ پیپرز اور سلیبس:**\n\n- ہمارے پورٹل پر PST, CT, SST اور کمپیوٹر آپریٹر کے حل شدہ پاسٹ پیپرز موجود ہیں۔\n- **روزانہ ایم سی کیوز کوئز**: **[Daily MCQ Quiz](/daily-quiz)** پر حصہ لیں اور اپنی تیاری چیک کریں۔\n- **پاسٹ پیپرز ڈاؤن لوڈ کریں**: **[Past Papers Hub](/past-papers)** وزٹ کریں۔`;
      } else {
        reply = `📖 **ETEA & KPPSC Past Papers & Syllabus:**\n\n- Authentic solved original past papers for PST, CT, SST, and Computer Operator are available.\n- **Daily Quiz**: Practice MCQs daily at **[Daily MCQ Quiz](/daily-quiz)**!\n- **Download Papers**: Visit **[Solved Past Papers Hub](/past-papers)**.`;
      }
    }
    // 8. ATS CV BUILDER & RESUME
    else if (lower.includes("cv") || lower.includes("resume") || lower.includes("سی وی") || lower.includes("رزومے") || lower.includes("job apply")) {
      if (isUrduScript) {
        reply = `📄 **ایچ ایم ٹی فری ATS سی وی بلڈر:**\n\n- **[Free ATS CV Builder](/cv-builder)** پیج پر جائیں۔\n- اپنی کوالیفکیشن اور تجربہ درج کریں اور A4 PDF ڈاؤن لوڈ کریں۔\n- یہ ETEA، بینک، پولیس اور پرائیویٹ جابز کے لیے 100% بہترین اور مفت ہے۔`;
      } else {
        reply = `📄 **Free ATS CV Builder Guide:**\n\n- Roman Urdu: ETEA aur Government jobs ke liye ATS format CV lazmi hoti hai.\n- Visit **[Free ATS CV Builder](/cv-builder)**, fill your info and click Print/Download PDF!\n- 100% Free for all Pakistani students.`;
      }
    }
    // 9. ROLL NO SLIPS & EXAM CENTERS
    else if (lower.includes("roll no") || lower.includes("slip") || lower.includes("رول نمبر") || lower.includes("سلپ") || lower.includes("center")) {
      if (isUrduScript) {
        reply = `📇 **رول نمبر سلپ ڈاؤن لوڈ کریں:**\n\n- **[Roll No Slip Finder](/rollno-slips)** پر جائیں۔\n- ETEA، KPPSC یا FPSC منتخب کریں۔\n- اپنا 13 ہندسوں کا CNIC (بغیر ڈیش کے) درج کریں اور ڈائریکٹ سلپ ڈاؤن لوڈ کریں۔`;
      } else {
        reply = `📇 **Roll Number Slip Direct Finder:**\n\n- Go to **[Roll No Slip Finder](/rollno-slips)**.\n- Select ETEA / KPPSC / FPSC / NTS and enter your CNIC number to get your exam center & roll number slip.`;
      }
    }
    // 10. CONTACT & MUHAMMAD TUFAIL & WHATSAPP
    else if (lower.includes("tufail") || lower.includes("contact") || lower.includes("whatsapp") || lower.includes("طفیل") || lower.includes("رابطہ") || lower.includes("group") || lower.includes("جروب")) {
      reply = `💬 **HMT Success Academy Contact Details:**\n\n- **Founder & Tutor**: Muhammad Tufail\n- **Official WhatsApp**: +92 342 2981356\n- **WhatsApp Groups**: Join student study groups on **[WhatsApp Groups Hub](/whatsapp-groups)**!`;
    }
    // 11. GENERAL HELP & DEFAULT RESPONDER
    else {
      if (isUrduScript) {
        reply = `🌐 **HMT Success Academy پورٹل لنکس:**\n\n- 🎓 **اسٹوڈنٹ پورٹل**: **[Student Portal](/portal)**\n- 📊 **ایٹیا میرٹ کیلکولیٹر**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📄 **مفت ATS سی وی بلڈر**: **[Free ATS CV Builder](/cv-builder)**\n- 📖 **حل شدہ پاسٹ پیپرز**: **[Past Papers Hub](/past-papers)**\n- 💻 **کمپیوٹر کورس**: **[Live Computer Course](/computer-course)**\n- 📇 **رول نمبر سلپ**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **روزانہ ایم سی کیوز کوئز**: **[Daily MCQ Quiz](/daily-quiz)**\n- 💬 **واٹس ایپ گروپس**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
      } else {
        reply = `🌐 **HMT Success Academy Direct Portal Links:**\n\n- 🎓 **Student Portal**: **[HMT Student Portal](/portal)**\n- 📊 **ETEA Merit Calculator**: **[ETEA Merit Calculator](/merit-calculator)**\n- 📄 **Free ATS CV Builder**: **[Free ATS CV Builder](/cv-builder)**\n- 📖 **Solved Past Papers**: **[Past Papers Hub](/past-papers)**\n- 💻 **Computer Course**: **[Live Computer Course Portal](/computer-course)**\n- 📇 **Roll No Slips**: **[Roll No Slip Finder](/rollno-slips)**\n- 📝 **Daily MCQ Quiz**: **[Daily MCQ Quiz Portal](/daily-quiz)**\n- 💬 **WhatsApp Groups**: **[WhatsApp Study Groups](/whatsapp-groups)**`;
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



