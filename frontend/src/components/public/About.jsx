import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Sparkles,
  Briefcase,
  Languages,
  Code,
  Database,
  Brain,
  ArrowRight
} from "lucide-react";
import { statsData } from "../../constants/stats.js";
import { AnimatedStatValue } from "./AnimatedStatValue.jsx";
import { TypingText } from "./Projects.jsx";

const quickFacts = [
  {
    icon: GraduationCap,
    label: "Education",
    value: "B.Tech in Computer Science Engineering (AI)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Pune, India",
  },
  {
    icon: Sparkles,
    label: "Focus",
    value: "MERN Stack and AI/ML",
  },
  {
    icon: Briefcase,
    label: "Status",
    value: "Open to opportunities",
    hasStatusDot: true,
  },
  {
    icon: Languages,
    label: "Languages",
    value: "English, Hindi, Marathi",
  },
];



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
      { threshold: 0.1, rootMargin: "50px" }
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

const techStack = ["React.js", "Node.js", "Express", "MongoDB", "JavaScript", "Python", "Tailwind"];

const highlights = [
  {
    number: "01",
    title: "Full Stack Development",
    description: "Building responsive and scalable web applications using modern frontend and backend technologies.",
    icon: Code,
  },
  {
    number: "02",
    title: "MERN Stack",
    description: "Working with React.js, Node.js, Express.js and MongoDB to develop complete web applications.",
    icon: Database,
  },
  {
    number: "03",
    title: "AI & Machine Learning",
    description: "Exploring AI and machine learning to build practical solutions for real-world problems.",
    icon: Brain,
  },
];

const About = ({ profile }) => {
  const sectionRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-gray-100 bg-white py-24 sm:py-32 dark:bg-[#0f111a] dark:border-gray-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#7C6CFB]">
              About Me
            </p>
            <h2 className="relative mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              {/* Invisible text reserving exact dimensions across all viewport widths so layout doesn't jump */}
              <span className="invisible select-none" aria-hidden="true">
                Building with code, curiosity and purpose.
              </span>
              {/* Overlay typed text */}
              <span className="absolute inset-0">
                <TypingText
                  text="Building with code, curiosity and purpose."
                  start={hasEnteredView}
                  speed={70}
                />
              </span>
            </h2>
            <div
              className={`mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF] transition-all duration-700 ease-out origin-left ${
                hasEnteredView
                  ? "opacity-100 translate-x-0 scale-x-100"
                  : "opacity-0 -translate-x-4 scale-x-75"
              } motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:scale-x-100`}
            ></div>
          </div>
        </Reveal>

        {/* Main Content */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[360px_1fr] lg:items-start lg:gap-16">
          
          {/* Left Quick Facts Card */}
          <Reveal delay={100} className="w-full lg:sticky lg:top-28 z-10">
            <div className="relative group">
              {/* Subtle hover glow */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"></div>
              
              <div className="relative rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-[#7C6CFB]/30 dark:border-gray-800 dark:bg-[#161822]/90 dark:hover:border-[#7C6CFB]/40">
                {/* Heading with tiny gradient accent line */}
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#7C6CFB] to-[#4F8CFF]"></div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    Quick Facts
                  </h3>
                </div>

                {/* Facts List */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
                  {quickFacts.map((fact) => (
                    <div key={fact.label} className="flex items-start gap-3.5 py-3.5 first:pt-4 last:pb-1">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C6CFB]/10 text-[#7C6CFB] dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
                        <fact.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {fact.label}
                        </p>
                        <div className="mt-0.5">
                          {fact.hasStatusDot ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                              </span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {fact.value}
                              </span>
                            </span>
                          ) : (
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                              {fact.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Content */}
          <div className="flex flex-col gap-12">
            
            {/* Summary */}
            <Reveal delay={200}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300 font-medium">
                  {profile?.about || "B.Tech in Computer Science Engineering with a specialization in AI, hands-on experience building full-stack MERN applications, and a passion for solving real-world problems with clean, scalable code."}
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div className="mt-8 flex flex-wrap gap-2.5">
                {techStack.map((tech) => (
                  <span key={tech} className="px-4 py-1.5 text-xs font-bold tracking-wide text-[#7C6CFB] bg-[#7C6CFB]/10 rounded-full border border-[#7C6CFB]/20 transition-colors hover:bg-[#7C6CFB]/20 dark:text-[#A58AEF] dark:bg-[#A58AEF]/10 dark:border-[#A58AEF]/20">
                    {tech}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Stat Cards */}
            <Reveal delay={300}>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {statsData.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 text-center shadow-sm transition-transform hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-800/50">
                    <span className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      <AnimatedStatValue value={stat.value} />
                    </span>
                    <span className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {stat.aboutLabel || stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Highlights/Cards */}
            <div className="grid gap-5">
              {highlights.map((item, index) => (
                <Reveal key={item.number} delay={400 + index * 100}>
                  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C6CFB] hover:shadow-xl hover:shadow-[#7C6CFB]/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#7C6CFB]">
                    {/* Subtle Background Number Accent */}
                    <div className="absolute -right-2 -top-8 text-9xl font-black text-gray-50 opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:text-[#7C6CFB]/5 dark:text-gray-800/40">
                      {item.number}
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#7C6CFB]/10 text-[#7C6CFB] transition-transform duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#7C6CFB] group-hover:to-[#4F8CFF] group-hover:text-white dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
                        <item.icon size={28} />
                      </div>

                      <div className="mt-2 sm:mt-0">
                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#7C6CFB] dark:text-white dark:group-hover:text-[#A58AEF]">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA Button */}
            <Reveal delay={700}>
              <div className="pt-2">
                <a
                  href="#contact"
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-gray-700 shadow-sm transition-all duration-300 hover:border-[#7C6CFB] hover:bg-[#7C6CFB] hover:text-white hover:shadow-lg hover:shadow-[#7C6CFB]/20 focus:outline-none focus:ring-2 focus:ring-[#7C6CFB] focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-[#7C6CFB] dark:hover:text-white dark:hover:border-[#7C6CFB]"
                >
                  Let's work together
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
