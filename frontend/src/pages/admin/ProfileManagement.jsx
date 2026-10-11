import { useEffect, useState } from "react";
import { uploadImage } from "../../services/media.service.js";

import {
  getProfile,
  createProfile,
  updateProfile,
} from "../../services/profile.service.js";

const ProfileManagement = () => {
  const [profile, setProfile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    about: "",
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    resumeUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProfile();

        if (response.success && response.data) {
          setProfile(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        if (error.response?.status !== 404) {
          setError(
            error.response?.data?.message || "Failed to load profile.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const response = await uploadImage(file);

      if (!response.success || !response.data?.url) {
        throw new Error(response.message || "Image upload failed.");
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: response.data.url,
      }));

      setSuccess("Image uploaded successfully. Click Update Profile to save it.");
    } catch (error) {
      console.error("Profile image upload failed:", error);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (profile?._id) {
        response = await updateProfile(formData);
      } else {
        response = await createProfile(formData);
      }

      if (response.success) {
        setProfile(response.data);
        setFormData(response.data);
        setSuccess("Profile saved successfully.");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);

      setError(
        error.response?.data?.message || "Failed to save profile.",
      );
    } finally {
      setSaving(false);
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
            Loading profile...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // SHARED STYLES
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
              Portfolio Settings
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Profile Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the personal and professional information
              displayed on your public portfolio.
            </p>
          </div>

          {profile?._id && (
            <div className="flex w-fit items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-medium text-green-700">
                Profile configured
              </span>
            </div>
          )}
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
          PROFILE FORM
      ======================================== */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================
            BASIC INFORMATION
        ======================================== */}

        <section className={sectionClassName}>
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg">
                👤
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your name, professional title and introduction.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClassName}>
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="title" className={labelClassName}>
                Professional Title
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className={inputClassName}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="about" className={labelClassName}>
                About
              </label>

              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="6"
                placeholder="Write a short introduction about yourself..."
                className={`${inputClassName} resize-y leading-6`}
                required
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs leading-5 text-gray-400">
                  This information will appear in the About section
                  of your portfolio.
                </p>

                <span className="shrink-0 text-xs text-gray-400">
                  {formData.about.length} characters
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            CONTACT INFORMATION
        ======================================== */}

        <section className={sectionClassName}>
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg">
                📞
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Contact Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Contact details displayed on your portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClassName}>
                Phone
              </label>

              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className={labelClassName}>
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra, India"
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        {/* ========================================
            MEDIA & RESUME
        ======================================== */}

        <section className={sectionClassName}>
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg">
                🖼️
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Media & Resume
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add URLs for your profile image and resume.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">

            <div>
              <label
                htmlFor="profileImageFile"
                className={labelClassName}
              >
                Profile Image
              </label>

              <input
                id="profileImageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfileImageUpload}
                disabled={uploadingImage}
                className={inputClassName}
              />

              {uploadingImage && (
                <p className="mt-2 text-sm text-purple-600">
                  Uploading image to Cloudinary...
                </p>
              )}

              {formData.profileImage && (
                <div className="mt-4">
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="h-28 w-28 rounded-xl border border-gray-200 object-contain"
                  />

                  <p className="mt-2 break-all text-xs text-gray-500">
                    {formData.profileImage}
                  </p>
                </div>
              )}
            </div>


            <div>
              <label htmlFor="resumeUrl" className={labelClassName}>
                Resume URL
              </label>

              <input
                id="resumeUrl"
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClassName}
              />

              <p className="mt-2 text-xs text-gray-400">
                Add the public URL of your resume.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================
            SOCIAL LINKS
        ======================================== */}

        <section className={sectionClassName}>
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg">
                🔗
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Social & Portfolio Links
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Connect your professional profiles and portfolio.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">
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
              <label
                htmlFor="linkedinUrl"
                className={labelClassName}
              >
                LinkedIn URL
              </label>

              <input
                id="linkedinUrl"
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={inputClassName}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="portfolioUrl"
                className={labelClassName}
              >
                Portfolio URL
              </label>

              <input
                id="portfolioUrl"
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        {/* ========================================
            SAVE AREA
        ======================================== */}

        <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200 bg-gray-50/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {profile?._id
                  ? "Update your portfolio profile"
                  : "Create your portfolio profile"}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Your changes will be reflected on the public portfolio.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-purple-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <span>✓</span>
                  {profile?._id ? "Update Profile" : "Create Profile"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagement;

