import { useEffect, useState } from "react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/project.service.js";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    technologies: "",
    features: "",
    githubUrl: "",
    liveUrl: "",
    category: "Full Stack",
    featured: false,
    order: 0,
    isPublished: true,
  });

  // ========================================
  // LOAD PROJECTS
  // ========================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProjects();

        if (response.success) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);

        setError(
          error.response?.data?.message || "Failed to load projects.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
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
  // EDIT PROJECT
  // ========================================

  const handleEdit = (project) => {
    setEditingId(project._id);

    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      image: project.image || "",
      technologies: project.technologies?.join(", ") || "",
      features: project.features?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category || "Full Stack",
      featured: project.featured || false,
      order: project.order ?? 0,
      isPublished: project.isPublished ?? true,
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
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      image: "",
      technologies: "",
      features: "",
      githubUrl: "",
      liveUrl: "",
      category: "Full Stack",
      featured: false,
      order: 0,
      isPublished: true,
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
      const projectData = {
        ...formData,

        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        features: formData.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        order: Number(formData.order),
      };

      let response;

      if (editingId) {
        response = await updateProject(editingId, projectData);
      } else {
        response = await createProject(projectData);
      }

      if (response.success) {
        if (editingId) {
          setProjects((prev) =>
            prev.map((project) =>
              project._id === editingId ? response.data : project,
            ),
          );

          setSuccess("Project updated successfully.");
        } else {
          setProjects((prev) => [...prev, response.data]);

          setSuccess("Project created successfully.");
        }

        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to save project:", error);

      setError(
        error.response?.data?.message || "Failed to save project.",
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
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteProject(id);

      setProjects((prev) =>
        prev.filter((project) => project._id !== id),
      );

      setSuccess("Project deleted successfully.");

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);

      setError(
        error.response?.data?.message || "Failed to delete project.",
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
            Loading projects...
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
              Project Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Create, update, and manage the projects displayed on your public
              portfolio.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {projects.length} {projects.length === 1 ? "Project" : "Projects"}
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
          PROJECT FORM
      ======================================== */}

      <section className={sectionClassName}>
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected project information."
                  : "Add a new project to your portfolio."}
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Editing Project
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
              <div>
                <label htmlFor="title" className={labelClassName}>
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Shital Portfolio"
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className={labelClassName}>
                  Slug
                </label>

                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. shital-portfolio"
                  className={inputClassName}
                  required
                />

                <p className="mt-2 text-xs text-gray-400">
                  Used in the project URL.
                </p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="shortDescription" className={labelClassName}>
                  Short Description
                </label>

                <input
                  id="shortDescription"
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description of the project"
                  className={inputClassName}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="description" className={labelClassName}>
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
                  placeholder="Write a detailed description of the project..."
                  className={`${inputClassName} resize-y leading-6`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Project Details
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="image" className={labelClassName}>
                  Image URL
                </label>

                <input
                  id="image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClassName}
                />

                {formData.image && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                      src={formData.image}
                      alt="Project preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="technologies" className={labelClassName}>
                  Technologies
                </label>

                <input
                  id="technologies"
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  className={inputClassName}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Separate technologies with commas.
                </p>
              </div>

              <div>
                <label htmlFor="features" className={labelClassName}>
                  Features
                </label>

                <input
                  id="features"
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Authentication, CRUD, Dashboard"
                  className={inputClassName}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Separate features with commas.
                </p>
              </div>
            </div>
          </div>

          {/* Links & Category */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Links & Category
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="githubUrl" className={labelClassName}>
                  GitHub URL
                </label>

                <input
                  id="githubUrl"
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="liveUrl" className={labelClassName}>
                  Live URL
                </label>

                <input
                  id="liveUrl"
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClassName}
                />
              </div>

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
                  placeholder="Full Stack"
                  className={inputClassName}
                />
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  formData.featured
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                }`}
              >
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-purple-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Featured Project
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Highlight this project on your portfolio.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  formData.isPublished
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                }`}
              >
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Published
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Make this project visible on the public portfolio.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
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
                  {editingId ? "Update Project" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ========================================
          EXISTING PROJECTS
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage your portfolio projects.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {projects.length} total
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
              💼
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No projects found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Add your first project using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
              >
                {/* Project Image */}
                {project.image ? (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {project.featured && (
                        <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                          project.isPublished
                            ? "bg-white/95 text-green-700"
                            : "bg-white/95 text-gray-600"
                        }`}
                      >
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-purple-50">
                    <span className="text-4xl">💼</span>
                  </div>
                )}

                <div className="p-5">
                  {/* Title & Status */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {project.shortDescription}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {project.category}
                      </span>
                    </div>

                    {/* Technologies */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Features */}
                    {project.features?.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Features
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.features.map((feature, index) => (
                            <span
                              key={`${feature}-${index}`}
                              className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                          >
                            GitHub ↗
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                          >
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                      >
                        Edit Project
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project._id)}
                        className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
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

export default ProjectManagement;
