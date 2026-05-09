"use client";

import { useEffect, useState, useRef } from "react";

export default function HMTFinancialServices() {

  const [clients, setClients] = useState(0);
  const [projects, setProjects] = useState(0);
  const [reports, setReports] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [language, setLanguage] = useState("English");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    country: "",
    service: "",
    requirements: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {

    let c = 0;
    let p = 0;
    let r = 0;

    const interval = setInterval(() => {

      if (c < 100) {
        c++;
        setClients(c);
      }

      if (p < 250) {
        p += 2;
        setProjects(p);
      }

      if (r < 500) {
        r += 5;
        setReports(r);
      }

    }, 20);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    if (selectedService && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setFormData(prev => ({...prev, service: selectedService}));
    }
  }, [selectedService]);

  function handleBookService(serviceTitle) {
    setSelectedService(serviceTitle);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowPopup(true);
  }

  function closePopup() {
    setShowPopup(false);
  }

  const services = [
    {
      title: "Bookkeeping",
      desc: "Professional bookkeeping services for accurate financial records.",
      image: "/bookkeeping.jpg",
    },
    {
      title: "Financial Reports",
      desc: "Detailed reports for smarter business decisions.",
      image: "/financial Report.jpg",
    },
    {
      title: "Excel Automation",
      desc: "Advanced Excel automation systems and dashboards.",
      image: "/Excel Automation.jpg",
    },
    {
      title: "Bank Reconciliation",
      desc: "Accurate bank reconciliation services to match your accounts and cash flow.",
      image: "/Bank Reconciliation.png",
    },
    {
      title: "Receivable & Payable Management",
      desc: "Efficient management of accounts receivable and payable for better cash flow.",
      image: "/Recceivable and payable.png",
    },
    {
      title: "Payroll Management",
      desc: "Reliable payroll and salary handling services.",
      image: "/Pay Roll Management.png",
    },
    {
      title: "ERP Management",
      desc: "ERP accounting systems and business solutions.",
      image: "/ERP Management.jpg",
    },
    {
      title: "Data Entry",
      desc: "Fast and accurate financial data entry services.",
      image: "/Data Entry.jpg",
    },
  ];

  const businessTypes = [
    "Retail",
    "Manufacturing",
    "Services",
    "E-commerce",
    "Consultancy",
    "Finance",
    "Technology",
    "Healthcare",
    "Hospitality",
    "Education",
    "Construction",
    "Other",
  ];

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Brazzaville)",
    "Congo (Kinshasa)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "Urdu",
    "Arabic",
  ];

  const translations = {
    English: {
      home: "Home",
      services: "Services",
      about: "About",
      consultancy: "Consultancy",
      contact: "Contact",
      bookConsultancy: "Book Consultancy",
      ourServices: "Our Services",
      servicesDescription: "Professional financial solutions for your business.",
      aboutLabel: "About HMT",
      aboutHeading: "Trusted Financial Experts",
      aboutText1: "HMT Financial Services provides bookkeeping, ERP management, payroll handling, reporting and consultancy solutions.",
      aboutText2: "We help businesses stay organized, compliant and growth focused through modern financial systems.",
      consultancyRequest: "Consultancy Request",
      consultancyHeading: "Book Consultancy",
      consultancyCopy: "Share your requirements and our financial experts will reach out with a customised plan that fits your business.",
      formHeading: "Let’s shape your financial future.",
      formCopy: "Complete the form and we’ll get back to you with a practical, secure financial solution designed for your needs.",
      selectBusinessType: "Select Business Type",
      selectCountry: "Select Country",
      selectService: "Select a Service",
      describeRequirements: "Describe Your Requirements",
      submitRequest: "Submit Consultancy Request",
      quickSupport: "Quick Support",
      needAssistance: "Need assistance now?",
      supportText: "Our expert team is ready to help with bookkeeping, payroll, ERP, reporting and automation for growing businesses.",
      serviceBadge: "Service",
      bookThisService: "Book This Service",
      processLabel: "How it Works",
      processHeading: "A simple process to start your financial journey",
      processCopy: "From planning to delivery, our financial services are structured for clarity and confidence.",
      processStep1: "Discovery & Planning",
      processStep1Desc: "We assess your business, goals and existing financial systems.",
      processStep2: "Setup & Implementation",
      processStep2Desc: "We deploy accurate bookkeeping, reconciliation and reporting systems.",
      processStep3: "Review & Support",
      processStep3Desc: "You get ongoing reports, updates and expert support.",
      testimonialLabel: "Client Success",
      testimonialHeading: "Trusted by growing businesses",
      faqLabel: "Frequently Asked Questions",
      faqHeading: "Answers that help you decide",
      faqCopy: "Everything you need to know before you request consultancy or financial services.",
      testimonial1: "HMT's financial services helped us streamline our operations and improve our SEO-driven marketing results. Professional and reliable team.",
      testimonial2: "We now have clear cash flow visibility and reliable payroll support. Highly recommended.",
      testimonial3: "The consultancy process was organized, professional and very helpful for our business planning.",
      faq1Question: "How soon can I start?",
      faq1Answer: "You can get started as soon as we review your requirements and agree on a plan.",
      faq2Question: "Do you support small businesses?",
      faq2Answer: "Yes, we work with startups, SMEs and growing companies across multiple industries.",
      faq3Question: "Is my financial data safe?",
      faq3Answer: "Absolutely. We follow strict confidentiality and secure reporting practices.",
      faq4Question: "Do you offer ongoing support?",
      faq4Answer: "Yes, we provide continued support, regular updates and follow-up consultancy.",
      contactHeading: "Ready to grow with better finance",
      contactCopy: "Get in touch today for a free consultation and tailored financial support.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      whatsappCTA: "Chat on WhatsApp",
      language: "Language",
    },
    Spanish: {
      home: "Inicio",
      services: "Servicios",
      about: "Acerca de",
      consultancy: "Consultoría",
      contact: "Contacto",
      bookConsultancy: "Reservar Consultoría",
      ourServices: "Nuestros Servicios",
      servicesDescription: "Soluciones financieras profesionales para su negocio.",
      aboutLabel: "Acerca de HMT",
      aboutHeading: "Expertos financieros de confianza",
      aboutText1: "HMT Financial Services proporciona servicios de contabilidad, gestión ERP, nómina, informes y consultoría.",
      aboutText2: "Ayudamos a las empresas a mantenerse organizadas, conformes y enfocadas en el crecimiento a través de sistemas financieros modernos.",
      consultancyRequest: "Solicitud de Consultoría",
      consultancyHeading: "Reservar Consultoría",
      consultancyCopy: "Comparta sus requisitos y nuestros expertos financieros se comunicarán con un plan personalizado que se adapte a su negocio.",
      formHeading: "Demos forma a su futuro financiero.",
      formCopy: "Complete el formulario y nos pondremos en contacto con una solución financiera práctica y segura diseñada para sus necesidades.",
      selectBusinessType: "Seleccione tipo de negocio",
      selectCountry: "Seleccione país",
      selectService: "Seleccione un servicio",
      describeRequirements: "Describa sus requisitos",
      submitRequest: "Enviar solicitud de consultoría",
      quickSupport: "Soporte rápido",
      needAssistance: "¿Necesita ayuda ahora?",
      supportText: "Nuestro equipo experto está listo para ayudar con contabilidad, nómina, ERP, informes y automatización para empresas en crecimiento.",
      serviceBadge: "Servicio",
      bookThisService: "Reservar este servicio",
      processLabel: "Cómo funciona",
      processHeading: "Un proceso simple para iniciar su camino financiero",
      processCopy: "Desde la planificación hasta la entrega, nuestros servicios financieros están estructurados para claridad y confianza.",
      processStep1: "Descubrimiento y planificación",
      processStep1Desc: "Evaluamos su negocio, objetivos y sistemas financieros existentes.",
      processStep2: "Configuración e implementación",
      processStep2Desc: "Implementamos sistemas precisos de contabilidad, conciliación e informes.",
      processStep3: "Revisión y soporte",
      processStep3Desc: "Recibe informes continuos, actualizaciones y soporte experto.",
      testimonialLabel: "Éxitos de clientes",
      testimonialHeading: "Confiado por empresas en crecimiento",
      faqLabel: "Preguntas frecuentes",
      faqHeading: "Respuestas que te ayudan a decidir",
      faqCopy: "Todo lo que necesita saber antes de solicitar consultoría o servicios financieros.",
      testimonial1: "Los servicios financieros de HMT nos ayudaron a optimizar nuestras operaciones y mejorar nuestros resultados de marketing impulsados por SEO. Equipo profesional y confiable.",
      testimonial2: "Ahora tenemos una visibilidad clara del flujo de efectivo y soporte confiable para nómina. Muy recomendado.",
      testimonial3: "El proceso de consultoría fue organizado, profesional y muy útil para nuestra planificación empresarial.",
      faq1Question: "¿Qué tan pronto puedo comenzar?",
      faq1Answer: "Puede comenzar tan pronto como revisemos sus requisitos y acordemos un plan.",
      faq2Question: "¿Apoyan a pequeñas empresas?",
      faq2Answer: "Sí, trabajamos con startups, pymes y empresas en crecimiento en múltiples industrias.",
      faq3Question: "¿Mi información financiera está segura?",
      faq3Answer: "Absolutamente. Seguimos prácticas estrictas de confidencialidad e informes seguros.",
      faq4Question: "¿Ofrecen soporte continuo?",
      faq4Answer: "Sí, brindamos soporte continuo, actualizaciones regulares y consultoría de seguimiento.",
      contactHeading: "Listo para crecer con mejores finanzas",
      contactCopy: "Póngase en contacto hoy para una consulta gratuita y apoyo financiero personalizado.",
      emailLabel: "Correo electrónico",
      phoneLabel: "Teléfono",
      whatsappCTA: "Chatear en WhatsApp",
      language: "Idioma",
    },
    French: {
      home: "Accueil",
      services: "Services",
      about: "À propos",
      consultancy: "Conseil",
      contact: "Contact",
      bookConsultancy: "Réserver une consultation",
      ourServices: "Nos Services",
      servicesDescription: "Solutions financières professionnelles pour votre entreprise.",
      aboutLabel: "À propos de HMT",
      aboutHeading: "Experts financiers de confiance",
      aboutText1: "HMT Financial Services fournit des services de tenue de livres, de gestion ERP, de paie, de rapports et de conseil.",
      aboutText2: "Nous aidons les entreprises à rester organisées, conformes et axées sur la croissance grâce à des systèmes financiers modernes.",
      consultancyRequest: "Demande de conseil",
      consultancyHeading: "Réserver une consultation",
      consultancyCopy: "Partagez vos besoins et nos experts financiers vous contacteront avec un plan personnalisé adapté à votre entreprise.",
      formHeading: "Façonnons votre avenir financier.",
      formCopy: "Remplissez le formulaire et nous vous répondrons avec une solution financière pratique et sécurisée conçue pour vos besoins.",
      selectBusinessType: "Sélectionnez le type d'entreprise",
      selectCountry: "Sélectionnez un pays",
      selectService: "Sélectionnez un service",
      describeRequirements: "Décrivez vos exigences",
      submitRequest: "Envoyer la demande de conseil",
      quickSupport: "Support rapide",
      needAssistance: "Besoin d'aide maintenant ?",
      supportText: "Notre équipe d'experts est prête à aider avec la comptabilité, la paie, l'ERP, les rapports et l'automatisation pour les entreprises en croissance.",
      serviceBadge: "Service",
      bookThisService: "Réservez ce service",
      processLabel: "Comment ça marche",
      processHeading: "Un processus simple pour démarrer votre parcours financier",
      processCopy: "De la planification à la livraison, nos services financiers sont structurés pour la clarté et la confiance.",
      processStep1: "Découverte et planification",
      processStep2: "Configuration et mise en œuvre",
      processStep2Desc: "Nous déployons des systèmes précis de comptabilité, de rapprochement et de reporting.",
      processStep1Desc: "Nous évaluons votre entreprise, vos objectifs et vos systèmes financiers existants.",
      processStep3: "Révision et assistance",
      processStep3Desc: "Vous recevez des rapports continus, des mises à jour et un support expert.",
      testimonialLabel: "Succès des clients",
      testimonialHeading: "Adopté par des entreprises en croissance",
      faqLabel: "Questions fréquentes",
      faqHeading: "Des réponses pour vous aider à décider",
      faqCopy: "Tout ce que vous devez savoir avant de demander une consultation ou des services financiers.",
      testimonial1: "Les services financiers de HMT nous ont aidés à rationaliser nos opérations et à améliorer nos résultats de marketing axés sur le référencement. Équipe professionnelle et fiable.",
      testimonial2: "Nous avons maintenant une visibilité claire de la trésorerie et un support fiable de la paie. Fortement recommandé.",
      testimonial3: "Le processus de consultation était organisé, professionnel et très utile pour notre planification commerciale.",
      faq1Question: "Quand puis-je commencer ?",
      faq1Answer: "Vous pouvez commencer dès que nous examinons vos exigences et convenons d'un plan.",
      faq2Question: "Soutenez-vous les petites entreprises ?",
      faq2Answer: "Oui, nous travaillons avec des startups, des PME et des entreprises en croissance dans plusieurs secteurs.",
      faq3Question: "Mes données financières sont-elles sécurisées ?",
      faq3Answer: "Absolument. Nous suivons des pratiques strictes de confidentialité et de reporting sécurisé.",
      faq4Question: "Offrez-vous un support continu ?",
      faq4Answer: "Oui, nous fournissons un support continu, des mises à jour régulières et une consultation de suivi.",
      contactHeading: "Prêt à grandir avec de meilleures finances",
      contactCopy: "Contactez-nous dès aujourd'hui pour une consultation gratuite et un soutien financier personnalisé.",
      emailLabel: "E-mail",
      phoneLabel: "Téléphone",
      whatsappCTA: "Discuter sur WhatsApp",
      language: "Langue",
    },
    Urdu: {
      home: "ہوم",
      services: "خدمات",
      about: "ہمارے بارے میں",
      consultancy: "مشاورت",
      contact: "رابطہ",
      bookConsultancy: "مشاورت بک کریں",
      ourServices: "ہماری خدمات",
      servicesDescription: "آپ کے کاروبار کے لیے پیشہ ورانہ مالی حل۔",
      aboutLabel: "HMT کے بارے میں",
      aboutHeading: "قابل اعتماد مالی ماہرین",
      aboutText1: "HMT Financial Services کتابت، ERP مینجمنٹ، پے رول، رپورٹنگ اور مشاورت کے حل فراہم کرتا ہے۔",
      aboutText2: "ہم جدید مالی نظام کے ذریعے کاروبار کو منظم، مطابق اور ترقی پر مرکوز رکھنے میں مدد کرتے ہیں۔",
      consultancyRequest: "مشاورت کی درخواست",
      consultancyHeading: "مشاورت بک کریں",
      consultancyCopy: "اپنی ضروریات شیئر کریں اور ہمارے مالی ماہرین آپ کے کاروبار کے مطابق منصوبہ لے کر رابطہ کریں گے۔",
      formHeading: "آئیے آپ کے مالی مستقبل کو تشکیل دیں۔",
      formCopy: "فارم مکمل کریں اور ہم آپ کی ضروریات کے مطابق ایک عملی، محفوظ مالی حل کے ساتھ رابطہ کریں گے۔",
      selectBusinessType: "کاروبار کی قسم منتخب کریں",
      selectCountry: "ملک منتخب کریں",
      selectService: "ایک خدمت منتخب کریں",
      describeRequirements: "اپنی ضروریات بیان کریں",
      submitRequest: "مشاورت کی درخواست جمع کریں",
      quickSupport: "جلدی مدد",
      needAssistance: "اب مدد درکار ہے؟",
      supportText: "ہماری ماہر ٹیم بڑھتے کاروباروں کے لیے کتابت، پے رول، ERP، رپورٹنگ اور آٹومیشن میں مدد کے لیے تیار ہے۔",
      serviceBadge: "سروس",
      bookThisService: "اس سروس کو بک کریں",
      processLabel: "یہ کیسے کام کرتا ہے",
      processHeading: "اپنے مالی سفر کو شروع کرنے کا آسان طریقہ",
      processCopy: "منصوبہ بندی سے لے کر فراہمی تک، ہماری مالی خدمات وضاحت اور اعتماد کے لیے ترتیب دی گئی ہیں۔",
      processStep1: "دریافت اور منصوبہ بندی",
      processStep1Desc: "ہم آپ کے کاروبار، اہداف اور موجودہ مالی نظام کا جائزہ لیتے ہیں۔",
      processStep2: "سیٹ اپ اور نفاذ",
      processStep2Desc: "ہم دقیق کتابت، مصالحت اور رپورٹنگ سسٹم نافذ کرتے ہیں۔",
      processStep3: "جائزہ اور حمایت",
      processStep3Desc: "آپ کو جاری رپورٹس، اپڈیٹس اور ماہر سپورٹ ملتی ہے۔",
      testimonialLabel: "کلائنٹ کی کامیابیاں",
      testimonialHeading: "بڑھتے کاروباروں کا اعتماد",
      faqLabel: "اکثر پوچھے گئے سوالات",
      faqHeading: "جوابات جو آپ کو فیصلہ کرنے میں مدد دیتے ہیں",
      faqCopy: "مشاورت یا مالی خدمات کی درخواست کرنے سے پہلے آپ کو جو کچھ جاننے کی ضرورت ہے۔",
      testimonial1: "HMT کی مالی خدمات نے ہماری کارروائیوں کو ہموار کرنے اور ہمارے SEO سے چلنے والے مارکیٹنگ کے نتائج کو بہتر بنانے میں مدد کی۔ پیشہ ورانہ اور قابل بھروسہ ٹیم۔",
      testimonial2: "اب ہمارے پاس واضح کیش فلو نظر ہے اور پے رول کے لیے قابل بھروسہ سپورٹ ہے۔ انتہائی سفارش شدہ۔",
      testimonial3: "مشاورت کا عمل منظم، پیشہ ورانہ اور ہمارے کاروباری منصوبہ بندی کے لیے بہت مددگار تھا۔",
      faq1Question: "میں کتنی جلدی شروع کر سکتا ہوں؟",
      faq1Answer: "آپ جیسے ہی ہم آپ کی ضروریات کا جائزہ لیتے ہیں اور منصوبہ طے کرتے ہیں شروع کر سکتے ہیں۔",
      faq2Question: "کیا آپ چھوٹے کاروباروں کی حمایت کرتے ہیں؟",
      faq2Answer: "ہاں، ہم سٹارٹ اپس، SMEs اور متعدد صنعتوں میں بڑھتی کمپنیوں کے ساتھ کام کرتے ہیں۔",
      faq3Question: "کیا میرا مالی ڈیٹا محفوظ ہے؟",
      faq3Answer: "بالکل۔ ہم سخت رازداری اور محفوظ رپورٹنگ کے طریقوں پر عمل کرتے ہیں۔",
      faq4Question: "کیا آپ جاری سپورٹ فراہم کرتے ہیں؟",
      faq4Answer: "ہاں، ہم جاری سپورٹ، باقاعدہ اپڈیٹس اور فالو اپ مشاورت فراہم کرتے ہیں۔",
      contactHeading: "بہتر مالیات کے ساتھ بڑھنے کے لیے تیار",
      contactCopy: "آج ہی رابطہ کریں ایک مفت مشاورت اور حسب ضرورت مالی حمایت کے لیے۔",
      emailLabel: "ای میل",
      phoneLabel: "فون",
      whatsappCTA: "واٹس ایپ پر چیٹ کریں",
      language: "زبان",
    },
    Arabic: {
      home: "الصفحة الرئيسية",
      services: "الخدمات",
      about: "من نحن",
      consultancy: "الاستشارات",
      contact: "اتصل",
      bookConsultancy: "احجز استشارة",
      ourServices: "خدماتنا",
      servicesDescription: "حلول مالية احترافية لعملك.",
      aboutLabel: "حول HMT",
      aboutHeading: "خبراء ماليون موثوقون",
      aboutText1: "توفر HMT Financial Services خدمات مسك الدفاتر وإدارة ERP والرواتب والتقارير والاستشارات.",
      aboutText2: "نساعد الشركات على البقاء منظمة ومتوافقة ومركزة على النمو من خلال أنظمة مالية حديثة.",
      consultancyRequest: "طلب استشارة",
      consultancyHeading: "احجز استشارة",
      consultancyCopy: "شارك متطلباتك وسيتواصل خبراؤنا الماليون مع خطة مخصصة تناسب عملك.",
      formHeading: "لنُشكّل مستقبلك المالي.",
      formCopy: "أكمل النموذج وسنعود إليك بحل مالي عملي وآمن مصمم لاحتياجاتك.",
      selectBusinessType: "اختر نوع العمل",
      selectCountry: "اختر الدولة",
      selectService: "اختر خدمة",
      describeRequirements: "وصف متطلباتك",
      submitRequest: "إرسال طلب الاستشارة",
      quickSupport: "دعم سريع",
      needAssistance: "هل تحتاج مساعدة الآن؟",
      supportText: "فريقنا المختص جاهز لمساعدتك في مسك الدفاتر والرواتب وERP والتقارير والأتمتة للشركات النامية.",
      serviceBadge: "الخدمة",
      bookThisService: "احجز هذه الخدمة",
      processLabel: "كيف نعمل",
      processHeading: "عملية بسيطة لبدء مسارك المالي",
      processCopy: "من التخطيط إلى التسليم، خدماتنا المالية منضبطة للوضوح والثقة.",
      processStep1: "الاكتشاف والتخطيط",
      processStep1Desc: "نقوم بتقييم عملك وأهدافك وأنظمةك المالية الحالية.",
      processStep2: "الإعداد والتنفيذ",
      processStep2Desc: "نقوم بنشر أنظمة محاسبة ومطابقة وتقارير دقيقة.",
      processStep3: "المراجعة والدعم",
      processStep3Desc: "تحصل على تقارير مستمرة وتحديثات ودعم خبراء.",
      testimonialLabel: "نجاحات العملاء",
      testimonialHeading: "موثوق به من قبل الشركات النامية",
      faqLabel: "الأسئلة الشائعة",
      faqHeading: "إجابات تساعدك على اتخاذ القرار",
      faqCopy: "كل ما تحتاج لمعرفته قبل طلب الاستشارة أو الخدمات المالية.",
      testimonial1: "ساعدتنا خدمات HMT المالية في تبسيط عملياتنا وتحسين نتائج التسويق المدفوع بالكلمات الرئيسية. فريق محترف وموثوق.",
      testimonial2: "الآن لدينا رؤية واضحة للتدفق النقدي ودعم موثوق للرواتب. موصى به بشدة.",
      testimonial3: "كان عملية الاستشارة منظمة ومهنية ومفيدة للغاية لتخطيط أعمالنا.",
      faq1Question: "كم بسرعة يمكنني البدء؟",
      faq1Answer: "يمكنك البدء بمجرد مراجعة متطلباتك والاتفاق على خطة.",
      faq2Question: "هل تدعمون الشركات الصغيرة؟",
      faq2Answer: "نعم، نعمل مع الشركات الناشئة والشركات الصغيرة والمتوسطة والشركات النامية في عدة قطاعات.",
      faq3Question: "هل بياناتي المالية آمنة؟",
      faq3Answer: "بالتأكيد. نتبع ممارسات صارمة للسرية والتقارير الآمنة.",
      faq4Question: "هل تقدمون دعمًا مستمرًا؟",
      faq4Answer: "نعم، نقدم دعمًا مستمرًا وتحديثات منتظمة واستشارات متابعة.",
      contactHeading: "جاهز للنمو بتمويل أفضل",
      contactCopy: "تواصل اليوم للحصول على استشارة مجانية ودعم مالي مخصص.",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "الهاتف",
      whatsappCTA: "الدردشة على WhatsApp",
      language: "اللغة",
    },
  };

  const t = (key) => translations[language]?.[key] ?? key;

  const featureItems = [
    {
      label: "You Can Trust",
      subtitle: "Accuracy",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5l-4-4 1.06-1.06 2.94 2.94 5.44-5.44 1.06 1.06-6.5 6.5z",
    },
    {
      label: "We Ensure",
      subtitle: "Confidentiality",
      icon: "M12 1C8.13 1 5 4.13 5 8v4c0 1.1.9 2 2 2h1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-4h1c1.1 0 2-.9 2-2V8c0-3.87-3.13-7-7-7zm5 10H7V8c0-2.76 2.24-5 5-5s5 2.24 5 5v3z",
    },
    {
      label: "We Support",
      subtitle: "Growth",
      icon: "M4 17h3v-4h2v4h3V9h2v8h3v-6h2v6h3V5h-2v8h-3V7h-2v8h-3V9H9v8H6v-4H4v8z",
    },
    {
      label: "We Deliver",
      subtitle: "Success",
      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
    },
    {
      label: "100+ Happy Clients",
      subtitle: "Trusted by",
      icon: "M12 1.75L4.5 4.75v6.75c0 5.83 3.98 11.12 7.5 12.74 3.52-1.62 7.5-6.91 7.5-12.74V4.75L12 1.75zM10.5 13.25l-2.5-2.5 1.06-1.06 1.44 1.44 3.94-3.94 1.06 1.06-5 5z",
    },
    {
      label: "250+ Projects Delivered",
      subtitle: "Completed",
      icon: "M6 17h3v-7H6v7zm5 0h3V7h-3v10zm5 0h3V11h-3v6z",
    },
    {
      label: "500+ Financial Reports",
      subtitle: "Reports",
      icon: "M6 2h9l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm9 2v4h4M8 12l2 2 4-4M8 16h8",
    },
    {
      label: "Accurate Reports, Smart Decisions",
      subtitle: "Accuracy",
      icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 14.5l-4.5-4.5 1.4-1.4L11 13.7l5.1-5.1 1.4 1.4L11 16.5z",
    },
    {
      label: "On Time. Every Report.",
      subtitle: "Timing",
      icon: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm.5 5.5h-1v6l5.25 3.15.5-.86-4.75-2.79V7.5z",
    },
    {
      label: "Professional Team. Proven Results.",
      subtitle: "Expertise",
      icon: "M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.8l-5.81 3.05 1.1-6.47-4.7-4.58 6.5-.95L12 2.5z",
    },
  ];

  const processSteps = [
    { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z", title: "processStep1", desc: "processStep1Desc" },
    { icon: "M12 7V3m0 0l4 4m-4-4L8 7M5 12h14M5 12a7 7 0 0 0 14 0", title: "processStep2", desc: "processStep2Desc" },
    { icon: "M12 12l4 4m0-4l-4 4M12 2v4m0 12v4M4 12H8m8 0h4", title: "processStep3", desc: "processStep3Desc" },
  ];

  const testimonials = [
    { quote: "testimonial1", name: "M. Noman", role: "SEO at Bin Muhammad Tech" },
    { quote: "testimonial2", name: "Bilal K.", role: "Business Manager" },
    { quote: "testimonial3", name: "Sara N.", role: "Finance Head" },
  ];

  const faqs = [
    { q: "faq1Question", a: "faq1Answer" },
    { q: "faq2Question", a: "faq2Answer" },
    { q: "faq3Question", a: "faq3Answer" },
    { q: "faq4Question", a: "faq4Answer" },
  ];

  return (

    <div dir={language === "Arabic" ? "rtl" : "ltr"} className="bg-slate-50 text-slate-800 overflow-hidden">

      {/* Navbar */}
      <header className="bg-black/70 backdrop-blur-md sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

          {/* Logo */}
          <div className="bg-white/90 rounded-xl px-2 py-1 shadow-xl backdrop-blur-sm">

            <img
              src="/logo.png"
              alt="HMT Logo"
              className="h-10 w-auto object-contain"
            />

          </div>

          {/* Menu */}
          <nav className="hidden md:flex gap-8 text-white font-semibold text-lg">

            <a href="#home" className="hover:text-yellow-400 transition">
              {t("home")}
            </a>

            <a href="#services" className="hover:text-yellow-400 transition">
              {t("services")}
            </a>

            <a href="#about" className="hover:text-yellow-400 transition">
              {t("about")}
            </a>

            <a href="#consultancy" className="hover:text-yellow-400 transition">
              {t("consultancy")}
            </a>

            <a href="#contact" className="hover:text-yellow-400 transition">
              {t("contact")}
            </a>

          </nav>

          <div className="hidden md:flex items-center gap-3 text-white">
            <label className="sr-only" htmlFor="language-select">{t("language")}</label>
            <select
              id="language-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-2xl bg-slate-900/80 border border-white/20 px-4 py-2 text-sm text-white outline-none transition focus:border-yellow-400"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white">
                  {lang}
                </option>
              ))}
            </select>
          </div>

        </div>

      </header>

      {/* Top feature bar */}
      <section className="bg-white py-4 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="feature-marquee overflow-hidden">
            <div className="feature-track flex items-center gap-4">
              {[...featureItems, ...featureItems].map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex min-w-[280px] items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{item.subtitle}</p>
                    <p className="text-sm font-semibold leading-5 text-slate-950">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[calc(100vh-4rem)] flex items-center"
      >

        {/* Background Image */}
        <img
          src="/hero.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Buttons Only */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

          <div className="max-w-xl mt-56">

            <div className="flex flex-wrap gap-5">

              <a
                href="#consultancy"
                className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black hover:scale-105 transition duration-300 shadow-2xl"
              >
                {t("bookConsultancy")}
              </a>

              <a
                href="#services"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-black transition duration-300"
              >
                {t("ourServices")}
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-slate-400/20">
            <div className="absolute -left-10 top-1/4 h-32 w-32 rounded-full bg-yellow-400/20 blur-3xl"></div>
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-white/10 bg-white/5"></div>
            <div className="relative flex items-center justify-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300/15 text-yellow-300 shadow-lg shadow-yellow-300/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 2L4.5 5.5v6c0 5.25 3.75 10 7.5 11.5 3.75-1.5 7.5-6.25 7.5-11.5v-6L12 2zm0 2.1l5.5 2.45v5.95c0 4.29-3.01 8.36-5.5 9.85-2.49-1.49-5.5-5.56-5.5-9.85V7.45L12 4.1zM10 11.5l1.5 1.5 4-4 1.06 1.06L11.5 15 9 12.5 10 11.5z" />
                </svg>
              </span>
              <div className="text-left">
                <h2 className="text-4xl font-black text-yellow-300">
                  {clients}+
                </h2>
                <p className="text-base font-semibold text-slate-200">
                  Happy Clients
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950 p-8 text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-slate-400/20">
            <div className="absolute -right-10 bottom-8 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl"></div>
            <div className="absolute left-6 top-8 h-20 w-20 rounded-full border border-white/10 bg-white/5"></div>
            <div className="relative flex items-center justify-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-300 shadow-lg shadow-cyan-300/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M4 17h3v-7H4v7zm5 0h3V7H9v10zm5 0h3v-4h-3v4zm5 0h3v-9h-3v9z" />
                </svg>
              </span>
              <div className="text-left">
                <h2 className="text-4xl font-black text-cyan-300">
                  {projects}+
                </h2>
                <p className="text-base font-semibold text-slate-200">
                  Projects Completed
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl transition hover:-translate-y-1 hover:shadow-slate-400/20">
            <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-fuchsia-400/15 blur-3xl"></div>
            <div className="absolute right-8 top-10 h-20 w-20 rounded-full border border-white/10 bg-white/5"></div>
            <div className="relative flex items-center justify-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-300/15 text-fuchsia-300 shadow-lg shadow-fuchsia-300/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1zm9 3H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-1 12H7V8h10v10zm-5-8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" />
                </svg>
              </span>
              <div className="text-left">
                <h2 className="text-4xl font-black text-fuchsia-300">
                  {reports}+
                </h2>
                <p className="text-base font-semibold text-slate-200">
                  Financial Reports
                </p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Services */}
      <section
        id="services"
        className="py-24 bg-slate-100"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-black text-[#071739] mb-4">
              {t("ourServices")}
            </h2>

            <p className="text-lg text-slate-600">
              {t("servicesDescription")}
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {services.map((service, index) => (

              <div
                key={index}
                className="group overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-2xl transition duration-500 hover:-translate-y-2 hover:shadow-blue-300/30"
              >

                <div className="overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-8">
                  <span className="inline-flex rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                    {t("serviceBadge")}
                  </span>

                  <h3 className="mt-4 text-2xl font-black text-slate-950 mb-4">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {service.desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleBookService(service.title)}
                    className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition duration-300 hover:bg-yellow-500 hover:-translate-y-0.5"
                  >
                    {t("bookThisService")}
                  </button>
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-4">
            {t("processLabel")}
          </p>
          <h2 className="text-5xl font-black text-[#071739]">
            {t("processHeading")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {t("processCopy")}
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={index} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-left shadow-2xl transition hover:-translate-y-1">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-yellow-400/10 text-yellow-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                  <path d={step.icon} />
                </svg>
              </span>
              <h3 className="mt-6 text-2xl font-black text-slate-950">
                {t(step.title)}
              </h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {t(step.desc)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Hidden for now */}
      {/*
      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-4">
            {t("testimonialLabel")}
          </p>
          <h2 className="text-5xl font-black text-[#071739]">
            {t("testimonialHeading")}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div key={index} className="rounded-[2rem] bg-white p-8 shadow-2xl">
              <p className="text-slate-600 leading-relaxed">
                “{t(item.quote)}”
              </p>
              <div className="mt-8">
                <p className="text-lg font-semibold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-4">
            {t("faqLabel")}
          </p>
          <h2 className="text-5xl font-black text-[#071739]">
            {t("faqHeading")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {t("faqCopy")}
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid gap-4">
          {faqs.map((item, index) => (
            <details key={index} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <summary className="cursor-pointer text-xl font-semibold text-slate-950 list-none">
                {t(item.q)}
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {t(item.a)}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-24 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>

            <img
              src="/about.jpg"
              alt="About"
              className="rounded-3xl shadow-2xl"
            />

          </div>

          <div>

            <p className="uppercase tracking-[6px] text-yellow-500 font-bold mb-4">
              {t("aboutLabel")}
            </p>

            <h2 className="text-5xl font-black text-[#071739] mb-6">
              {t("aboutHeading")}
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {t("aboutText1")}
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t("aboutText2")}
            </p>

          </div>

        </div>

      </section>

      {/* Consultancy Form */}
      <section
        id="consultancy"
        className="py-24 bg-[#071739] text-white"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-4">
              {t("consultancyRequest")}
            </p>

            <h2 className="text-5xl font-black mb-5">
              {t("consultancyHeading")}
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              {t("consultancyCopy")}
            </p>

          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

              <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-yellow-400/20 via-white/10 to-slate-200/10 p-6 shadow-inner">
                <h3 className="text-3xl font-black text-white mb-3">
                  {t("formHeading")}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {t("formCopy")}
                </p>
              </div>

              <form ref={formRef} className="grid gap-6" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="consult-name">Your Name</label>
                <input
                  id="consult-name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                />

                <label className="sr-only" htmlFor="consult-email">Your Email</label>
                <input
                  id="consult-email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                />

                <label className="sr-only" htmlFor="consult-phone">Phone Number</label>
                <input
                  id="consult-phone"
                  name="phone"
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                />

                <label className="sr-only" htmlFor="consult-business">Business Type</label>
                <select
                  id="consult-business"
                  name="business"
                  value={formData.business}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                >
                  <option value="">{t("selectBusinessType")}</option>
                  {businessTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="consult-country">Country</label>
                <select
                  id="consult-country"
                  name="country"
                  value={formData.country}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                >
                  <option value="">{t("selectCountry")}</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="consult-service">Service Required</label>
                <select
                  id="consult-service"
                  name="service"
                  value={formData.service}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                >
                  <option value="">{t("selectService")}</option>
                  {services.map((service, index) => (
                    <option key={index} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>

                <label className="sr-only" htmlFor="consult-details">Describe Your Requirements</label>
                <textarea
                  id="consult-details"
                  name="requirements"
                  rows="6"
                  placeholder={t("describeRequirements")}
                  value={formData.requirements}
                  onChange={handleFormChange}
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                ></textarea>

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-yellow-400 px-6 py-4 text-base font-black uppercase tracking-[0.08em] text-black shadow-2xl shadow-yellow-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-500"
                >
                  {t("submitRequest")}
                </button>
              </form>

            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-3">
                    {t("quickSupport")}
                  </p>
                  <h3 className="text-3xl font-black text-white">
                    {t("needAssistance")}
                  </h3>
                  <p className="mt-4 text-slate-300 leading-relaxed">
                    {t("supportText")}
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Response time</p>
                    <p className="mt-2 text-xl font-semibold text-white">Within 24 hours</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Personalised plan</p>
                    <p className="mt-2 text-xl font-semibold text-white">Tailored business support</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Trusted service</p>
                    <p className="mt-2 text-xl font-semibold text-white">Secure, accurate financial advice</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-300">
                  <p className="font-semibold text-white">Tip</p>
                  <p className="mt-2 text-sm leading-relaxed">
                    Click any service card above to auto-fill the “Services Needed” field before submitting your request.
                  </p>
                </div>
              </div>
            </aside>

          </div>

        </div>

      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-20 bg-black text-white"
      >

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-black mb-6">
            {t("contactHeading")}
          </h2>

          <p className="text-lg text-slate-300 mb-10">
            {t("contactCopy")}
          </p>

          <div className="flex flex-col gap-6 text-lg">

            <p>
              📧 {t("emailLabel")}: m.tufail4484@gmail.com
            </p>

            <p>
              📱 {t("phoneLabel")}: +92 342 2981356
            </p>

            <a
              href="https://wa.me/923422981356"
              className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition duration-300"
            >
              {t("whatsappCTA")}
            </a>

          </div>

        </div>

      </section>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 px-8 py-10 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-3">
                  Request Sent
                </p>
                <h2 className="text-4xl font-black text-white mb-4">
                  Thank you, {formData.name || "Customer"}!
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Your request for <span className="font-semibold text-yellow-300">{selectedService || "Consultancy"}</span> has been received. Our team will contact you shortly to confirm the details.
                </p>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Close
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">Requested service</p>
                <p className="mt-2 text-lg font-semibold text-white">{selectedService || "Consultancy"}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">Name</p>
                <p className="mt-2 text-lg font-semibold text-white">{formData.name || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/923422981356"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl text-lg font-bold hover:scale-110 transition duration-300 z-50"
      >
        WhatsApp
      </a>

      {/* Footer */}
      <footer className="bg-[#071739] text-slate-400 text-center py-6 text-sm">

        © 2026 HMT Financial Services. All Rights Reserved.

      </footer>

    </div>

  );
}