import { useEffect, useState, useRef } from "react";
import { getEducations } from "../../services/education.service.js";
import { TypingText } from "./Projects.jsx";

// Chronological Education Data: SSC (10th) → HSC (12th) → B.Tech
export const defaultEducationData = [
  {
    _id: "default-ssc",
    degree: "Secondary School Certificate (SSC)",
    fieldOfStudy: "10th Standard",
    institution: "State Board of Maharashtra",
    location: "Pune, India",
    startDate: "2018-06-01",
    endDate: "2019-05-31",
    yearLabel: "2019",
    specialization: "General Science & Mathematics",
    description: "Completed secondary school education with strong fundamentals in mathematics, analytical problem solving, and sciences.",
  },
  {
    _id: "default-hsc",
    degree: "Higher Secondary Certificate (HSC)",
    fieldOfStudy: "Science Stream (PCMB)",
    institution: "Junior College of Science",
    location: "Pune, India",
    startDate: "2020-06-01",
    endDate: "2022-05-31",
    yearLabel: "2022",
    specialization: "Physics, Chemistry, Mathematics & Biology",
    description: "Specialized in the science curriculum developing rigorous quantitative reasoning and computer science foundations.",
  },
  {
    _id: "default-btech",
    degree: "Bachelor of Technology (B.Tech)",
    fieldOfStudy: "Computer Science Engineering",
    institution: "Savitribai Phule Pune University",
    location: "Pune, India",
    startDate: "2022-08-01",
    endDate: "2026-06-30",
    yearLabel: "2026",
    specialization: "Artificial Intelligence & Full-Stack Development",
    description: "Comprehensive engineering curriculum with deep focus on AI/ML algorithms, distributed architectures, cloud services, and full-stack engineering.",
    isFinal: true,
  },
];

const formatDate = (isoString) => {
  if (!isoString) return "";
  try {
    const datePart = isoString.split("T")[0];
    if (!datePart) return isoString;
    const parts = datePart.split("-");
    if (parts.length !== 3) return isoString;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  } catch (e) {
    return isoString;
  }
};

const extractYear = (item, fallback) => {
  if (item.yearLabel) return item.yearLabel;
  if (item.endDate) {
    try {
      const year = new Date(item.endDate).getFullYear();
      if (!isNaN(year)) return `${year}`;
    } catch (e) {}
  }
  return fallback;
};

const getRank = (item) => {
  const text = `${item.degree || ""} ${item.fieldOfStudy || ""}`.toLowerCase();
  if (text.includes("10th") || text.includes("ssc") || text.includes("secondary school")) return 1;
  if (text.includes("12th") || text.includes("hsc") || text.includes("higher secondary") || text.includes("junior college")) return 2;
  if (text.includes("b.tech") || text.includes("btech") || text.includes("bachelor") || text.includes("engineering")) return 3;
  const time = new Date(item.startDate || item.endDate || 0).getTime();
  return time || 99;
};

const EducationCard = ({ item, isFinal }) => {
  return (
    <article className="group relative flex flex-col h-full rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#7C6CFB]/15 hover:border-[#7C6CFB]/50 dark:border-gray-800 dark:bg-[#161822] dark:hover:border-[#7C6CFB]/60 dark:hover:shadow-[#7C6CFB]/10">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-lg text-[#7C6CFB] shadow-xs transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#7C6CFB] group-hover:to-[#4F8CFF] group-hover:text-white dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF]">
          🎓
        </div>

        {isFinal ? (
          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-700/40">
            Final Milestone
          </span>
        ) : (
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-700/30">
            Completed
          </span>
        )}
      </div>

      {/* Degree & Stream */}
      <div className="mt-5">
        <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white leading-snug">
          {item.degree}
        </h3>

        {item.fieldOfStudy && (
          <p className="mt-1 text-sm font-semibold text-[#5B8DEF] dark:text-[#7C6CFB]">
            {item.fieldOfStudy}
          </p>
        )}
      </div>

      {/* Institution & Location */}
      <div className="mt-3">
        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
          {item.institution}
        </p>
        {item.location && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {item.location}
          </p>
        )}
      </div>

      {/* Period */}
      <div className="mt-3.5 self-start inline-flex items-center rounded-lg bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-700">
        {item.startDate ? formatDate(item.startDate) : "Start date unavailable"}
        {" — "}
        {item.isCurrent ? "Present" : (item.endDate ? formatDate(item.endDate) : "Present")}
      </div>

      {/* Specialization */}
      {item.specialization && (
        <div className="mt-3.5 rounded-xl border border-purple-100 bg-[#EDE9FE]/30 p-2.5 dark:border-purple-900/30 dark:bg-purple-950/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7C6CFB] dark:text-[#A58AEF]">
            Specialization
          </p>
          <p className="mt-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
            {item.specialization}
          </p>
        </div>
      )}

      {/* Description */}
      {item.description && (
        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {item.description}
        </p>
      )}
    </article>
  );
};

const Education = () => {
  const [education, setEducation] = useState(defaultEducationData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEducations();

        if (response.success && response.data && response.data.length > 0) {
          const visibleEducation = response.data.filter(
            (item) => item.isVisible !== false
          );

          if (visibleEducation.length > 0) {
            const sorted = [...visibleEducation].sort((a, b) => getRank(a) - getRank(b));
            const formatted = sorted.map((item, idx) => ({
              ...item,
              isFinal: idx === sorted.length - 1,
              yearLabel: extractYear(item, idx === 0 ? "2019" : idx === 1 ? "2022" : "2026"),
            }));
            setEducation(formatted);
          } else {
            setEducation(defaultEducationData);
          }
        } else {
          setEducation(defaultEducationData);
        }
      } catch (err) {
        console.error("Failed to fetch education:", err);
        // Fallback to default high-quality chronological data
        setEducation(defaultEducationData);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const displayEducation = education.length > 0 ? education : defaultEducationData;

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative border-t border-gray-100 bg-white py-16 sm:py-20 dark:border-gray-800 dark:bg-[#0f111a]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7C6CFB] dark:text-[#A58AEF]">
            Education
          </p>

          <h2 className="relative mt-3 text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white sm:text-4xl">
            {/* Invisible placeholder reserving exact height and wrapping */}
            <span className="invisible select-none" aria-hidden="true">
              My academic journey
            </span>
            {/* Overlay typed text */}
            <span className="absolute inset-0">
              <TypingText
                text="My academic journey"
                start={hasEnteredView}
                speed={80}
              />
            </span>
          </h2>

          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
            My academic background in computer science, engineering and
            artificial intelligence.
          </p>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mt-8 text-center text-xs text-gray-400">
            Loading education timeline...
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* TIMELINE SECTION */}
        <div className="mt-12">
          {/* 1. DESKTOP TIMELINE TRACK & NODES (lg:block) */}
          <div className="hidden lg:block relative mb-10 pt-4 pb-2">
            {/* Horizontal timeline gradient line */}
            <div className="absolute top-[2.45rem] left-[16.66%] right-[16.66%] h-[3px] bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full w-full bg-gradient-to-r from-[#4F8CFF] via-[#7C6CFB] to-[#A58AEF] rounded-full transition-transform duration-1000 ease-out origin-left ${
                  hasEnteredView ? "scale-x-100" : "scale-x-0"
                } motion-reduce:scale-x-100`}
              />
            </div>

            {/* 3 Nodes positioned directly over card columns */}
            <div className="grid grid-cols-3 relative z-10">
              {displayEducation.map((item, index) => {
                const isFinal = index === displayEducation.length - 1;
                const nodeDelay = index === 0 ? "delay-100" : index === 1 ? "delay-500" : "delay-900";

                return (
                  <div key={`node-${item._id || index}`} className="flex flex-col items-center">
                    {/* Year pill & Graduated badge */}
                    <div className="mb-2.5 flex items-center gap-1.5 h-6">
                      <span className="text-xs font-bold tracking-wide text-[#4F8CFF] dark:text-[#A58AEF] bg-blue-50 dark:bg-[#7C6CFB]/15 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-[#7C6CFB]/30 shadow-2xs">
                        {item.yearLabel}
                      </span>
                      {isFinal && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Graduated
                        </span>
                      )}
                    </div>

                    {/* Node Dot */}
                    <div
                      className={`transition-all duration-500 ease-out ${nodeDelay} ${
                        hasEnteredView ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      } motion-reduce:scale-100 motion-reduce:opacity-100`}
                    >
                      {isFinal ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-9 w-9 rounded-full bg-[#7C6CFB]/30 blur-[6px] animate-pulse pointer-events-none" />
                          <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white dark:border-[#0f111a] bg-gradient-to-br from-[#7C6CFB] to-[#A58AEF] shadow-[0_0_16px_rgba(124,108,251,0.5)] ring-2 ring-[#7C6CFB]/40">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white dark:border-[#0f111a] bg-gradient-to-br from-[#4F8CFF] to-[#7C6CFB] shadow-sm ring-2 ring-[#4F8CFF]/30">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. DESKTOP CARDS (Equal height grid) */}
          <div className="hidden lg:grid grid-cols-3 gap-6 items-stretch">
            {displayEducation.map((item, index) => {
              const cardDelay = index === 0 ? "delay-150" : index === 1 ? "delay-550" : "delay-950";
              return (
                <div
                  key={`card-${item._id || index}`}
                  className={`h-full transition-all duration-700 ease-out ${cardDelay} ${
                    hasEnteredView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
                >
                  <EducationCard item={item} isFinal={index === displayEducation.length - 1} />
                </div>
              );
            })}
          </div>

          {/* 3. MOBILE & TABLET VERTICAL TIMELINE (lg:hidden) */}
          <div className="lg:hidden relative pl-7 sm:pl-8">
            {/* Vertical gradient timeline line on the left */}
            <div className="absolute left-[11px] sm:left-[13px] top-4 bottom-4 w-[3px] bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full w-full bg-gradient-to-b from-[#4F8CFF] via-[#7C6CFB] to-[#A58AEF] rounded-full transition-transform duration-1000 ease-out origin-top ${
                  hasEnteredView ? "scale-y-100" : "scale-y-0"
                } motion-reduce:scale-y-100`}
              />
            </div>

            <div className="space-y-8 sm:space-y-10">
              {displayEducation.map((item, index) => {
                const isFinal = index === displayEducation.length - 1;
                const stepDelay = index === 0 ? "delay-150" : index === 1 ? "delay-450" : "delay-750";

                return (
                  <div
                    key={`mobile-step-${item._id || index}`}
                    className={`relative transition-all duration-700 ease-out ${stepDelay} ${
                      hasEnteredView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
                  >
                    {/* Node on vertical line */}
                    <div className="absolute -left-7 sm:-left-8 top-5 flex items-center justify-center">
                      {isFinal ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-8 w-8 rounded-full bg-[#7C6CFB]/30 blur-[4px] animate-pulse" />
                          <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white dark:border-[#0f111a] bg-gradient-to-br from-[#7C6CFB] to-[#A58AEF] shadow-[0_0_14px_rgba(124,108,251,0.5)] ring-2 ring-[#7C6CFB]/40">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white dark:border-[#0f111a] bg-gradient-to-br from-[#4F8CFF] to-[#7C6CFB] shadow-sm ring-2 ring-[#4F8CFF]/30">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    {/* Node Year Badge & Final Tag on Mobile */}
                    <div className="mb-2.5 flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wide text-[#4F8CFF] dark:text-[#A58AEF] bg-blue-50 dark:bg-[#7C6CFB]/15 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-[#7C6CFB]/30">
                        {item.yearLabel}
                      </span>
                      {isFinal && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Graduated
                        </span>
                      )}
                    </div>

                    {/* Card */}
                    <EducationCard item={item} isFinal={isFinal} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
