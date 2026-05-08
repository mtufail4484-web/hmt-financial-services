"use client";

import { useEffect, useState, useRef } from "react";

export default function HMTFinancialServices() {

  const [clients, setClients] = useState(0);
  const [projects, setProjects] = useState(0);
  const [reports, setReports] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
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

  return (

    <div className="bg-slate-50 text-slate-800 overflow-hidden">

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
              Home
            </a>

            <a href="#services" className="hover:text-yellow-400 transition">
              Services
            </a>

            <a href="#about" className="hover:text-yellow-400 transition">
              About
            </a>

            <a href="#consultancy" className="hover:text-yellow-400 transition">
              Consultancy
            </a>

            <a href="#contact" className="hover:text-yellow-400 transition">
              Contact
            </a>

          </nav>

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
                Book Consultancy
              </a>

              <a
                href="#services"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-black transition duration-300"
              >
                Our Services
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
              Our Services
            </h2>

            <p className="text-lg text-slate-600">
              Professional financial solutions for your business.
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
                    Service
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
                    Book This Service
                  </button>
                </div>

              </div>

            ))}

          </div>

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
              About HMT
            </p>

            <h2 className="text-5xl font-black text-[#071739] mb-6">
              Trusted Financial Experts
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              HMT Financial Services provides bookkeeping,
              ERP management, payroll handling,
              reporting and consultancy solutions.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              We help businesses stay organized,
              compliant and growth focused through modern financial systems.
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
              Consultancy Request
            </p>

            <h2 className="text-5xl font-black mb-5">
              Book Consultancy
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Share your requirements and our financial experts will reach out with a customised plan that fits your business.
            </p>

          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

              <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-yellow-400/20 via-white/10 to-slate-200/10 p-6 shadow-inner">
                <h3 className="text-3xl font-black text-white mb-3">
                  Let’s shape your financial future.
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Complete the form and we’ll get back to you with a practical, secure financial solution designed for your needs.
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
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                />

                <label className="sr-only" htmlFor="consult-business">Business Type</label>
                <input
                  id="consult-business"
                  name="business"
                  type="text"
                  placeholder="Business Type"
                  value={formData.business}
                  onChange={handleFormChange}
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                />

                <label className="sr-only" htmlFor="consult-service">Services Needed</label>
                <input
                  id="consult-service"
                  type="text"
                  value={selectedService || ""}
                  readOnly
                  placeholder="Services Needed"
                  className="w-full rounded-3xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-4 text-slate-100 shadow-inner outline-none transition focus:border-yellow-300"
                />

                <label className="sr-only" htmlFor="consult-details">Describe Your Requirements</label>
                <textarea
                  id="consult-details"
                  name="requirements"
                  rows="6"
                  placeholder="Describe Your Requirements"
                  value={formData.requirements}
                  onChange={handleFormChange}
                  className="w-full rounded-3xl border border-white/15 bg-slate-950/80 px-5 py-4 text-slate-100 shadow-lg shadow-black/10 outline-none transition focus:border-yellow-400 focus:bg-slate-900"
                ></textarea>

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-yellow-400 px-6 py-4 text-base font-black uppercase tracking-[0.08em] text-black shadow-2xl shadow-yellow-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-500"
                >
                  Submit Consultancy Request
                </button>
              </form>

            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-3">
                    Quick Support
                  </p>
                  <h3 className="text-3xl font-black text-white">
                    Need assistance now?
                  </h3>
                  <p className="mt-4 text-slate-300 leading-relaxed">
                    Our expert team is ready to help with bookkeeping, payroll, ERP, reporting and automation for growing businesses.
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
            Contact Us
          </h2>

          <p className="text-lg text-slate-300 mb-10">
            Professional Financial Solutions For Your Business.
          </p>

          <div className="flex flex-col gap-6 text-lg">

            <p>
              📧 m.tufail4484@gmail.com
            </p>

            <p>
              📱 +92 342 2981356
            </p>

            <a
              href="https://wa.me/923422981356"
              className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black inline-block hover:scale-105 transition duration-300"
            >
              Chat on WhatsApp
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