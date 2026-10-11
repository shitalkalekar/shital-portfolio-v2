import { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Download, ArrowUp } from "lucide-react";

// Social Icons as clean SVGs
const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.4a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2a5.4 5.4 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 4.9 3 6.1 6 6.4a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 21c-3 1-4-2-4-2"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// Easily editable footer data
const footerData = {
  brand: {
    name: "Shital Kalekar",
    tagline: "Full Stack Developer building modern web applications with React.js, Node.js, MongoDB and AI technologies.",
  },
  quickLinks: [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ],
  contact: {
    email: "shital@example.com",
    location: "Pune, India",
    resumeUrl: "/resume.pdf",
  },
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(root.classList.contains("dark"));
        }
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#7C6CFB] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#7C6CFB] dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative h-4 w-4 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 h-4 w-4 text-gray-500 group-hover:text-[#7C6CFB] transition-transform duration-500 ${
            isDark ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 h-4 w-4 text-gray-400 group-hover:text-[#7C6CFB] transition-transform duration-500 ${
            isDark ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
};

const Footer = ({ profile }) => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const fullName = profile?.name || footerData.brand.name;
  const emailAddress = profile?.email || footerData.contact.email;
  const githubUrl = profile?.githubUrl || "https://github.com";
  const linkedinUrl = profile?.linkedinUrl || "https://linkedin.com";
  const resumeLink = profile?.resumeUrl || footerData.contact.resumeUrl;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-white dark:bg-[#0f111a] py-8 sm:py-10"
    >
      {/* Top thin blue-to-purple gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#7C6CFB] to-transparent"></div>

      {/* Soft blurred gradient glow in corner */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tl from-[#7C6CFB]/15 to-[#4F8CFF]/10 blur-[80px] dark:from-[#7C6CFB]/20 dark:to-[#4F8CFF]/15"></div>
      <div className="pointer-events-none absolute left-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#7C6CFB]/5 blur-[70px] dark:bg-[#7C6CFB]/10"></div>

      <div
        className={`relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* THREE-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 text-center md:text-left items-start pb-8">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col items-center md:items-start">
            <a
              href="#hero"
              className="inline-block text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white focus:outline-none rounded-md"
            >
              {fullName}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF]">
                .
              </span>
            </a>

            <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-sm">
              {profile?.about ? `${profile.about.slice(0, 110)}...` : footerData.brand.tagline}
            </p>

            {/* Circular Social Buttons with Lift and Glow */}
            <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7C6CFB] hover:text-[#7C6CFB] hover:shadow-lg hover:shadow-[#7C6CFB]/25 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:border-[#7C6CFB] dark:hover:text-white"
              >
                <GithubIcon size={17} />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7C6CFB] hover:text-[#7C6CFB] hover:shadow-lg hover:shadow-[#7C6CFB]/25 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:border-[#7C6CFB] dark:hover:text-white"
              >
                <LinkedinIcon size={17} />
              </a>

              <a
                href={`mailto:${emailAddress}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7C6CFB] hover:text-[#7C6CFB] hover:shadow-lg hover:shadow-[#7C6CFB]/25 dark:border-gray-800 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:border-[#7C6CFB] dark:hover:text-white"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Quick Links
            </h4>

            <ul className="mt-3 space-y-2">
              {footerData.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group relative inline-block text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-[#7C6CFB] dark:hover:text-[#A58AEF]"
                  >
                    {link.name}
                    {/* Sliding underline hover effect */}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF] transition-all duration-300 ease-out group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Contact
            </h4>

            <ul className="mt-3 space-y-2.5 text-sm text-gray-600 dark:text-gray-400 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7C6CFB]/10 text-[#7C6CFB] dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
                  <Mail size={14} />
                </span>
                <a
                  href={`mailto:${emailAddress}`}
                  className="hover:text-[#7C6CFB] dark:hover:text-[#A58AEF] transition-colors break-all"
                >
                  {emailAddress}
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7C6CFB]/10 text-[#7C6CFB] dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
                  <MapPin size={14} />
                </span>
                <span>{footerData.contact.location}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7C6CFB]/10 text-[#7C6CFB] dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
                  <Download size={14} />
                </span>
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#7C6CFB] dark:text-[#A58AEF] hover:underline"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-gray-200/80 pt-6 sm:flex-row dark:border-gray-800">
          {/* Left: Copyright & built note */}
          <div className="flex flex-col items-center gap-0.5 text-center sm:items-start sm:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {fullName}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Built with React, Vite & Tailwind
            </p>
          </div>

          {/* Right: Theme Toggle, Admin link & Back to top button */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Theme
            </span>
            <ThemeToggle />

            <a
              href="/admin-login"
              className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors px-1"
            >
              Admin
            </a>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              title="Back to top"
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:border-[#7C6CFB] hover:bg-gradient-to-r hover:from-[#7C6CFB] hover:to-[#4F8CFF] hover:text-white hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#7C6CFB] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <ArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

