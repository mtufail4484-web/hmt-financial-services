import { NextResponse } from "next/server";

export const revalidate = 21600;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const GOLD_PER_TOLA_GRAMS = 11.664;
let cachedRates = null;

const sources = [
  {
    name: "Gold.pk",
    goldUrl: "https://gold.pk/",
    silverUrl: "https://gold.pk/pakistan-silver-rates-xagp.php",
  },
  {
    name: "Sarafa.pk",
    goldUrl: "https://sarafa.pk/en/",
    silverUrl: "https://sarafa.pk/en/",
  },
  {
    name: "Sarmaaya.pk",
    goldUrl: "https://sarmaaya.pk/commodities/gold",
    silverUrl: "https://sarmaaya.pk/commodities/gold",
  },
];

const stripHtml = (html = "") =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

const toNumber = (value) => {
  const parsed = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const isValidGoldRate = (value) => value >= 10000 && value <= 100000;
const isValidSilverRate = (value) => value >= 100 && value <= 10000;

const findUpdatedText = (text) => {
  const match =
    text.match(/(?:updated|last updated|rate updated|date)[:\s-]{0,20}([A-Za-z0-9,:\s/-]{8,60})/i) ||
    text.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?)/i);
  const value = match?.[1]?.trim();
  if (value && /\d/.test(value)) return value;
  return new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });
};

const extractNear = (text, keywords, validator) => {
  const lower = text.toLowerCase();
  for (const keyword of keywords) {
    let index = lower.indexOf(keyword.toLowerCase());
    while (index >= 0) {
      const window = text.slice(Math.max(0, index - 180), index + 260);
      const gramMatch =
        window.match(/(?:per\s*gram|1\s*gram|gram)[^\d]{0,60}(\d[\d,]*(?:\.\d+)?)/i) ||
        window.match(/(\d[\d,]*(?:\.\d+)?)[^\d]{0,60}(?:per\s*gram|1\s*gram|gram)/i);
      const gramRate = toNumber(gramMatch?.[1]);
      if (validator(gramRate)) return gramRate;

      const tolaMatch =
        window.match(/(?:per\s*tola|1\s*tola|tola)[^\d]{0,60}(\d[\d,]*(?:\.\d+)?)/i) ||
        window.match(/(\d[\d,]*(?:\.\d+)?)[^\d]{0,60}(?:per\s*tola|1\s*tola|tola)/i);
      const tolaRate = toNumber(tolaMatch?.[1]);
      const perGram = tolaRate / GOLD_PER_TOLA_GRAMS;
      if (validator(perGram)) return Math.round(perGram * 100) / 100;

      index = lower.indexOf(keyword.toLowerCase(), index + keyword.length);
    }
  }
  return 0;
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    next: { revalidate: 21600 },
    headers: {
      "user-agent": "Mozilla/5.0 HMT Success Academy rate checker",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return stripHtml(await response.text());
};

const loadFromSource = async (source) => {
  const [goldText, silverText] = await Promise.all([
    fetchText(source.goldUrl),
    fetchText(source.silverUrl),
  ]);

  const goldPerGram = extractNear(goldText, ["24k", "24 k", "gold", "sona"], isValidGoldRate);
  const silverPerGram = extractNear(silverText, ["silver", "chandi", "xag"], isValidSilverRate);
  if (!isValidGoldRate(goldPerGram) || !isValidSilverRate(silverPerGram)) {
    throw new Error(`${source.name} did not provide valid gold and silver rates`);
  }

  return {
    goldPerGram,
    silverPerGram,
    source: source.name,
    lastUpdated: findUpdatedText(`${goldText} ${silverText}`),
    fallbackUsed: source.name !== sources[0].name,
  };
};

export async function GET() {
  if (cachedRates && Date.now() - cachedRates.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedRates.data, cached: true });
  }

  for (const source of sources) {
    try {
      const data = await loadFromSource(source);
      cachedRates = { data, cachedAt: Date.now() };
      return NextResponse.json({ ...data, cached: false });
    } catch (err) {
      console.warn(`Metal rates source failed: ${source.name}`, err);
    }
  }

  return NextResponse.json(
    {
      goldPerGram: null,
      silverPerGram: null,
      source: null,
      lastUpdated: null,
      fallbackUsed: true,
      message: "Automatic rate update is temporarily unavailable. Please enter current gold and silver rates manually.",
    },
    { status: 503 }
  );
}
