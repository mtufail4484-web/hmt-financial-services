import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 🔗 Navigation ke liye Link import kiya
import Link from "next/link"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HMT Financial and Digital Services",
  description:
    "Professional Accounting, ERP, Website & Mobile App Development Services",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "982W_dh6Z4IVJl5yVg82LZh_OqGq3SRzZiG1K_Tyapk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black m-0 p-0">
        
        {/* 🌐 PROFESSIONAL TOP NAVIGATION BAR */}
        <header style={{
          width: "100%",
          background: "#0b2c5f", // HMT Blue Theme Color
          padding: "12px 24px",
          boxSet: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box"
        }}>
          {/* Logo / Brand Name */}
          <Link href="/" style={{ 
            color: "white", 
            textDecoration: "none", 
            fontWeight: "bold", 
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <img src="/logo.png" alt="HMT Logo" style={{ height: "30px", width: "auto" }} />
            <span>HMT Services</span>
          </Link>

          {/* Navigation Links & Portal Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/computer-course" style={{ color: "white", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              💻 Computer Course
            </Link>
            
            {/* 🔑 MAIN STUDENT PORTAL LOGIN BUTTON */}
            <Link 
              href="/portal" 
              style={{
                background: "#28a745", // Green color for high visibility
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                transition: "background 0.2s"
              }}
            >
              🎓 Student Portal
            </Link>
          </div>
        </header>

        {/* Website ka baqi content yahan load hoga */}
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}