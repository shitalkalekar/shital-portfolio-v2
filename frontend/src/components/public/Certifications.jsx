import { useEffect, useState, useRef } from "react";
import { getCertifications } from "../../services/certification.service.js";
import { TypingText } from "./Projects.jsx";

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

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
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
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCertifications();

        if (response.success) {
          const visibleCertifications = (response.data || []).filter(
            (cert) => cert.isVisible !== false
          );
          setCertifications(visibleCertifications);
        } else {
          setError(response.message || "Failed to load certifications.");
        }
      } catch (err) {
        console.error("Failed to fetch certifications:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load certifications. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="border-t border-gray-100 bg-gray-50 py-14 sm:py-16 dark:border-gray-800 dark:bg-[#0f111a]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7C6CFB] dark:text-[#A58AEF]">
            Certifications
          </p>

          <h2 className="relative mt-3 text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white sm:text-4xl">
            {/* Invisible text reserving exact dimensions across all viewport widths so layout doesn't jump */}
            <span className="invisible select-none" aria-hidden="true">
              Learning & achievements
            </span>
            {/* Overlay typed text */}
            <span className="absolute inset-0">
              <TypingText
                text="Learning & achievements"
                start={hasEnteredView}
                speed={80}
              />
            </span>
          </h2>

          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
            Certifications and courses that support my continuous learning
            and professional development.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading certifications...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && certifications.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <p className="font-medium text-gray-800 dark:text-gray-200">No certifications added yet.</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Certifications will appear here once they are added.
            </p>
          </div>
        )}

        {/* Certification Cards */}
        {!loading && !error && certifications.length > 0 && (
          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {certifications.map((certificate, index) => (
              <article
                key={certificate._id || `${certificate.title}-${certificate.issuer}`}
                className="cert-card group overflow-hidden"
                style={{
                  animationDelay: `${(index % 3) * 0.4}s`,
                }}
              >
                {/* 1. Certificate Visual */}
                <div className="relative flex w-full aspect-[16/10] max-h-[155px] sm:max-h-[165px] shrink-0 items-center justify-center overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-[#F8F7FF] to-[#E6E1FF]/40 dark:from-[#1a1d2d] dark:to-[#141624]">
                  {certificate.certificateImage ? (
                    <img
                      src={certificate.certificateImage}
                      alt={`${certificate.title} Certificate`}
                      className="h-full w-full p-2.5 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-3">
                      <div className="flex h-full w-full items-center justify-center rounded-xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-800/60 shadow-sm">
                        <div className="text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-lg text-purple-600 dark:text-purple-400">
                            📜
                          </div>
                          <p className="mt-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                            {certificate.issuer || "Certificate"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-[18px]">
                  {/* Title */}
                  <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug transition-colors duration-200 group-hover:text-[#4F8CFF] dark:group-hover:text-[#7C6CFB]">
                    {certificate.title}
                  </h3>

                  {/* Issuer and Date */}
                  <div className="mt-1.5 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <p className="font-semibold text-[#5B8DEF] dark:text-[#7C6CFB] truncate max-w-[65%]">
                      {certificate.issuer}
                    </p>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/80 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700/80 shrink-0">
                      {certificate.issueDate ? formatDate(certificate.issueDate) : "Date unavailable"}
                    </span>
                  </div>

                  {/* Description - clamped to 2 lines, no min-height */}
                  {certificate.description && (
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                      {certificate.description}
                    </p>
                  )}

                  {/* Footer - Pinned to bottom */}
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/80">
                    {certificate.credentialId && (
                      <div className="mb-2 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 shrink-0">
                          ID
                        </span>
                        <span className="font-mono text-gray-600 dark:text-gray-400 truncate max-w-[70%] text-right">
                          {certificate.credentialId}
                        </span>
                      </div>
                    )}

                    {certificate.credentialUrl ? (
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7C6CFB] to-[#4F8CFF] px-4 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:brightness-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#7C6CFB]"
                      >
                        Verify Certificate
                        <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      >
                        Verification unavailable
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
