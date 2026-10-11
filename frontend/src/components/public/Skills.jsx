import { useEffect, useRef, useState } from "react";
import { getSkills } from "../../services/skill.service.js";

const categoryDescriptions = {
  Frontend: "Building responsive and interactive user interfaces.",
  Backend: "Developing APIs and server-side applications.",
  Database: "Working with structured and document-based data.",
  Programming: "Programming languages used across development and problem solving.",
  "AI & Machine Learning":
    "Exploring intelligent systems and machine learning workflows.",
  "Tools & Workflow":
    "Tools used for development, testing and collaboration.",
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSkills();

        if (response.success) {
          const allSkills = Array.isArray(response.data)
            ? response.data
            : [];

          setSkills(allSkills.filter((skill) => skill.isVisible !== false));
        } else {
          setError(response.message || "Failed to load skills.");
        }
      } catch (err) {
        console.error("Skills API error:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load skills. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  // Section Header Fade-In-Up IntersectionObserver
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setHeaderVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillGroups = Object.values(
    skills.reduce((groups, skill) => {
      const rawCategory = skill.category || "Other";
      // Normalize to Title Case to prevent case-sensitive duplicates
      const category = rawCategory
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      if (!groups[category]) {
        groups[category] = {
          title: category,
          description:
            categoryDescriptions[category] ||
            categoryDescriptions[rawCategory] ||
            `Technologies and skills related to ${category}.`,
          skills: [],
        };
      }

      groups[category].skills.push(skill);

      return groups;
    }, {})
  );

  // Helper to maintain infinite wrap
  const handleInfiniteWrap = () => {
    const container = containerRef.current;
    if (!container) return;
    const oneSetWidth = container.scrollWidth / 3;
    if (oneSetWidth <= 0) return;

    if (container.scrollLeft >= oneSetWidth * 2) {
      container.scrollLeft -= oneSetWidth;
    } else if (container.scrollLeft < oneSetWidth) {
      container.scrollLeft += oneSetWidth;
    }
  };

  // Center initial scroll position on mount so user can scroll in both directions
  useEffect(() => {
    if (containerRef.current && skillGroups.length > 0) {
      const oneSetWidth = containerRef.current.scrollWidth / 3;
      if (oneSetWidth > 0) {
        containerRef.current.scrollLeft = oneSetWidth;
      }
    }
  }, [skillGroups.length]);

  // Auto-scroll loop with pause-on-hover & touch support
  useEffect(() => {
    if (skillGroups.length === 0) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return; // Respect reduced motion

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      const container = containerRef.current;
      if (
        container &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !isTouchingRef.current
      ) {
        // Continuous smooth auto-scroll: ~0.045px per ms (~45px per second)
        const pixelsToScroll = 0.045 * delta;
        container.scrollLeft += pixelsToScroll;

        const oneSetWidth = container.scrollWidth / 3;
        if (oneSetWidth > 0 && container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [skillGroups.length]);

  // Window mouseup listener to catch releases outside the container
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX;
    if (containerRef.current) {
      startScrollLeftRef.current = containerRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startXRef.current) * 1.2;
    containerRef.current.scrollLeft = startScrollLeftRef.current - walk;
    handleInfiniteWrap();
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    isTouchingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    if (containerRef.current) {
      startScrollLeftRef.current = containerRef.current.scrollLeft;
    }
  };

  const handleTouchMove = (e) => {
    if (!isTouchingRef.current || !containerRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startXRef.current) * 1.2;
    containerRef.current.scrollLeft = startScrollLeftRef.current - walk;
    handleInfiniteWrap();
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
  };

  // Card Mouse Spotlight Updater (updates CSS variables --mouse-x, --mouse-y)
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // Triplicate the cards for a mathematically seamless, gap-free infinite loop
  const displayGroups = [...skillGroups, ...skillGroups, ...skillGroups];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24 dark:bg-[#0f111a] dark:border-gray-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7C6CFB] dark:text-[#A58AEF]">
            Technical Skills
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Technologies I work with
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            A combination of frontend, backend, database, programming and
            AI technologies that I use to build complete applications.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-12 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading skills...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-12 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && skillGroups.length === 0 && (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              No skills available yet.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add visible skills from your Admin Panel.
            </p>
          </div>
        )}

        {/* Infinite Carousel Container with Edge Fade Mask */}
        {!loading && !error && skillGroups.length > 0 && (
          <div
            className={`mt-12 transition-all duration-700 delay-200 ease-out ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="skills-carousel-mask relative w-full overflow-hidden py-4">
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => {
                  isHoveredRef.current = true;
                }}
                onMouseLeave={() => {
                  isHoveredRef.current = false;
                  handleMouseUp();
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`skills-track flex w-full overflow-x-scroll no-scrollbar py-3 gap-5 select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {displayGroups.map((group, index) => (
                  <div
                    key={`${group.title}-${index}`}
                    onMouseMove={handleCardMouseMove}
                    className="skill-card w-[320px] sm:w-[350px] shrink-0 group rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-[#161822]"
                  >
                    {/* Mouse-following soft radial spotlight */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
                      style={{
                        background:
                          "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(124, 108, 251, 0.12), transparent 70%)",
                      }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10">
                      {/* Top Header: Badge Number & Accent Plus */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C6CFB]/10 text-sm font-bold text-[#7C6CFB] dark:bg-[#7C6CFB]/20 dark:text-[#A58AEF] transition-colors group-hover:bg-[#7C6CFB] group-hover:text-white">
                          {String((index % skillGroups.length) + 1).padStart(2, "0")}
                        </div>
                        <span className="text-xl text-gray-300 dark:text-gray-600 transition-colors group-hover:text-[#7C6CFB] dark:group-hover:text-[#A58AEF]">
                          +
                        </span>
                      </div>

                      {/* Group Title & Description */}
                      <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white transition-colors group-hover:text-[#7C6CFB] dark:group-hover:text-[#A58AEF]">
                        {group.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {group.description}
                      </p>

                      {/* Interactive Skill Chips */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <span
                            key={skill._id || skill.name}
                            title={
                              skill.level
                                ? `${skill.name} — ${skill.level}`
                                : skill.name
                            }
                            className="rounded-lg border border-gray-200/80 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7C6CFB]/15 hover:border-[#7C6CFB]/40 hover:text-[#7C6CFB] dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-[#7C6CFB]/25 dark:hover:text-[#A58AEF] dark:hover:border-[#7C6CFB]/50 cursor-pointer"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Highlight */}
        <div className="mt-10 rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:p-8 dark:border-gray-800 dark:bg-[#161822]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#7C6CFB] dark:text-[#A58AEF]">
                Always learning
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Continuously improving my development skills and exploring new
                technologies to build better solutions.
              </p>
            </div>

            <a
              href="#projects"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#7C6CFB] to-[#4F8CFF] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#7C6CFB]/25 hover:-translate-y-0.5"
            >
              See My Work
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;