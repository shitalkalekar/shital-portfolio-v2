import { useEffect, useState } from "react";

import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../services/experience.service.js";

const emptyForm = {
  company: "",
  role: "",
  employmentType: "Full-time",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  responsibilities: "",
  technologies: "",
  order: 0,
  isVisible: true,
};

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // ========================================
  // LOAD EXPERIENCES
  // ========================================

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getExperiences();

        if (response.success) {
          setExperiences(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load experiences.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // EDIT EXPERIENCE
  // ========================================

  const handleEdit = (experience) => {
    setEditingId(experience._id);

    setFormData({
      company: experience.company || "",
      role: experience.role || "",
      employmentType:
        experience.employmentType || "Full-time",
      location: experience.location || "",
      startDate: experience.startDate
        ? experience.startDate.slice(0, 10)
        : "",
      endDate: experience.endDate
        ? experience.endDate.slice(0, 10)
        : "",
      isCurrent: experience.isCurrent ?? false,
      description: experience.description || "",
      responsibilities:
        experience.responsibilities?.join("\n") || "",
      technologies:
        experience.technologies?.join(", ") || "",
      order: experience.order ?? 0,
      isVisible: experience.isVisible ?? true,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // CANCEL EDIT
  // ========================================

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
    setSuccess("");
  };

  // ========================================
  // CREATE / UPDATE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const experienceData = {
        ...formData,

        startDate: formData.startDate,

        endDate:
          formData.isCurrent || !formData.endDate
            ? null
            : formData.endDate,

        responsibilities: formData.responsibilities
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        order: Number(formData.order),
      };

      let response;

      if (editingId) {
        response = await updateExperience(
          editingId,
          experienceData,
        );
      } else {
        response = await createExperience(experienceData);
      }

      if (response.success) {
        if (editingId) {
          setExperiences((prev) =>
            prev.map((experience) =>
              experience._id === editingId
                ? response.data
                : experience,
            ),
          );

          setSuccess("Experience updated successfully.");
        } else {
          setExperiences((prev) => [
            ...prev,
            response.data,
          ]);

          setSuccess("Experience created successfully.");
        }

        setEditingId(null);
        setFormData({ ...emptyForm });
      }
    } catch (error) {
      console.error("Failed to save experience:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save experience.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteExperience(id);

      setExperiences((prev) =>
        prev.filter((experience) => experience._id !== id),
      );

      setSuccess("Experience deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete experience:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete experience.",
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading experiences...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // COMMON STYLES
  // ========================================

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50";

  const labelClass =
    "block text-sm font-medium text-gray-700";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <span>💼</span>
              Portfolio Content
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Experience Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your professional experience displayed on
              your public portfolio.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {experiences.length}{" "}
              {experiences.length === 1
                ? "Experience"
                : "Experiences"}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          ALERTS
      ======================================== */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span className="mt-0.5 shrink-0">⚠️</span>

          <div>
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1 leading-5 text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <span className="mt-0.5 shrink-0">✓</span>

          <div>
            <p className="font-semibold">
              Changes saved
            </p>

            <p className="mt-1 leading-5 text-green-600">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          EXPERIENCE FORM
      ======================================== */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Form Header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId
                  ? "Edit Experience"
                  : "Add New Experience"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected professional experience."
                  : "Add a professional experience to your portfolio."}
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Editing Experience
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ========================================
              BASIC INFORMATION
          ======================================== */}

          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className={labelClass}
                >
                  Company
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. CodeServe Tech Solutions"
                  required
                  className={inputClass}
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className={labelClass}
                >
                  Role
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="role"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer Intern"
                  required
                  className={inputClass}
                />
              </div>

              {/* Employment Type */}
              <div>
                <label
                  htmlFor="employmentType"
                  className={labelClass}
                >
                  Employment Type
                </label>

                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>

                  <option value="Contract">
                    Contract
                  </option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className={labelClass}
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pune, Maharashtra"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ========================================
              EMPLOYMENT PERIOD
          ======================================== */}

          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Employment Period
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className={labelClass}
                >
                  Start Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className={labelClass}
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.isCurrent}
                  className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all ${
                    formData.isCurrent
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  }`}
                />

                {formData.isCurrent && (
                  <p className="mt-2 text-xs text-gray-400">
                    End date is disabled because this is your
                    current position.
                  </p>
                )}
              </div>
            </div>

            {/* Current Position */}
            <label
              className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                formData.isCurrent
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
              }`}
            >
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-green-600"
              />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Currently working here
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Mark this experience as your current
                  position.
                </p>
              </div>
            </label>
          </div>

          {/* ========================================
              PROFESSIONAL DETAILS
          ======================================== */}

          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Professional Details
            </h3>

            <div className="space-y-5">
              {/* Description */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className={labelClass}
                  >
                    Description
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <span className="text-xs text-gray-400">
                    {formData.description.length} characters
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                  placeholder="Describe your role, achievements and contribution..."
                  className={`${inputClass} resize-y leading-6`}
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label
                  htmlFor="responsibilities"
                  className={labelClass}
                >
                  Responsibilities
                </label>

                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="6"
                  placeholder={
                    "Developed React applications\nBuilt REST APIs\nWorked with MongoDB"
                  }
                  className={`${inputClass} resize-y leading-6`}
                />

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-purple-500">
                    •
                  </span>

                  <p className="text-xs text-gray-400">
                    Enter one responsibility per line.
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label
                  htmlFor="technologies"
                  className={labelClass}
                >
                  Technologies
                </label>

                <input
                  id="technologies"
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Separate technologies with commas.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================
              DISPLAY SETTINGS
          ======================================== */}

          <div className="p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Display Settings
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Order */}
              <div>
                <label
                  htmlFor="order"
                  className={labelClass}
                >
                  Display Order
                </label>

                <input
                  id="order"
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Visibility */}
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  formData.isVisible
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                }`}
              >
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Visible on portfolio
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Show this experience publicly.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ========================================
              FORM ACTIONS
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-purple-700 hover:to-purple-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                  {editingId
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <span>✓</span>

                  {editingId
                    ? "Update Experience"
                    : "Create Experience"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ========================================
          EXISTING EXPERIENCE
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Experience
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage your professional experience.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {experiences.length} total
          </span>
        </div>

        {experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
              💼
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No experience found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Add your first professional experience using
              the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {experiences.map((experience) => (
              <article
                key={experience._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* Experience Information */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      {/* Icon */}
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl sm:flex">
                        💼
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Role */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
                            {experience.role}
                          </h3>

                          {experience.isCurrent && (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              Current
                            </span>
                          )}

                          {!experience.isVisible && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                              Hidden
                            </span>
                          )}
                        </div>

                        {/* Company */}
                        <p className="mt-1 text-sm font-semibold text-purple-600">
                          {experience.company}
                        </p>

                        {/* Meta */}
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                          <span className="rounded-md bg-gray-50 px-2.5 py-1">
                            {experience.employmentType}
                          </span>

                          {experience.location && (
                            <span>
                              📍 {experience.location}
                            </span>
                          )}

                          <span>
                            📅{" "}
                            {experience.startDate
                              ? new Date(
                                  experience.startDate,
                                ).toLocaleDateString()
                              : "-"}{" "}
                            —{" "}
                            {experience.isCurrent
                              ? "Present"
                              : experience.endDate
                                ? new Date(
                                    experience.endDate,
                                  ).toLocaleDateString()
                                : "-"}
                          </span>
                        </div>

                        {/* Description */}
                        {experience.description && (
                          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
                            {experience.description}
                          </p>
                        )}

                        {/* Technologies */}
                        {experience.technologies?.length > 0 && (
                          <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Technologies
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map(
                                (technology, index) => (
                                  <span
                                    key={`${technology}-${index}`}
                                    className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                                  >
                                    {technology}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Responsibilities */}
                        {experience.responsibilities?.length >
                          0 && (
                          <div className="mt-5 border-t border-gray-100 pt-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Responsibilities
                            </p>

                            <ul className="space-y-2">
                              {experience.responsibilities.map(
                                (responsibility, index) => (
                                  <li
                                    key={`${responsibility}-${index}`}
                                    className="flex gap-2 text-sm leading-6 text-gray-600"
                                  >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />

                                    <span className="wrap-break-word">
                                      {responsibility}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Order */}
                        <p className="mt-4 text-xs text-gray-400">
                          Display order: {experience.order}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2 border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(experience)
                        }
                        className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 lg:flex-none"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(experience._id)
                        }
                        className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 lg:flex-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ExperienceManagement;

