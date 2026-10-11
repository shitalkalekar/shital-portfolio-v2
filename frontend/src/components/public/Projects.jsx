import { useEffect, useRef, useState } from "react";
import { getProjects } from "../../services/project.service.js";

// Reusable TypingText component - strictly inline cursor directly following typed text
export const TypingText = ({
  text,
  start = false,
  speed = 80,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setShowCursor(false);
      return;
    }

    if (!start) return;

    setShowCursor(true);
    let currentIndex = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        clearInterval(interval);
        // Completely remove cursor from DOM after 500ms
        setTimeout(() => {
          setShowCursor(false);
        }, 500);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [start, text, speed]);

  return (
    <span className={`inline ${className}`}>
      {displayedText}
      {showCursor && (
        <span
          className="inline-block w-[3px] h-[0.85em] ml-1 bg-[#7C6CFB] dark:bg-[#A58AEF] align-middle rounded-sm animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

// ProjectCard with soft blue glow, rotating gradient border, and mouse spotlight
const ProjectCard = ({ project, index, isVisible }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`group project-card-glow relative rounded-3xl bg-white p-6 sm:p-8 dark:bg-[#161822] transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Animated rotating gradient border (conic gradient) */}
      <div className="project-card-border-gradient" aria-hidden="true" />

      {/* Soft mouse-following spotlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.1), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Top Header: Category/Featured Badges on Left + Numbering on Right */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-[#7C6CFB]/15 dark:text-[#A58AEF] border border-transparent dark:border-[#7C6CFB]/25">
              {project.category || "Project"}
            </span>

            {project.featured && (
              <span className="rounded-full border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-600 dark:border-[#7C6CFB]/30 dark:bg-[#7C6CFB]/10 dark:text-[#A58AEF]">
                Featured
              </span>
            )}
          </div>

          <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-gray-300 dark:text-gray-600 group-hover:text-[#7C6CFB] dark:group-hover:text-[#A58AEF] transition-colors select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors group-hover:text-[#7C6CFB] dark:group-hover:text-[#A58AEF] sm:text-3xl">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
          {project.shortDescription || project.description}
        </p>

        {/* Technologies */}
        {Array.isArray(project.technologies) &&
          project.technologies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}

        {/* Action */}
        <div className="mt-7 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-5">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Project {String(index + 1).padStart(2, "0")}
          </span>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:text-[#7C6CFB] dark:hover:text-[#A58AEF]"
            >
              View Project
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          ) : project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:text-[#7C6CFB] dark:hover:text-[#A58AEF]"
            >
              View Code
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Details unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProjects();

        if (response.success) {
          setProjects(
            Array.isArray(response.data) ? response.data : []
          );
        } else {
          setError(response.message || "Failed to load projects.");
        }
      } catch (err) {
        console.error("Projects API error:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load projects. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // IntersectionObserver: trigger visibility immediately on scroll into view
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
          observer.disconnect(); // Play once, don't restart on every scroll
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="border-t border-gray-100 bg-white py-20 sm:py-24 dark:border-gray-800 dark:bg-[#0f111a]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {/* Label */}
            <p
              className={`text-sm font-semibold uppercase tracking-wider text-[#7C6CFB] dark:text-[#A58AEF] transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              Selected Work
            </p>

            {/* Heading: height reserved with min-h-[1.25em], typing runs independently */}
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl min-h-[1.25em] flex items-center">
              <TypingText
                text="Projects I've built"
                start={isVisible}
                speed={80}
              />
            </h2>

            {/* Description: fades in immediately when section scrolls into view */}
            <p
              className={`mt-4 text-base leading-7 text-gray-600 dark:text-gray-400 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              A selection of projects that demonstrate my experience across
              full stack development, AI and machine learning.
            </p>
          </div>

          {/* CTA Link: fades in immediately when section scrolls into view */}
          <div
            className={`transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            <a
              href="#contact"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#7C6CFB] dark:text-[#A58AEF] transition-colors hover:text-[#5B8DEF] dark:hover:text-white"
            >
              Have a project in mind?
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="mt-12 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading projects...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-12 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              No projects available yet.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id || project.slug || project.title}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 dark:border-gray-800 dark:bg-[#1a1d27]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Looking for a developer for your next project?
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Let's discuss how I can help turn your idea into a working
                application.
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6CFB] to-[#4F8CFF] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-[#7C6CFB]/25 hover:-translate-y-0.5"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

