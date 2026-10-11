
import { useState } from "react";

const Navbar = ({ profile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fullName = profile?.name || "Shital Kalekar";

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-[#0f111a]/95">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Dynamic Logo */}
        <a
          href="#hero"
          onClick={handleNavClick}
          className="shrink-0 text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-purple-600 sm:text-xl dark:text-white dark:hover:text-[#A58AEF]"
        >
          {fullName}
          <span className="text-purple-600">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-[#1a1528] dark:hover:text-[#A58AEF]"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Contact Button - Desktop */}
        <a
          href="#contact"
          className="hidden rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-purple-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 lg:inline-flex"
        >
          Let's Talk
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-100 bg-white lg:hidden dark:border-gray-800 dark:bg-[#0f111a]"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-[#1a1528] dark:hover:text-[#A58AEF]"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <a
              href="#contact"
              onClick={handleNavClick}
              className="mt-3 flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-4 py-3 text-sm font-semibold text-white transition-colors hover:from-purple-700 hover:to-purple-500"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
