import { NextResponse } from "next/server";

const HMT_SYSTEM_PROMPT = `You are HMT AI Assistant, the official virtual study tutor and support assistant for HMT Success Academy & HMT Financial Services, hosted by Muhammad Tufail in Peshawar, KPK, Pakistan.

Your Responsibilities:
1. Help students with competitive exam preparation: ETEA KP (PST, CT, SST, Police Constable), KPPSC (Computer Operator, Tehsildar), FPSC, PPSC, and NTS.
2. Provide step-by-step guidance on Microsoft Office (Excel formulas like VLOOKUP/XLOOKUP/Pivot Tables, MS Word formatting, PowerPoint, and DIT diploma).
3. Guide users on HMT Services: Instant ATS CV Builder (/cv-builder), ETEA Merit Aggregate Calculator (/merit-calculator), Roll No Slip Finder (/rollno-slips), Daily MCQ Quiz (/daily-quiz), Solved Past Papers (/past-papers), and Verification Portal (/verify).
4. Respond politely, accurately, and concisely. Use clear formatting or bullet points when explaining formulas or study steps.
5. You can understand and respond in English, Roman Urdu (e.g., "Aap Excel mein VLOOKUP formula iss tarah istemal kar saktay hain"), and Urdu.`;

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
          parts: [{ text: `${HMT_SYSTEM_PROMPT}\n\nUser Question: ${promptText}` }],
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
          "I am HMT AI Assistant. How can I assist you with your ETEA preparation or computer course today?";
        return NextResponse.json({ reply: aiResponse });
      }
    }

    // Smart Built-in Fallback Knowledge Engine (if API Key is not set yet in Vercel env)
    const lower = promptText.toLowerCase();
    let fallbackReply = "";

    if (lower.includes("vlookup") || lower.includes("xlookup") || lower.includes("excel")) {
      fallbackReply = `📊 **Microsoft Excel Formula Guide:**\n\n- **VLOOKUP Syntax**: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`\n- **Example**: \`=VLOOKUP(A2, Sheet1!A1:D100, 2, FALSE)\` searches for the ID in cell A2 and returns the student name from column 2.\n- **Tip**: You can practice Excel formulas in our **HMT Free Live Computer Course** on the student portal!`;
    } else if (lower.includes("pst") || lower.includes("ct") || lower.includes("etea")) {
      fallbackReply = `📚 **ETEA KP Recruitment Guide:**\n\n- **Selection Formula**: ETEA Written Test carries **50% weightage**, FSc carries **15%**, Graduation carries **15%**, B.Ed/CT carries **10%**, and Matric carries **10%**.\n- You can calculate your exact total score out of 100 on our **[ETEA Merit Calculator](/merit-calculator)**.\n- For authentic solved past papers, visit **[Past Papers Hub](/past-papers)**.`;
    } else if (lower.includes("cv") || lower.includes("resume")) {
      fallbackReply = `📄 **HMT Free ATS CV Builder Guide:**\n\n- Visit our **[Free ATS CV Builder](/cv-builder)** page.\n- Fill in your name, target job role, qualifications, and work history.\n- Click **Print / Download PDF** to generate an instant job-ready A4 resume for ETEA and Bank posts!`;
    } else if (lower.includes("roll no") || lower.includes("slip") || lower.includes("center")) {
      fallbackReply = `📇 **Roll Number Slip Download Guide:**\n\n- Visit our **[Roll No Slip Finder](/rollno-slips)** page.\n- Select your testing agency (ETEA, KPPSC, FPSC, or NTS) and click the direct official download link.\n- Make sure to enter your 13-digit CNIC without dashes!`;
    } else if (lower.includes("tufail") || lower.includes("contact") || lower.includes("whatsapp")) {
      fallbackReply = `💬 **HMT Success Academy Contact Info:**\n\n- **Instructor**: Muhammad Tufail\n- **Official WhatsApp**: +92 342 2981356\n- **Study Groups Hub**: Join official WhatsApp study groups on **[WhatsApp Groups Hub](/whatsapp-groups)**!`;
    } else {
      fallbackReply = `🤖 **Assalam o Alaikum! I am HMT AI Assistant.**\n\nI can help you with:\n1. 📊 **Excel & Word Tutorials** (VLOOKUP, formatting, typing)\n2. 📚 **ETEA & KPPSC Preparation** (PST, CT, Computer Operator merit formulas)\n3. 📄 **ATS CV Builder & Roll No Slips**\n4. 🎓 **HMT Computer Course & Portal Help**\n\nPlease ask your question!`;
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
