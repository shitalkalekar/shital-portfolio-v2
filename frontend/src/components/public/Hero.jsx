import { useEffect, useRef, useState } from "react";
import { Mail, Download, ArrowRight, Code, Database, Terminal, Cpu, ChevronDown } from "lucide-react";
import { statsData } from "../../constants/stats.js";
import { AnimatedStatValue } from "./AnimatedStatValue.jsx";

// Inline icons for Github and Linkedin since lucide-react removed them
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.4a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2a5.4 5.4 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 4.9 3 6.1 6 6.4a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 21c-3 1-4-2-4-2"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Typewriter = ({ strings }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullText = strings[currentStringIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }, 80);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentStringIndex((prev) => (prev + 1) % strings.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentStringIndex, strings]);

  return (
    <span className="inline-block min-w-[20px] text-gray-500 dark:text-gray-400 font-medium">
      {currentText}
      <span className="ml-0.5 animate-pulse border-r-2 border-[#7C6CFB]"></span>
    </span>
  );
};

// Data
const heroData = {
  roles: ["Full Stack Developer", "MERN Stack Engineer", "AI/ML Enthusiast"],
  intro: "Combining full-stack development with AI knowledge to build products that are smart, scalable, and user-friendly.",
  stats: statsData,
  techChips: [
    { name: "React", icon: Code },
    { name: "Node.js", icon: Terminal },
    { name: "MongoDB", icon: Database },
    { name: "Python", icon: Cpu }
  ]
};

const Hero = ({ profile }) => {
  return (
    <section id="hero" className="relative min-h-screen w-full bg-white dark:bg-[#0f111a] pt-28 pb-20 overflow-hidden flex flex-col justify-center">
      
      {/* Background Dots & Blobs */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#7C6CFB]/10 blur-[120px] dark:bg-[#7C6CFB]/20 pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#4F8CFF]/10 blur-[120px] dark:bg-[#4F8CFF]/20 pointer-events-none -translate-x-1/3 translate-y-1/4"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Content (Text) */}
          <div className="order-last lg:order-first flex flex-col justify-center text-center lg:text-left max-w-2xl mx-auto lg:mx-0 w-full">
            
            <Reveal delay={0}>
              {/* Availability Badge */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#7C6CFB]/30 bg-[#7C6CFB]/5 px-4 py-2 text-xs font-semibold text-[#7C6CFB] dark:border-[#A58AEF]/30 dark:text-[#A58AEF]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Available for opportunities
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 
                className="font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]" 
                style={{ fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)" }}
              >
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF]">{profile?.name || "Shital Kalekar"}</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <h2 className="mt-5 text-xl sm:text-2xl h-8">
                 <Typewriter strings={heroData.roles} />
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400 max-w-[580px] mx-auto lg:mx-0">
                {heroData.intro}
              </p>
            </Reveal>

            <Reveal delay={400}>
              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center w-full">
                <a href="#projects" className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#7C6CFB]/30 hover:shadow-xl hover:shadow-[#7C6CFB]/40 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#7C6CFB] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  View My Projects
                </a>
                
                <a href={profile?.resumeUrl || "/resume.pdf"} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-7 py-3.5 border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl hover:border-[#7C6CFB] dark:hover:border-[#7C6CFB] hover:text-[#7C6CFB] dark:hover:text-[#7C6CFB] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#7C6CFB] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  <Download size={18} />
                  Download Resume
                </a>

                <a href="#contact" className="w-full sm:w-auto px-4 py-3 text-sm text-gray-600 dark:text-gray-400 font-semibold hover:text-[#7C6CFB] dark:hover:text-[#7C6CFB] transition-colors flex items-center justify-center gap-1.5 group">
                  Contact Me
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="mt-12 flex flex-col gap-8">
                {/* Tech Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  {heroData.techChips.map((chip, i) => (
                    <span 
                      key={i} 
                      className="hero-tech-chip inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:border-[#7C6CFB]/50 hover:scale-105 dark:border-gray-700/80 dark:bg-gray-800/90 dark:text-gray-100 dark:hover:border-[#7C6CFB]/50"
                    >
                      <chip.icon size={14} className="text-[#7C6CFB] dark:text-[#A58AEF]" />
                      {chip.name}
                    </span>
                  ))}
                </div>

                {/* Stats & Socials Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-gray-200/60 dark:border-gray-800/60 pt-6">
                  
                  {/* Socials */}
                  <div className="flex items-center gap-3 pr-6 border-r border-gray-200/60 dark:border-gray-800/60">
                    <a href={profile?.githubUrl || "https://github.com"} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#7C6CFB] hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-[#7C6CFB] dark:hover:text-white">
                      <GithubIcon size={18} />
                    </a>
                    <a href={profile?.linkedinUrl || "https://linkedin.com"} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#7C6CFB] hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-[#7C6CFB] dark:hover:text-white">
                      <LinkedinIcon size={18} />
                    </a>
                    <a href={`mailto:${profile?.email || "shital@example.com"}`} className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-[#7C6CFB] hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-[#7C6CFB] dark:hover:text-white">
                      <Mail size={18} />
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    {heroData.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col text-left">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          <AnimatedStatValue value={stat.value} />
                        </span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Visual (Photo & Floating Cards) */}
          <div className="order-first lg:order-last relative mx-auto w-full max-w-[320px] sm:max-w-md flex justify-center items-center h-[350px] sm:h-[450px] lg:h-[500px]">
            
            {/* Main Profile Photo */}
            <Reveal delay={200} className="relative z-10 flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#7C6CFB] to-[#4F8CFF] p-1.5 shadow-2xl">
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7C6CFB] to-[#4F8CFF] opacity-40 blur-xl animate-pulse"></div>
               {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name || "Profile"}
                    className="relative z-20 h-full w-full rounded-full object-cover object-top border-[6px] border-white dark:border-gray-900"
                  />
                ) : (
                  <div className="relative z-20 flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-800 text-6xl font-bold text-[#7C6CFB] border-[6px] border-white dark:border-gray-900">
                    SK
                  </div>
                )}
            </Reveal>

            {/* Floating Code Card */}
            <div className="absolute -bottom-10 -left-4 sm:-bottom-14 sm:-left-12 z-30 w-[240px] sm:w-[280px] transform rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-800/90 hover:-translate-y-2 transition-transform duration-500 hidden sm:block">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2 dark:border-gray-700/80">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 ml-2">developer.js</span>
              </div>
              {/* Code */}
              <div className="pt-3 font-mono text-xs leading-6">
                  <div>
                    <span className="text-[#7C6CFB]">const</span>{" "}
                    <span className="text-gray-800 dark:text-gray-200">developer</span>{" "}
                    <span className="text-[#4F8CFF]">=</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-gray-500">name:</span>{" "}
                    <span className="text-[#7C6CFB]">"{profile?.name?.split(" ")[0] || "Shital"}"</span><span className="text-gray-500">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-gray-500">role:</span>{" "}
                    <span className="text-[#4F8CFF]">"{profile?.title || "Full Stack"}"</span><span className="text-gray-500">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-gray-500">stack:</span>{" "}
                    <span className="text-[#7C6CFB]">["MERN", "AI"]</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">{"}"}</span>
                  </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute top-4 -right-2 sm:top-10 sm:-right-8 z-30 rounded-xl border border-white/60 bg-white/80 px-4 py-2.5 shadow-xl backdrop-blur-md dark:border-gray-700/60 dark:bg-gray-800/90 hover:scale-105 transition-transform duration-500 animate-[bounce_6s_infinite]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Building</p>
              <p className="text-xs font-extrabold text-[#7C6CFB]">Full Stack Apps</p>
            </div>

            {/* Floating Tech Icons */}
            <div className="absolute top-1/4 -left-6 sm:-left-10 z-20 animate-[bounce_4s_infinite] rounded-full bg-white p-3 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hidden sm:block">
               <Code className="text-[#7C6CFB]" size={22} />
            </div>
            <div className="absolute bottom-1/4 -right-4 sm:-right-6 z-20 animate-[bounce_5s_infinite_1s] rounded-full bg-white p-3 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
               <Database className="text-[#4F8CFF]" size={22} />
            </div>
            
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-20 hidden lg:flex">
         <a href="#about" aria-label="Scroll Down" className="text-gray-400 hover:text-[#7C6CFB] dark:text-gray-500 dark:hover:text-[#7C6CFB] transition-colors p-2">
            <ChevronDown size={28} />
         </a>
      </div>
    </section>
  );
};

export default Hero;
