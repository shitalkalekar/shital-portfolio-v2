import { useEffect, useState } from "react";
import { getExperiences } from "../../services/experience.service.js";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getExperiences();

        if (response.success) {
          const visibleExperiences = (response.data || []).filter(
            (experience) => experience.isVisible !== false
          );

          setExperiences(visibleExperiences);
        } else {
          setError(response.message || "Failed to load experience.");
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load experience. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Experience
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My professional journey
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            A timeline of my practical development experience and the
            technologies I've worked with.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Loading experience...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && experiences.length === 0 && (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="font-medium text-gray-800">
              No experience added yet.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Experience details will appear here once they are added.
            </p>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && experiences.length > 0 && (
          <div className="relative mt-12">
            {/* Timeline Line */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-3 top-0 hidden w-px bg-gray-200 sm:block"
            />

            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <article
                  key={experience._id || `${experience.company}-${experience.role}`}
                  className="relative sm:pl-12"
                >
                  {/* Timeline Dot */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-7 hidden h-6 w-6 items-center justify-center rounded-full border-4 border-gray-50 bg-purple-600 sm:flex"
                  />

                  {/* Card */}
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md sm:p-8">
                    {/* Top Row */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {experience.employmentType && (
                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                              {experience.employmentType}
                            </span>
                          )}

                          <span className="text-xs font-medium text-gray-400">
                            {experience.startDate
                              ? new Date(experience.startDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" }
                              )
                              : "Start date unavailable"}
                            {" — "}
                            {experience.isCurrent
                              ? "Present"
                              : experience.endDate
                                ? new Date(experience.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" }
                                )
                                : "Present"}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
                          {experience.role}
                        </h3>

                        <p className="mt-1 font-medium text-purple-600">
                          {experience.company}
                        </p>

                        {experience.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            {experience.location}
                          </p>
                        )}
                      </div>

                      <span className="hidden text-sm font-bold text-gray-200 lg:block">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Description */}
                    {experience.description && (
                      <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
                        {experience.description}
                      </p>
                    )}

                    {/* Responsibilities */}
                    {experience.responsibilities?.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Responsibilities
                        </p>

                        <ul className="mt-3 space-y-2">
                          {experience.responsibilities.map(
                            (responsibility, responsibilityIndex) => (
                              <li
                                key={`${responsibility}-${responsibilityIndex}`}
                                className="flex gap-3 text-sm leading-6 text-gray-600"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                                <span>{responsibility}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {experience.technologies?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                        {experience.technologies.map((technology, technologyIndex) => (
                          <span
                            key={`${technology}-${technologyIndex}`}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
