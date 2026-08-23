"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/computer-course", label: "Computer Course" },
  { href: "/tools", label: "Free Tools" },
  { href: "/verify", label: "Verify Student" },
  { href: "/portal", label: "Student Portal", featured: true },
];

const isActiveRoute = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#0b2c5f] text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center justify-center gap-2 text-base font-black sm:justify-start sm:text-lg"
          aria-label="HMT Services home"
        >
          <img src="/logo.png" alt="HMT Financial and Digital Services logo" className="h-8 w-auto shrink-0" />
          <span className="truncate">HMT Services</span>
        </Link>

        <nav aria-label="Main navigation" className="grid grid-cols-2 gap-2 text-center text-[12px] font-bold sm:flex sm:items-center sm:gap-2 sm:text-sm">
          {navLinks.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            const activeClass = link.featured
              ? "bg-green-500 text-white shadow-lg shadow-green-950/20"
              : "bg-white text-[#0b2c5f] shadow-sm";
            const idleClass = link.featured
              ? "bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-500"
              : "bg-white/10 text-white hover:bg-white/20 sm:bg-transparent";

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-2 py-2 leading-tight transition ${active ? activeClass : idleClass} ${link.featured ? "sm:px-4" : "sm:px-3"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
