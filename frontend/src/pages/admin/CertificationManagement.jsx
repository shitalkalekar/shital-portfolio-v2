import { useEffect, useState } from "react";

import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../../services/certification.service.js";

const emptyForm = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  certificateImage: "",
  description: "",
  order: 0,
  isVisible: true,
};

const CertificationManagement = () => {
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // ========================================
  // LOAD CERTIFICATIONS
  // ========================================

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCertifications();

        if (response.success) {
          setCertifications(response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch certifications:",
          error,
        );

        setError(
          error.response?.data?.message ||
            "Failed to load certifications.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
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
  // EDIT CERTIFICATION
  // ========================================

  const handleEdit = (certification) => {
    setEditingId(certification._id);

    setFormData({
      title: certification.title || "",
      issuer: certification.issuer || "",
      issueDate: certification.issueDate
        ? certification.issueDate.slice(0, 10)
        : "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      certificateImage:
        certification.certificateImage || "",
      description: certification.description || "",
      order: certification.order ?? 0,
      isVisible: certification.isVisible ?? true,
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
      const certificationData = {
        ...formData,
        order: Number(formData.order),
      };

      let response;

      if (editingId) {
        response = await updateCertification(
          editingId,
          certificationData,
        );
      } else {
        response = await createCertification(
          certificationData,
        );
      }

      if (response.success) {
        if (editingId) {
          setCertifications((prev) =>
            prev.map((certification) =>
              certification._id === editingId
                ? response.data
                : certification,
            ),
          );

          setSuccess(
            "Certification updated successfully.",
          );
        } else {
          setCertifications((prev) => [
            ...prev,
            response.data,
          ]);

          setSuccess(
            "Certification created successfully.",
          );
        }

        setEditingId(null);
        setFormData({ ...emptyForm });
      }
    } catch (error) {
      console.error(
        "Failed to save certification:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Failed to save certification.",
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
      "Are you sure you want to delete this certification?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCertification(id);

      setCertifications((prev) =>
        prev.filter(
          (certification) =>
            certification._id !== id,
        ),
      );

      setSuccess(
        "Certification deleted successfully.",
      );

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(
        "Failed to delete certification:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete certification.",
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
            Loading certifications...
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
              <span>📜</span>
              Portfolio Content
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Certification Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the certifications displayed on your
              public portfolio.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {certifications.length}{" "}
              {certifications.length === 1
                ? "Certification"
                : "Certifications"}
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
          CERTIFICATION FORM
      ======================================== */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Form Header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId
                  ? "Edit Certification"
                  : "Add New Certification"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId
                  ? "Update the selected certification."
                  : "Add a new certification to your portfolio."}
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                Editing Certification
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Certification Information */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Certification Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className={labelClass}
                >
                  Certificate Title
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Full Stack Web Development"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="issuer"
                  className={labelClass}
                >
                  Issuing Organization
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="issuer"
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  placeholder="e.g. DevTown"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="issueDate"
                  className={labelClass}
                >
                  Issue Date
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="issueDate"
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Credential Information */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Credential Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="credentialId"
                  className={labelClass}
                >
                  Credential ID
                </label>

                <input
                  id="credentialId"
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  placeholder="e.g. CERT-12345"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Optional certificate or credential identification
                  number.
                </p>
              </div>

              <div>
                <label
                  htmlFor="credentialUrl"
                  className={labelClass}
                >
                  Credential URL
                </label>

                <input
                  id="credentialUrl"
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Link where the credential can be verified.
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="certificateImage"
                  className={labelClass}
                >
                  Certificate Image URL
                </label>

                <input
                  id="certificateImage"
                  type="url"
                  name="certificateImage"
                  value={formData.certificateImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Add the public URL of the certificate image.
                </p>

                {formData.certificateImage && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                      src={formData.certificateImage}
                      alt="Certificate preview"
                      className="max-h-64 w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Description
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Add additional information about this certification.
                </p>
              </div>

              <span className="shrink-0 text-xs text-gray-400">
                {formData.description.length} characters
              </span>
            </div>

            <label
              htmlFor="description"
              className="sr-only"
            >
              Certification Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the certificate, course, skills covered, achievements, etc."
              className={`${inputClass} resize-y leading-6`}
            />
          </div>

          {/* Display Settings */}
          <div className="p-5 sm:p-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Display Settings
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    Show this certification publicly.
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

                  {editingId
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <span>✓</span>

                  {editingId
                    ? "Update Certification"
                    : "Create Certification"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ========================================
          EXISTING CERTIFICATIONS
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Existing Certifications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage certifications already added
              to your portfolio.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {certifications.length} total
          </span>
        </div>

        {certifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-xl">
              📜
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No certifications found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Add your first certification using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {certifications.map((certification) => (
              <article
                key={certification._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-purple-200 hover:shadow-md"
              >
                {/* Certificate Image */}
                {certification.certificateImage ? (
                  <div className="relative h-52 overflow-hidden border-b border-gray-100 bg-gray-50">
                    <img
                      src={certification.certificateImage}
                      alt={certification.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />

                    {!certification.isVisible && (
                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                        Hidden
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center border-b border-gray-100 bg-purple-50">
                    <div className="text-center">
                      <div className="text-4xl">
                        📜
                      </div>

                      <p className="mt-2 text-xs font-semibold text-purple-600">
                        Certificate
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg">
                      📜
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="wrap-break-word text-base font-semibold leading-6 text-gray-900">
                          {certification.title}
                        </h3>

                        {!certification.isVisible &&
                          !certification.certificateImage && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                              Hidden
                            </span>
                          )}
                      </div>

                      <p className="mt-1 wrap-break-word text-sm font-semibold text-purple-600">
                        {certification.issuer}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                      📅{" "}
                      {certification.issueDate
                        ? new Date(
                            certification.issueDate,
                          ).toLocaleDateString()
                        : "-"}
                    </span>

                    {certification.credentialId && (
                      <span className="max-w-full wrap-break-word rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        ID: {certification.credentialId}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {certification.description && (
                    <p className="mt-4 wrap-break-word text-sm leading-6 text-gray-600">
                      {certification.description}
                    </p>
                  )}

                  {/* Credential Link */}
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-800"
                    >
                      View Credential
                      <span>↗</span>
                    </a>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(certification)
                      }
                      className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          certification._id,
                        )
                      }
                      className="flex-1 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
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

export default CertificationManagement;

