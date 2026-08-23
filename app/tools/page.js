"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const tools = [
  { id: "zakat", label: "Zakat Calculator" },
  { id: "tax", label: "Income Tax Calculator" },
  { id: "gpa", label: "GPA Calculator" },
  { id: "age", label: "Age Calculator" },
  { id: "percentage", label: "Percentage Calculator" },
  { id: "marksheet", label: "Marksheet Calculator" },
];

const incomeTaxSlabs = [
  { min: 0, max: 600000, base: 0, rate: 0, excess: 0, label: "Up to 600,000" },
  { min: 600000, max: 1200000, base: 0, rate: 0.01, excess: 600000, label: "600,001 - 1,200,000" },
  { min: 1200000, max: 2200000, base: 6000, rate: 0.11, excess: 1200000, label: "1,200,001 - 2,200,000" },
  { min: 2200000, max: 3200000, base: 116000, rate: 0.2, excess: 2200000, label: "2,200,001 - 3,200,000" },
  { min: 3200000, max: 4100000, base: 316000, rate: 0.25, excess: 3200000, label: "3,200,001 - 4,100,000" },
  { min: 4100000, max: 5600000, base: 541000, rate: 0.29, excess: 4100000, label: "4,100,001 - 5,600,000" },
  { min: 5600000, max: 7000000, base: 976000, rate: 0.32, excess: 5600000, label: "5,600,001 - 7,000,000" },
  { min: 7000000, max: Infinity, base: 1424000, rate: 0.35, excess: 7000000, label: "Above 7,000,000" },
];

const inputClass =
  "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const POWERED_BY_BRAND = "HMT Financial & Digital Solutions";
const ZAKAT_RATE = 0.025;
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;
const seoFaqs = [
  {
    question: "How do I calculate the percentage of my exam marks?",
    answer:
      "Enter your obtained marks and total marks in the Percentage Mark Calculator. The tool divides obtained marks by total marks and multiplies the result by 100 to show your exam percentage instantly.",
  },
  {
    question: "How does the online GPA calculator compute semester grades?",
    answer:
      "The GPA calculator multiplies each subject grade point by its credit hours, adds all quality points, and divides the total by credit hours to estimate your semester GPA.",
  },
  {
    question: "Are the Zakat and Income Tax rates aligned with Pakistan regulations?",
    answer:
      "The Zakat calculator uses the standard 2.5% rate with gold and silver Nisab values, while the Income Tax calculator follows the Pakistan slab structure added for 2026 educational estimates. Always confirm final religious or tax decisions with a qualified scholar or tax professional.",
  },
];

const Label = ({ children }) => (
  <label className="block text-[11px] font-black uppercase text-slate-500">{children}</label>
);

const ResultBox = ({ title, value, detail }) => (
  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
    <p className="text-[11px] font-black uppercase text-blue-700">{title}</p>
    <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    {detail && <p className="mt-1 text-xs font-semibold text-slate-600">{detail}</p>}
  </div>
);

const parseAmount = (value) => {
  const cleaned = String(value ?? "")
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const formatAmount = (value, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-PK", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits > 0 ? 0 : 0,
  }).format(parseAmount(value));

const formatCurrency = (value, maximumFractionDigits = 0) => `Rs. ${formatAmount(value, maximumFractionDigits)}`;

const formatInputAmount = (value) => {
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  if (!cleaned) return "";
  const [rawInt, ...decimalParts] = cleaned.split(".");
  const intPart = rawInt.replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = decimalParts.join("").slice(0, 2);
  const formattedInt = new Intl.NumberFormat("en-PK").format(Number(intPart));
  return cleaned.includes(".") ? `${formattedInt}.${decimalPart}` : formattedInt;
};

const formatInputSetter = (setter) => (event) => setter(formatInputAmount(event.target.value));
const plainNumberSetter = (setter) => (event) => setter(formatInputAmount(event.target.value).replace(/,/g, ""));

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState("zakat");

  const [zakatCash, setZakatCash] = useState("");
  const [zakatBank, setZakatBank] = useState("");
  const [zakatGold, setZakatGold] = useState("");
  const [zakatSilver, setZakatSilver] = useState("");
  const [zakatBusiness, setZakatBusiness] = useState("");
  const [zakatReceivables, setZakatReceivables] = useState("");
  const [zakatInvestments, setZakatInvestments] = useState("");
  const [zakatOtherAssets, setZakatOtherAssets] = useState("");
  const [zakatDebt, setZakatDebt] = useState("");
  const [goldRate, setGoldRate] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [metalRates, setMetalRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");

  const [income, setIncome] = useState("");

  const [subjects, setSubjects] = useState([
    { name: "Subject 1", marks: "", total: "100", credits: "3", grade: "4" },
    { name: "Subject 2", marks: "", total: "100", credits: "3", grade: "3.7" },
    { name: "Subject 3", marks: "", total: "100", credits: "3", grade: "3.3" },
    { name: "Subject 4", marks: "", total: "100", credits: "3", grade: "3" },
  ]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentRollNo, setStudentRollNo] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [examTitle, setExamTitle] = useState("Annual Examination Result");
  const [resultDate, setResultDate] = useState(new Date().toISOString().split("T")[0]);
  const [institutionLogo, setInstitutionLogo] = useState("");
  const [studentPhoto, setStudentPhoto] = useState("");
  const [principalSignature, setPrincipalSignature] = useState("");
  const [classResults, setClassResults] = useState([]);
  const [passingPercentage, setPassingPercentage] = useState("40");
  const [remarkRules, setRemarkRules] = useState([
    { operator: ">=", value: "80", remark: "Excellent" },
    { operator: ">=", value: "60", remark: "Good" },
    { operator: ">=", value: "40", remark: "Pass" },
    { operator: "<", value: "40", remark: "Fail" },
  ]);

  const [birthDate, setBirthDate] = useState("");
  const [percentOfRate, setPercentOfRate] = useState("");
  const [percentOfBase, setPercentOfBase] = useState("");
  const [percentPart, setPercentPart] = useState("");
  const [percentWhole, setPercentWhole] = useState("");
  const [marksObtained, setMarksObtained] = useState("");
  const [marksTotal, setMarksTotal] = useState("");
  const [gpaPercent, setGpaPercent] = useState("");

  const number = (value) => parseAmount(value);
  const activeToolLabel = tools.find((tool) => tool.id === activeTool)?.label || "Calculator";
  const handleToolChange = (toolId) => {
    setActiveTool(toolId);
  };
  const panelClass = (toolId, extra = "") =>
    `calculator-print-panel space-y-4 ${extra} ${activeTool === toolId ? "block" : "hidden"}`;

  const loadMetalRates = async () => {
    setRatesLoading(true);
    setRatesError("");
    try {
      const response = await fetch("/api/metal-rates", { cache: "no-store" });
      const data = response.ok ? await response.json() : null;
      if (!data?.goldPerGram || !data?.silverPerGram) {
        throw new Error("Missing gold or silver rate");
      }
      setMetalRates(data);
      if (!useCustomRates) {
        setGoldRate(formatInputAmount(data.goldPerGram));
        setSilverRate(formatInputAmount(data.silverPerGram));
      }
    } catch (err) {
      console.warn("Metal rate update failed:", err);
      setMetalRates(null);
      setRatesError("Automatic rate update is temporarily unavailable. Please enter current gold and silver rates manually.");
      setUseCustomRates(true);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadMetalRates();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zakat = useMemo(() => {
    const goldPerGram = number(goldRate);
    const silverPerGram = number(silverRate);
    const goldNisabValue = goldPerGram * GOLD_NISAB_GRAMS;
    const silverNisabValue = silverPerGram * SILVER_NISAB_GRAMS;
    const assets =
      number(zakatCash) +
      number(zakatBank) +
      number(zakatGold) +
      number(zakatSilver) +
      number(zakatBusiness) +
      number(zakatReceivables) +
      number(zakatInvestments) +
      number(zakatOtherAssets);
    const liabilities = number(zakatDebt);
    const net = Math.max(0, assets - liabilities);
    const hasRates = goldPerGram > 0 && silverPerGram > 0;
    const isSahibENisab = hasRates && net >= silverNisabValue;
    return {
      assets,
      liabilities,
      net,
      goldPerGram,
      silverPerGram,
      goldNisabValue,
      silverNisabValue,
      hasRates,
      isSahibENisab,
      amount: isSahibENisab ? net * ZAKAT_RATE : 0,
    };
  }, [
    goldRate,
    silverRate,
    zakatBank,
    zakatBusiness,
    zakatCash,
    zakatDebt,
    zakatGold,
    zakatInvestments,
    zakatOtherAssets,
    zakatReceivables,
    zakatSilver,
  ]);

  const tax = useMemo(() => {
    const annualIncome = number(income);
    const slab =
      incomeTaxSlabs.find((item) => annualIncome > item.min && annualIncome <= item.max) ||
      incomeTaxSlabs[0];
    const taxAmount = slab.base + Math.max(0, annualIncome - slab.excess) * slab.rate;
    return {
      annualIncome,
      slab,
      taxAmount,
      monthlyTax: taxAmount / 12,
      monthlyIncome: annualIncome / 12,
    };
  }, [income]);

  const marksheet = useMemo(() => {
    const obtained = subjects.reduce((sum, item) => sum + number(item.marks), 0);
    const total = subjects.reduce((sum, item) => sum + number(item.total), 0);
    const percentage = total ? (obtained / total) * 100 : 0;
    const passMark = Math.max(0, number(passingPercentage));
    const failedSubjects = subjects.filter((item) => {
      const subjectTotal = number(item.total);
      if (!subjectTotal) return false;
      return (number(item.marks) / subjectTotal) * 100 < passMark;
    });
    const matchedRule = remarkRules.find((rule) => {
      const ruleValue = number(rule.value);
      if (rule.operator === ">") return percentage > ruleValue;
      if (rule.operator === ">=") return percentage >= ruleValue;
      if (rule.operator === "<") return percentage < ruleValue;
      if (rule.operator === "<=") return percentage <= ruleValue;
      if (rule.operator === "=") return percentage === ruleValue;
      return false;
    });
    const ruleRemark = matchedRule?.remark?.trim() || "Result Calculated";
    const failedSubjectNames = failedSubjects.map((item) => item.name || "Subject").join(", ");
    const status = failedSubjects.length > 0 ? "Fail" : ruleRemark;
    const remarks = failedSubjects.length > 0 ? `Needs improvement in ${failedSubjectNames}` : ruleRemark;
    return { obtained, total, percentage, status, remarks, failedSubjects };
  }, [passingPercentage, remarkRules, subjects]);

  const gpa = useMemo(() => {
    const creditTotal = subjects.reduce((sum, item) => sum + number(item.credits), 0);
    const points = subjects.reduce((sum, item) => sum + number(item.credits) * number(item.grade), 0);
    return creditTotal ? points / creditTotal : 0;
  }, [subjects]);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const dob = new Date(birthDate);
    if (Number.isNaN(dob.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const weekday = dob.toLocaleDateString("en-US", { weekday: "long" });
    return { years, months, days, weekday };
  }, [birthDate]);

  const percentageResults = useMemo(() => {
    const rate = number(percentOfRate);
    const base = number(percentOfBase);
    const part = number(percentPart);
    const whole = number(percentWhole);
    const obtained = number(marksObtained);
    const total = number(marksTotal);

    return {
      formulaA: {
        value: (rate / 100) * base,
        error: "",
      },
      formulaB: {
        value: whole > 0 ? (part / whole) * 100 : 0,
        error: part > 0 && whole <= 0 ? "Total value must be greater than 0." : "",
      },
      marks: {
        value: total > 0 ? (obtained / total) * 100 : 0,
        error: obtained > 0 && total <= 0 ? "Total Marks must be greater than 0." : "",
      },
    };
  }, [marksObtained, marksTotal, percentOfBase, percentOfRate, percentPart, percentWhole]);

  const gpaConversion = useMemo(() => {
    const percentage = number(gpaPercent);
    if (percentage > 100) return { output: "Please enter a percentage between 0 and 100.", warning: true };
    if (percentage >= 85) return { output: "GPA: 4.0 (Grade: A+)" };
    if (percentage >= 80) return { output: "GPA: 3.66 - 3.99 (Grade: A)" };
    if (percentage >= 75) return { output: "GPA: 3.33 - 3.65 (Grade: B+)" };
    if (percentage >= 71) return { output: "GPA: 3.00 - 3.32 (Grade: B)" };
    if (percentage >= 68) return { output: "GPA: 2.66 - 2.99 (Grade: B-)" };
    if (percentage >= 64) return { output: "GPA: 2.33 - 2.65 (Grade: C+)" };
    if (percentage >= 61) return { output: "GPA: 2.00 - 2.32 (Grade: C)" };
    if (percentage > 0) return { output: "GPA: 0.00 (Grade: F / Below passing criteria)" };
    return { output: "Enter percentage to convert into GPA/CGPA." };
  }, [gpaPercent]);

  const updateSubject = (index, key, value) => {
    setSubjects((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        name: `Subject ${prev.length + 1}`,
        marks: "",
        total: "100",
        credits: "3",
        grade: "3",
      },
    ]);
  };

  const removeSubject = (index) => {
    setSubjects((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const updateRemarkRule = (index, key, value) => {
    setRemarkRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, [key]: value } : rule)));
  };

  const addRemarkRule = () => {
    setRemarkRules((prev) => [...prev, { operator: ">=", value: "50", remark: "Satisfactory" }]);
  };

  const removeRemarkRule = (index) => {
    setRemarkRules((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleImagePreview = (file, setter) => {
    if (!file) {
      setter("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const downloadMarksheetCsv = () => {
    const rows = [
      ["Institution", institutionName || "School / Madrasa"],
      ["Student Name", studentName || "Student"],
      ["Class", studentClass || "N/A"],
      ["Roll No", studentRollNo || "N/A"],
      ["Exam", examTitle || "Result Card"],
      ["Date", resultDate || ""],
      [],
      ["Subject", "Obtained Marks", "Total Marks"],
      ...subjects.map((item) => [item.name, item.marks || "0", item.total || "0"]),
      [],
      ["Obtained", marksheet.obtained],
      ["Total", marksheet.total],
      ["Percentage", `${marksheet.percentage.toFixed(2)}%`],
      ["Status", marksheet.status],
      ["Remarks", marksheet.remarks],
      [],
      ["Powered by", POWERED_BY_BRAND],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `HMT-Result-Card-${studentName || "Student"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const saveCurrentStudentResult = () => {
    if (!studentName.trim()) {
      alert("Please enter student name before adding to complete result.");
      return;
    }

    setClassResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        studentRollNo: studentRollNo.trim(),
        obtained: marksheet.obtained,
        total: marksheet.total,
        percentage: marksheet.percentage,
        status: marksheet.status,
        remarks: marksheet.remarks,
        subjects: subjects.map((item) => ({ ...item })),
      },
    ]);
  };

  const removeClassResult = (id) => {
    setClassResults((prev) => prev.filter((item) => item.id !== id));
  };

  const printSection = (mode = "active") => {
    const printClasses = ["printing-active-tool", "printing-result-card", "printing-class-result"];
    document.body.classList.remove(...printClasses);
    document.body.classList.add(
      mode === "card" ? "printing-result-card" : mode === "class" ? "printing-class-result" : "printing-active-tool"
    );
    const cleanup = () => {
      document.body.classList.remove(...printClasses);
      window.removeEventListener("afterprint", cleanup);
      window.removeEventListener("focus", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.addEventListener("focus", cleanup, { once: true });
    window.requestAnimationFrame(() => window.print());
  };

  const printResultSection = (mode) => {
    printSection(mode === "class" ? "class" : "card");
  };

  const downloadClassResultCsv = () => {
    const subjectNames = subjects.map((item) => item.name || "Subject");
    const rows = [
      [institutionName || "School / Madrasa", examTitle || "Complete Result"],
      ["Class", studentClass || "N/A"],
      ["Date", resultDate || ""],
      [],
      ["Roll No", "Student Name", ...subjectNames, "Obtained", "Total", "Percentage", "Status", "Remarks"],
      ...classResults.map((student) => [
        student.studentRollNo || "",
        student.studentName,
        ...subjectNames.map((_, index) => student.subjects[index]?.marks || "0"),
        student.obtained,
        student.total,
        `${student.percentage.toFixed(2)}%`,
        student.status,
        student.remarks,
      ]),
      [],
      ["Powered by", POWERED_BY_BRAND],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `HMT-Complete-Result-${studentClass || "Class"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 tools-page">
      <section className="bg-slate-950 px-4 py-10 text-white no-print">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-200">HMT Financial and Digital Services Resources</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Free Student Calculators, GPA Calculator and Result Card Generator</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-slate-300">
            Calculate academic grades instantly with free tools for Pakistan students, schools, madrasas, and universities. Use the GPA calculator, marksheet generator, percentage calculator, age finder, Zakat calculator, and Pakistan income tax calculator in one clean portal.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/portal" className="rounded-xl bg-cyan-300 px-4 py-2 text-xs font-black text-slate-950 hover:bg-cyan-200">
              Student Portal
            </Link>
            <Link href="/computer-course" className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black text-white hover:bg-white/15">
              Computer Course
            </Link>
          </div>
        </div>
      </section>

      <section className="tools-workspace mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="no-print rounded-2xl border bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToolChange(tool.id)}
                aria-pressed={activeTool === tool.id}
                aria-controls={`${tool.id}-calculator-panel`}
                className={`rounded-xl px-3 py-2 text-left text-xs font-black transition ${
                  activeTool === tool.id ? "active bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="calculator-card rounded-2xl border bg-white p-4 shadow-sm md:p-6">
          <section id="zakat-calculator-panel" className={panelClass("zakat")} data-tool="zakat" aria-hidden={activeTool !== "zakat"}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Zakat Calculator</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Enter zakatable assets and immediate payable liabilities. Zakat is calculated at 2.5% after Silver Nisab eligibility.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={loadMetalRates} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700">
                    {ratesLoading ? "Refreshing..." : "Refresh Rates"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZakatCash("");
                      setZakatBank("");
                      setZakatGold("");
                      setZakatSilver("");
                      setZakatBusiness("");
                      setZakatReceivables("");
                      setZakatInvestments("");
                      setZakatOtherAssets("");
                      setZakatDebt("");
                    }}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-200"
                  >
                    Reset
                  </button>
                  <button type="button" onClick={() => printSection("active")} className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-black">
                    Print / Save PDF
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase text-blue-700">Pakistan Market Rates</p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">Rates are taken from Pakistan market sources and may vary by city/shop.</p>
                    <p className="mt-1 text-xs font-black text-slate-800">
                      Current rates source: {metalRates?.source || "Manual / unavailable"}
                    </p>
                    {metalRates?.lastUpdated && <p className="text-[11px] font-semibold text-slate-500">Last updated: {metalRates.lastUpdated}</p>}
                    {ratesError && <p className="mt-2 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-800">{ratesError}</p>}
                  </div>
                  <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700">
                    <input type="checkbox" checked={useCustomRates} onChange={(e) => setUseCustomRates(e.target.checked)} />
                    Use custom rate
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label>Current 24K Gold Rate Per Gram</Label>
                    <input className={inputClass} value={goldRate} onChange={formatInputSetter(setGoldRate)} inputMode="decimal" disabled={!useCustomRates && !!metalRates} placeholder="37556" />
                  </div>
                  <div>
                    <Label>Current 24K Silver Rate Per Gram</Label>
                    <input className={inputClass} value={silverRate} onChange={formatInputSetter(setSilverRate)} inputMode="decimal" disabled={!useCustomRates && !!metalRates} placeholder="582.49" />
                  </div>
                </div>
                {!zakat.hasRates && (
                  <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-800">
                    Please enter current gold and silver rates to calculate Nisab.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div><Label>Cash in Hand</Label><input className={inputClass} value={zakatCash} onChange={formatInputSetter(setZakatCash)} inputMode="decimal" /></div>
                <div><Label>Bank Balance</Label><input className={inputClass} value={zakatBank} onChange={formatInputSetter(setZakatBank)} inputMode="decimal" /></div>
                <div><Label>Gold Value</Label><input className={inputClass} value={zakatGold} onChange={formatInputSetter(setZakatGold)} inputMode="decimal" /></div>
                <div><Label>Silver Value</Label><input className={inputClass} value={zakatSilver} onChange={formatInputSetter(setZakatSilver)} inputMode="decimal" /></div>
                <div><Label>Business Stock</Label><input className={inputClass} value={zakatBusiness} onChange={formatInputSetter(setZakatBusiness)} inputMode="decimal" /></div>
                <div><Label>Receivables</Label><input className={inputClass} value={zakatReceivables} onChange={formatInputSetter(setZakatReceivables)} inputMode="decimal" /></div>
                <div><Label>Investments</Label><input className={inputClass} value={zakatInvestments} onChange={formatInputSetter(setZakatInvestments)} inputMode="decimal" /></div>
                <div><Label>Other Zakatable Assets</Label><input className={inputClass} value={zakatOtherAssets} onChange={formatInputSetter(setZakatOtherAssets)} inputMode="decimal" /></div>
                <div><Label>Immediate Payable Liabilities</Label><input className={inputClass} value={zakatDebt} onChange={formatInputSetter(setZakatDebt)} inputMode="decimal" /></div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ResultBox title="Gold Nisab Value" value={formatCurrency(zakat.goldNisabValue)} detail={`${GOLD_NISAB_GRAMS} grams / 7.5 tola gold`} />
                <ResultBox title="Silver Nisab Value" value={formatCurrency(zakat.silverNisabValue)} detail={`${SILVER_NISAB_GRAMS} grams / 52.5 tola silver. Default threshold for mixed assets.`} />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ResultBox title="Total Zakatable Assets" value={formatCurrency(zakat.assets)} />
                <ResultBox title="Liabilities" value={formatCurrency(zakat.liabilities)} />
                <ResultBox title="Net Zakatable Wealth" value={formatCurrency(zakat.net)} />
              </div>

              <div className={`rounded-2xl border p-5 ${zakat.isSahibENisab ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                {zakat.isSahibENisab ? (
                  <>
                    <p className="text-sm font-black text-emerald-800" dir="rtl">آپ صاحبِ نصاب ہیں۔ آپ پر زکوٰۃ لازم ہے۔</p>
                    <p className="mt-3 text-[11px] font-black uppercase text-emerald-700">Zakat Payable</p>
                    <p className="mt-1 text-4xl font-black text-emerald-950">{formatCurrency(zakat.amount)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-black leading-relaxed text-amber-900" dir="rtl">
                      آپ فی الحال صاحبِ نصاب نہیں ہیں، اس لیے آپ پر زکوٰۃ لازم نہیں۔ اللہ تعالیٰ آپ کو صاحبِ نصاب بنائے اور برکت عطا فرمائے۔ آمین
                    </p>
                    <p className="mt-3 text-2xl font-black text-slate-950">Zakat Payable: {formatCurrency(0)}</p>
                  </>
                )}
                <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold leading-relaxed text-slate-700" dir="rtl">
                  نوٹ: زکوٰۃ اس وقت لازم ہوتی ہے جب نصاب کے برابر یا اس سے زیادہ مال ایک قمری سال تک موجود رہے۔ حتمی شرعی رہنمائی کے لیے مستند عالمِ دین سے رجوع کریں۔
                </p>
              </div>
          </section>

          <section id="tax-calculator-panel" className={panelClass("tax", "tax-print-panel")} data-tool="tax" aria-hidden={activeTool !== "tax"}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Pakistan Income Tax Calculator 2026</h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Enter annual taxable income. Tax is calculated according to the slab rates provided.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => printSection("active")}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-black"
                >
                  Print / Save PDF
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label>Annual Taxable Income (Rs.)</Label>
                  <input className={inputClass} value={income} onChange={formatInputSetter(setIncome)} inputMode="decimal" placeholder="1,200,000" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ResultBox title="Annual Taxable Income" value={formatCurrency(tax.annualIncome)} detail={`Slab: Rs. ${tax.slab.label}`} />
                <ResultBox title="Annual Tax" value={formatCurrency(tax.taxAmount)} detail="Estimated annual liability" />
                <ResultBox title="Monthly Tax Deduction" value={formatCurrency(tax.monthlyTax)} detail={`Monthly salary: ${formatCurrency(tax.monthlyIncome)}`} />
              </div>

              <div className="overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-3">Annual Taxable Income</th>
                      <th className="p-3">Tax Liability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeTaxSlabs.map((slab) => (
                      <tr key={slab.label} className={`border-b ${tax.slab.label === slab.label ? "bg-blue-50" : "bg-white"}`}>
                        <td className="p-3 font-black text-slate-800">Rs. {slab.label}</td>
                        <td className="p-3 font-semibold text-slate-600">
                          {slab.rate === 0
                            ? "Nil"
                            : `Rs. ${slab.base.toLocaleString()} + ${(slab.rate * 100).toFixed(0)}% of amount exceeding Rs. ${slab.excess.toLocaleString()}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                This is an educational estimate. Confirm final tax treatment with an authorized tax professional.
              </p>
          </section>

          <section id="gpa-calculator-panel" className={panelClass("gpa")} data-tool="gpa" aria-hidden={activeTool !== "gpa"}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-950">University GPA Calculator for Semester Grades</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Enter credit hours and grade points for each subject.</p>
                </div>
                <button
                  type="button"
                  onClick={addSubject}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
              <SubjectGrid subjects={subjects} updateSubject={updateSubject} removeSubject={removeSubject} mode="gpa" />
              <ResultBox title="Calculated GPA" value={gpa.toFixed(2)} detail="Based on credit hours and grade points." />
          </section>

          <section id="age-calculator-panel" className={panelClass("age")} data-tool="age" aria-hidden={activeTool !== "age"}>
              <h2 className="text-xl font-black text-slate-950">Age Calculator</h2>
              <div><Label>Date of Birth</Label><input className={inputClass} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" /></div>
              <ResultBox
                title="Your Age"
                value={age ? `${age.years} years` : "Select date"}
                detail={age ? `${age.months} months and ${age.days} days. Born on ${age.weekday}.` : "Choose your date of birth to calculate age."}
              />
          </section>

          <section id="percentage-calculator-panel" className={panelClass("percentage")} data-tool="percentage" aria-hidden={activeTool !== "percentage"}>
              <div>
                <h2 className="text-xl font-black text-slate-950">Percentage Calculator for Exam Marks and Student Results</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Use simple percentage formulas for daily calculations, comparisons, and marks.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[11px] font-black uppercase text-blue-700">Formula A</p>
                  <h3 className="mt-1 text-sm font-black text-slate-950">What is X% of Y?</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div>
                      <Label>Percentage X</Label>
                      <input className={inputClass} value={percentOfRate} onChange={plainNumberSetter(setPercentOfRate)} inputMode="decimal" placeholder="25" />
                    </div>
                    <div>
                      <Label>Value Y</Label>
                      <input className={inputClass} value={percentOfBase} onChange={plainNumberSetter(setPercentOfBase)} inputMode="decimal" placeholder="1,000" />
                    </div>
                  </div>
                  <ResultBox
                    title="Answer"
                    value={formatAmount(percentageResults.formulaA.value, 2)}
                    detail={`${formatAmount(percentOfRate, 2)}% of ${formatAmount(percentOfBase, 2)}`}
                  />
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4">
                  <p className="text-[11px] font-black uppercase text-blue-700">Formula B</p>
                  <h3 className="mt-1 text-sm font-black text-slate-950">X is what percentage of Y?</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div>
                      <Label>Value X</Label>
                      <input className={inputClass} value={percentPart} onChange={plainNumberSetter(setPercentPart)} inputMode="decimal" placeholder="50" />
                    </div>
                    <div>
                      <Label>Total Value Y</Label>
                      <input className={inputClass} value={percentWhole} onChange={plainNumberSetter(setPercentWhole)} inputMode="decimal" placeholder="200" />
                    </div>
                  </div>
                  {percentageResults.formulaB.error && (
                    <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-800">{percentageResults.formulaB.error}</p>
                  )}
                  <ResultBox
                    title="Answer"
                    value={`${formatAmount(percentageResults.formulaB.value, 2)}%`}
                    detail={`${formatAmount(percentPart, 2)} out of ${formatAmount(percentWhole, 2)}`}
                  />
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-[11px] font-black uppercase text-blue-700">Formula C</p>
                  <h3 className="mt-1 text-sm font-black text-slate-950">Percentage Mark Calculator</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div>
                      <Label>Obtained Marks</Label>
                      <input className={inputClass} value={marksObtained} onChange={plainNumberSetter(setMarksObtained)} inputMode="decimal" placeholder="420" />
                    </div>
                    <div>
                      <Label>Total Marks</Label>
                      <input className={inputClass} value={marksTotal} onChange={plainNumberSetter(setMarksTotal)} inputMode="decimal" placeholder="500" />
                    </div>
                  </div>
                  {percentageResults.marks.error && (
                    <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-800">{percentageResults.marks.error}</p>
                  )}
                  <ResultBox
                    title="Marks Percentage"
                    value={`${formatAmount(percentageResults.marks.value, 2)}%`}
                    detail={`${formatAmount(marksObtained, 2)} / ${formatAmount(marksTotal, 2)}`}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase text-blue-700">Conversion Utility</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">Percentage to GPA/CGPA Converter</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Convert an overall percentage into a common higher education GPA/CGPA range.
                    </p>
                  </div>
                  <div className="w-full md:max-w-xs">
                    <Label>Enter Overall Percentage (0-100%)</Label>
                    <input
                      className={inputClass}
                      value={gpaPercent}
                      onChange={plainNumberSetter(setGpaPercent)}
                      inputMode="decimal"
                      placeholder="85"
                    />
                  </div>
                </div>
                <div className={`mt-4 rounded-2xl border p-4 ${gpaConversion.warning ? "border-amber-200 bg-amber-50" : "border-blue-100 bg-blue-50"}`}>
                  <p className="text-[11px] font-black uppercase text-blue-700">Converted Result</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">{gpaConversion.output}</p>
                </div>
              </div>
          </section>

          <section id="marksheet-calculator-panel" className={panelClass("marksheet", "marksheet-print-panel")} data-tool="marksheet" aria-hidden={activeTool !== "marksheet"}>
              <div>
                <h2 className="text-xl font-black text-slate-950">Online Marksheet Generator and Printable Result Card</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Create individual result cards for school or madrasa students. Print the card or save it as PDF from the print dialog.
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-4">
                <h3 className="text-sm font-black text-slate-900">Student and Institution Details</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div><Label>Student Name</Label><input className={inputClass} value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student full name" /></div>
                  <div><Label>Class</Label><input className={inputClass} value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="Class / Grade" /></div>
                  <div><Label>Roll No</Label><input className={inputClass} value={studentRollNo} onChange={(e) => setStudentRollNo(e.target.value)} placeholder="Roll number" /></div>
                  <div><Label>School / Madrasa Name</Label><input className={inputClass} value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="Institution name" /></div>
                  <div><Label>Exam Title</Label><input className={inputClass} value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="Annual / Monthly result" /></div>
                  <div><Label>Result Date</Label><input className={inputClass} value={resultDate} onChange={(e) => setResultDate(e.target.value)} type="date" /></div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <Label>School / Madrasa Logo</Label>
                    <input className={inputClass} onChange={(e) => handleImagePreview(e.target.files?.[0], setInstitutionLogo)} type="file" accept="image/*" />
                  </div>
                  <div>
                    <Label>Student Picture</Label>
                    <input className={inputClass} onChange={(e) => handleImagePreview(e.target.files?.[0], setStudentPhoto)} type="file" accept="image/*" />
                  </div>
                  <div>
                    <Label>Principal Signature</Label>
                    <input className={inputClass} onChange={(e) => handleImagePreview(e.target.files?.[0], setPrincipalSignature)} type="file" accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Result Logic and Remarks</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Set subject passing percentage and custom remarks for percentage conditions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRemarkRule}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
                  >
                    Add Criteria
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr]">
                  <div>
                    <Label>Subject Passing %</Label>
                    <input
                      className={inputClass}
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(e.target.value)}
                      type="number"
                      placeholder="40"
                    />
                    <p className="mt-1 text-[10px] font-semibold text-slate-500">Any subject below this percentage will show Fail.</p>
                  </div>

                  <div className="space-y-2">
                    {remarkRules.map((rule, index) => (
                      <div key={index} className="grid grid-cols-1 gap-2 rounded-2xl bg-white p-3 md:grid-cols-[120px_120px_1fr_auto]">
                        <div>
                          <Label>Logic</Label>
                          <select
                            className={inputClass}
                            value={rule.operator}
                            onChange={(e) => updateRemarkRule(index, "operator", e.target.value)}
                          >
                            <option value=">=">Greater / Equal</option>
                            <option value=">">Greater Than</option>
                            <option value="<=">Less / Equal</option>
                            <option value="<">Less Than</option>
                            <option value="=">Equal To</option>
                          </select>
                        </div>
                        <div>
                          <Label>Percentage</Label>
                          <input
                            className={inputClass}
                            value={rule.value}
                            onChange={(e) => updateRemarkRule(index, "value", e.target.value)}
                            type="number"
                          />
                        </div>
                        <div>
                          <Label>Remark</Label>
                          <input
                            className={inputClass}
                            value={rule.remark}
                            onChange={(e) => updateRemarkRule(index, "remark", e.target.value)}
                            placeholder="Excellent / Pass / Needs Improvement"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeRemarkRule(index)}
                            disabled={remarkRules.length <= 1}
                            className="w-full rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-900">Subjects</h3>
                <button
                  type="button"
                  onClick={addSubject}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
              <SubjectGrid subjects={subjects} updateSubject={updateSubject} removeSubject={removeSubject} mode="marks" />
              <ResultBox
                title="Final Result"
                value={`${marksheet.percentage.toFixed(2)}%`}
                detail={`Obtained ${marksheet.obtained} / ${marksheet.total}. Status: ${marksheet.status}. Remarks: ${marksheet.remarks}`}
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => printResultSection("card")}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-black"
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={saveCurrentStudentResult}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700"
                >
                  Add Student to Complete Result
                </button>
                <button
                  type="button"
                  onClick={downloadMarksheetCsv}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                >
                  Download Excel CSV
                </button>
              </div>

              <ResultCard
                subjects={subjects}
                marksheet={marksheet}
                studentName={studentName}
                studentClass={studentClass}
                studentRollNo={studentRollNo}
                institutionName={institutionName}
                examTitle={examTitle}
                resultDate={resultDate}
                institutionLogo={institutionLogo}
                studentPhoto={studentPhoto}
                principalSignature={principalSignature}
              />

              <ClassResultTable
                classResults={classResults}
                subjects={subjects}
                institutionName={institutionName}
                examTitle={examTitle}
                studentClass={studentClass}
                resultDate={resultDate}
                removeClassResult={removeClassResult}
                printResultSection={printResultSection}
                downloadClassResultCsv={downloadClassResultCsv}
              />
          </section>
        </div>
      </section>

      <section className="no-print mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-wide text-blue-700">Student Calculator FAQ</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Frequently Asked Questions About Free Student Calculators</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {seoFaqs.map((item) => (
              <details key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 open:bg-blue-50">
                <summary className="cursor-pointer text-sm font-black text-slate-950">{item.question}</summary>
                <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          html,
          body {
            width: auto !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
          }

          .no-print,
          .no-print-control,
          button,
          input[type="file"] {
            display: none !important;
          }

          .tools-page,
          .tools-workspace,
          .calculator-card,
          .calculator-print-panel,
          .result-card-print,
          .class-result-print {
            display: block !important;
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .calculator-card {
            border: 0 !important;
          }

          .calculator-print-panel.hidden {
            display: none !important;
          }

          body.printing-active-tool .calculator-print-panel:not(.hidden) {
            display: block !important;
          }

          .calculator-print-panel > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          body.printing-active-tool .calculator-print-panel:not(.hidden) .grid,
          body.printing-active-tool .calculator-print-panel:not(.hidden) .flex {
            display: block !important;
          }

          body.printing-active-tool .calculator-print-panel:not(.hidden) .grid > *,
          body.printing-active-tool .calculator-print-panel:not(.hidden) .flex > * {
            margin-bottom: 8px !important;
          }

          .calculator-print-panel table,
          .class-result-print table,
          .result-card-print table {
            width: 100% !important;
            min-width: 0 !important;
            border-collapse: collapse !important;
          }

          .calculator-print-panel .overflow-x-auto,
          .class-result-print .overflow-x-auto {
            overflow: visible !important;
          }

          .calculator-print-panel input,
          .calculator-print-panel select,
          .calculator-print-panel textarea {
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            background: #ffffff !important;
          }

          .calculator-print-panel *,
          .result-card-print *,
          .class-result-print * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body.printing-result-card .calculator-print-panel > :not(.result-card-print),
          body.printing-result-card .class-result-print,
          body.printing-class-result .calculator-print-panel > :not(.class-result-print),
          body.printing-class-result .result-card-print {
            display: none !important;
          }

          body.printing-result-card .result-card-print {
            border: 2px solid #020617 !important;
            padding: 0 !important;
          }

          body.printing-class-result .class-result-print {
            padding: 0 !important;
          }

          body.printing-active-tool .result-card-print,
          body.printing-active-tool .class-result-print {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function SubjectGrid({ subjects, updateSubject, removeSubject, mode }) {
  return (
    <div className="space-y-2">
      {subjects.map((subject, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 rounded-2xl border bg-slate-50 p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <Label>Subject</Label>
            <input className={inputClass} value={subject.name} onChange={(e) => updateSubject(index, "name", e.target.value)} />
          </div>
          {mode === "marks" ? (
            <>
              <div><Label>Obtained Marks</Label><input className={inputClass} value={subject.marks} onChange={(e) => updateSubject(index, "marks", e.target.value)} type="number" /></div>
              <div><Label>Total Marks</Label><input className={inputClass} value={subject.total} onChange={(e) => updateSubject(index, "total", e.target.value)} type="number" /></div>
            </>
          ) : (
            <>
              <div><Label>Credit Hours</Label><input className={inputClass} value={subject.credits} onChange={(e) => updateSubject(index, "credits", e.target.value)} type="number" /></div>
              <div><Label>Grade Points</Label><input className={inputClass} value={subject.grade} onChange={(e) => updateSubject(index, "grade", e.target.value)} type="number" step="0.1" /></div>
            </>
          )}
          {(mode === "marks" || mode === "gpa") && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeSubject?.(index)}
                disabled={subjects.length <= 1}
                className="w-full rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ResultCard({
  subjects,
  marksheet,
  studentName,
  studentClass,
  studentRollNo,
  institutionName,
  examTitle,
  resultDate,
  institutionLogo,
  studentPhoto,
  principalSignature,
}) {
  return (
    <div className="result-card-print overflow-hidden rounded-2xl border-4 border-slate-950 bg-white shadow-xl">
      <div className="bg-slate-950 px-5 py-4 text-white">
        <div className="grid grid-cols-[76px_1fr_76px] items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white text-xs font-black text-slate-700">
            {institutionLogo ? <img src={institutionLogo} alt="Institution logo" className="h-full w-full object-cover" /> : "LOGO"}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black uppercase tracking-wide">{institutionName || "School / Madrasa Name"}</h3>
            <p className="mt-1 text-xs font-bold text-cyan-100">{examTitle || "Student Result Card"}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white text-xs font-black text-slate-700">
            {studentPhoto ? <img src={studentPhoto} alt="Student" className="h-full w-full object-cover" /> : "PHOTO"}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm md:grid-cols-4">
          <Info label="Student Name" value={studentName || "Student Name"} />
          <Info label="Class" value={studentClass || "Class"} />
          <Info label="Roll No" value={studentRollNo || "Roll No"} />
          <Info label="Date" value={resultDate || "Result Date"} />
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-300">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-2">Subject</th>
                <th className="p-2 text-center">Obtained</th>
                <th className="p-2 text-center">Total</th>
                <th className="p-2 text-center">%</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const obtained = Number(subject.marks) || 0;
                const total = Number(subject.total) || 0;
                const percent = total ? (obtained / total) * 100 : 0;
                return (
                  <tr key={index} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">{subject.name || `Subject ${index + 1}`}</td>
                    <td className="p-2 text-center font-bold">{obtained}</td>
                    <td className="p-2 text-center font-bold">{total}</td>
                    <td className="p-2 text-center font-bold">{percent.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Summary label="Obtained" value={marksheet.obtained} />
          <Summary label="Total" value={marksheet.total} />
          <Summary label="Percentage" value={`${marksheet.percentage.toFixed(2)}%`} />
          <Summary label="Status" value={marksheet.status} />
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-[10px] font-black uppercase text-amber-700">Remarks</p>
          <p className="mt-1 text-sm font-black text-slate-900">{marksheet.remarks}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 items-end gap-6">
          <div>
            <div className="h-14">
              {principalSignature && <img src={principalSignature} alt="Principal signature" className="h-full max-w-[180px] object-contain" />}
            </div>
            <div className="border-t border-slate-500 pt-1 text-xs font-black text-slate-700">Principal Signature</div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-500">Powered by</p>
            <p className="text-base font-black text-slate-950">{POWERED_BY_BRAND}</p>
            <p className="text-[10px] font-semibold text-slate-500">www.hmtfinancialservices.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassResultTable({
  classResults,
  subjects,
  institutionName,
  examTitle,
  studentClass,
  resultDate,
  removeClassResult,
  printResultSection,
  downloadClassResultCsv,
}) {
  const subjectNames = subjects.map((item) => item.name || "Subject");

  return (
    <div className="class-result-print rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-blue-700">Complete Class Result</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">{institutionName || "School / Madrasa Name"}</h3>
          <p className="text-xs font-semibold text-slate-500">
            {examTitle || "Result"} {studentClass ? `- Class ${studentClass}` : ""} {resultDate ? `- ${resultDate}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => printResultSection("class")}
            disabled={classResults.length === 0}
            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-black disabled:bg-slate-300"
          >
            Print Complete PDF
          </button>
          <button
            type="button"
            onClick={downloadClassResultCsv}
            disabled={classResults.length === 0}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 disabled:bg-slate-300"
          >
            Download Complete Excel CSV
          </button>
        </div>
      </div>

      {classResults.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-center text-xs font-semibold text-slate-400">
          Add students one by one to create a complete class result table.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="p-2">Roll No</th>
                <th className="p-2">Student Name</th>
                {subjectNames.map((subject, index) => (
                  <th key={`${subject}-${index}`} className="p-2 text-center">{subject}</th>
                ))}
                <th className="p-2 text-center">Obtained</th>
                <th className="p-2 text-center">Total</th>
                <th className="p-2 text-center">%</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2">Remarks</th>
                <th className="p-2 text-center no-print-control">Action</th>
              </tr>
            </thead>
            <tbody>
              {classResults.map((student) => (
                <tr key={student.id} className="border-b border-slate-200 odd:bg-white even:bg-slate-50">
                  <td className="p-2 font-bold text-blue-700">{student.studentRollNo || "N/A"}</td>
                  <td className="p-2 font-black text-slate-900">{student.studentName}</td>
                  {subjectNames.map((_, index) => (
                    <td key={index} className="p-2 text-center font-bold">{student.subjects[index]?.marks || "0"}</td>
                  ))}
                  <td className="p-2 text-center font-black">{student.obtained}</td>
                  <td className="p-2 text-center font-black">{student.total}</td>
                  <td className="p-2 text-center font-black">{student.percentage.toFixed(2)}%</td>
                  <td className="p-2 text-center font-black">{student.status}</td>
                  <td className="p-2 font-semibold text-slate-700">{student.remarks}</td>
                  <td className="p-2 text-center no-print-control">
                    <button
                      type="button"
                      onClick={() => removeClassResult(student.id)}
                      className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-black text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-end justify-between gap-3 border-t pt-3">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Principal Signature</p>
              <div className="mt-8 w-44 border-t border-slate-500" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-500">Powered by</p>
              <p className="text-sm font-black text-slate-950">{POWERED_BY_BRAND}</p>
              <p className="text-[10px] font-semibold text-slate-500">www.hmtfinancialservices.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
      <p className="font-black text-slate-900">{value}</p>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3 text-center">
      <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}
