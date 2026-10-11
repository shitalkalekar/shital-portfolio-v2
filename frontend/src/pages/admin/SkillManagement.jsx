import { useEffect, useState } from "react";

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../../services/skill.service.js";

// ========================================
// SKILL MANAGEMENT
// ========================================

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: "Intermediate",
    icon: "",
    percentage: 0,
    order: 0,
    isVisible: true,
  });

  // ========================================
  // LOAD SKILLS
  // ========================================

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSkills();

        if (response.success) {
          setSkills(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);

        setError(
          error.response?.data?.message || "Failed to load skills.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
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

    setSuccess("");
    setError("");
  };

  // ========================================
  // EDIT SKILL
  // ========================================

  const handleEdit = (skill) => {
    setEditingId(skill._id);

    setFormData({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "Intermediate",
      icon: skill.icon || "",
      percentage: skill.percentage ?? 0,
      order: skill.order ?? 0,
      isVisible: skill.isVisible ?? true,
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

    setFormData({
      name: "",
      category: "",
      level: "Intermediate",
      icon: "",
      percentage: 0,
      order: 0,
      isVisible: true,
    });

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
      const skillData = {
        ...formData,
        percentage: Number(formData.percentage),
        order: Number(formData.order),
      };

      let response;

      if (editingId) {
        response = await updateSkill(editingId, skillData);
      } else {
        response = await createSkill(skillData);
      }

      if (response.success) {
        if (editingId) {
          setSkills((prev) =>
            prev.map((skill) =>
              skill._id === editingId ? (response.data.data || response.data) : skill,
            ),
          );

          setSuccess("Skill updated successfully.");
        } else {
          setSkills((prev) => [...prev, response.data.data || response.data]);

          setSuccess("Skill created successfully.");
        }

        setFormData({
          name: "",
          category: "",
          level: "Intermediate",
          icon: "",
          percentage: 0,
          order: 0,
          isVisible: true,
        });

        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to save skill:", error);

      setError(
        error.response?.data?.message || "Failed to save skill.",
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
      "Are you sure you want to delete this skill?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSkill(id);

      setSkills((prev) => prev.filter((skill) => skill._id !== id));

      setSuccess("Skill deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setError(
        error.response?.data?.message || "Failed to delete skill.",
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
            Loading skills...
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

  const inputClassName =
    "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50";

  const labelClassName =
    "block text-sm font-medium text-gray-700";

  const sectionClassName =
    "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm";

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Portfolio Content
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Skill Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the technical skills displayed on your public
              portfolio.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {skills.length}{" "}
              {skills.length === 1 ? "Skill" : "Skills"}
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
            <p className="font-semibold">Changes saved</p>

            <p className="mt-1 leading-5 text-green-600">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* ========================================
          SKILL FORM
      ======================================== */}

      <section className={sectionClassName}>
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Skill" : "Add New Skill"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected skill information."
                  : "Add a technical skill to your portfolio."}
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Editing Skill
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Skill Name */}
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Skill Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. React.js"
                  className={inputClassName}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className={labelClassName}>
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Frontend"
                  className={inputClassName}
                  required
                />
              </div>

              {/* Level */}
              <div>
                <label htmlFor="level" className={labelClassName}>
                  Skill Level
                </label>

                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon" className={labelClassName}>
                  Icon
                </label>

                <input
                  id="icon"
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. react"
                  className={inputClassName}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Enter the icon name or identifier used by your
                  portfolio.
                </p>
              </div>
            </div>
          </div>

          {/* Proficiency */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Proficiency & Ordering
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="percentage"
                    className={labelClassName}
                  >
                    Proficiency
                  </label>

                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                    {formData.percentage}%
                  </span>
                </div>

                <input
                  id="percentage"
                  type="number"
                  name="percentage"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={handleChange}
                  className={inputClassName}
                />

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        Math.max(Number(formData.percentage) || 0, 0),
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Enter a value between 0 and 100.
                </p>
              </div>

              <div>
                <label htmlFor="order" className={labelClassName}>
                  Display Order
                </label>

                <input
                  id="order"
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className={inputClassName}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Lower numbers appear first.
                </p>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Visibility
            </h3>

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
                  Show this skill on the public portfolio.
                </p>
              </div>
            </label>
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

                  {editingId ? "Update Skill" : "Create Skill"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ========================================
          EXISTING SKILLS
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Skills
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage your technical skills.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {skills.length} total
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
              ⚡
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No skills found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Add your first skill using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <article
                key={skill._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg font-semibold text-purple-700">
                      {skill.icon || "⚡"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="wrap-break-word font-semibold text-gray-900">
                        {skill.name}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {skill.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      skill.isVisible
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {skill.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>

                {/* Level */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Level
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {skill.level}
                  </span>
                </div>

                {/* Percentage */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      Proficiency
                    </span>

                    <span className="text-sm font-bold text-purple-600">
                      {skill.percentage}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${Math.min(
                          Math.max(Number(skill.percentage) || 0, 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Order */}
                <p className="mt-4 text-xs text-gray-400">
                  Display order: {skill.order}
                </p>

                {/* Actions */}
                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill._id)}
                    className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SkillManagement;

