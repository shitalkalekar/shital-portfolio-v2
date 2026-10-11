import { useEffect, useState } from "react";

import {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/education.service.js";

const emptyForm = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  order: 0,
  isVisible: true,
};

const EducationManagement = () => {
  const [educations, setEducations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // ========================================
  // LOAD EDUCATION
  // ========================================

  useEffect(() => {
    const loadEducations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEducations();

        if (response.success) {
          setEducations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch education:", error);

        setError(error.response?.data?.message || "Failed to load education.");
      } finally {
        setLoading(false);
      }
    };

    loadEducations();
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
  // EDIT EDUCATION
  // ========================================

  const handleEdit = (education) => {
    setEditingId(education._id);

    setFormData({
      institution: education.institution || "",
      degree: education.degree || "",
      fieldOfStudy: education.fieldOfStudy || "",
      location: education.location || "",
      startDate: education.startDate ? education.startDate.slice(0, 10) : "",
      endDate: education.endDate ? education.endDate.slice(0, 10) : "",
      description: education.description || "",
      order: education.order ?? 0,
      isVisible: education.isVisible ?? true,
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
      const educationData = {
        ...formData,
        order: Number(formData.order),
        endDate: formData.endDate || null,
      };

      let response;

      if (editingId) {
        response = await updateEducation(editingId, educationData);
      } else {
        response = await createEducation(educationData);
      }

      if (response.success) {
        if (editingId) {
          setEducations((prev) =>
            prev.map((education) =>
              education._id === editingId ? response.data : education,
            ),
          );

          setSuccess("Education updated successfully.");
        } else {
          setEducations((prev) => [...prev, response.data]);

          setSuccess("Education created successfully.");
        }

        setEditingId(null);
        setFormData({ ...emptyForm });
      }
    } catch (error) {
      console.error("Failed to save education:", error);

      setError(error.response?.data?.message || "Failed to save education.");
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteEducation(id);

      setEducations((prev) => prev.filter((education) => education._id !== id));

      setSuccess("Education deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete education:", error);

      setError(error.response?.data?.message || "Failed to delete education.");
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
            Loading education...
          </p>

          <p className="mt-1 text-xs text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // ========================================
  // COMMON STYLES
  // ========================================

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <span>🎓</span>
              Portfolio Content
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Education Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the educational background displayed on your public
              portfolio.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {educations.length}{" "}
              {educations.length === 1 ? "Education" : "Education Records"}
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
            <p className="font-semibold">Something went wrong</p>

            <p className="mt-1 leading-5 text-red-600">{error}</p>
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
            <p className="font-semibold">Changes saved</p>

            <p className="mt-1 leading-5 text-green-600">{success}</p>
          </div>
        </div>
      )}

      {/* ========================================
          EDUCATION FORM
      ======================================== */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Form Header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Education" : "Add New Education"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected education record."
                  : "Add a new educational qualification to your portfolio."}
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Editing Education
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Academic Information */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Academic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="institution" className={labelClass}>
                  Institution
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="institution"
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nutan College of Engineering and Research"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="degree" className={labelClass}>
                  Degree
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="degree"
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  placeholder="e.g. B.Tech"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="fieldOfStudy" className={labelClass}>
                  Field of Study
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="fieldOfStudy"
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Computer Science and Engineering"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, Maharashtra"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Education Period */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Education Period
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="startDate" className={labelClass}>
                  Start Date
                  <span className="ml-1 text-red-500">*</span>
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

              <div>
                <label htmlFor="endDate" className={labelClass}>
                  End Date
                </label>

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Leave empty if your education is still ongoing.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Additional Details
            </h3>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="description" className={labelClass}>
                  Description
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
                placeholder="Describe your education, specialization, achievements, academic work, etc."
                className={`${inputClass} resize-y leading-6`}
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Display Settings
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="order" className={labelClass}>
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
                  className="mt-0.5 h-4 w-4 accent-purple-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Visible on portfolio
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Show this education record publicly.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
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

                  {editingId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <span>✓</span>

                  {editingId ? "Update Education" : "Create Education"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ========================================
          EXISTING EDUCATION
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Education
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage your education records.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {educations.length} total
          </span>
        </div>

        {educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
              🎓
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No education records found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Add your first education record using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {educations.map((education) => (
              <article
                key={education._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* Education Information */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl sm:flex">
                        🎓
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
                            {education.degree}
                          </h3>

                          {!education.isVisible && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                              Hidden
                            </span>
                          )}

                          {education.endDate === null && (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              Ongoing
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm font-semibold text-purple-600">
                          {education.institution}
                        </p>

                        {education.fieldOfStudy && (
                          <p className="mt-1 text-sm text-gray-600">
                            {education.fieldOfStudy}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                          <span>
                            📍 {education.location || "Location not specified"}
                          </span>

                          <span>
                            📅{" "}
                            {education.startDate
                              ? new Date(
                                  education.startDate,
                                ).toLocaleDateString()
                              : "-"}{" "}
                            —{" "}
                            {education.endDate
                              ? new Date(education.endDate).toLocaleDateString()
                              : "Present"}
                          </span>
                        </div>

                        {education.description && (
                          <p className="mt-4 max-w-3xl wrap-break-word text-sm leading-6 text-gray-600">
                            {education.description}
                          </p>
                        )}

                        <p className="mt-4 text-xs text-gray-400">
                          Display order: {education.order}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-2 border-t border-gray-100 pt-4 lg:border-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(education)}
                        className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 lg:flex-none"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(education._id)}
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

export default EducationManagement;
