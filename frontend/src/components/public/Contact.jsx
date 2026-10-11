import { useState } from "react";
import { createMessage } from "../../services/message.service.js";

const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await createMessage(formData);

      if (response.success) {
        setSuccess("Your message has been sent successfully!");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(response.message || "Failed to send your message.");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="border-t border-gray-100 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Let's build something together.
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Have a project, opportunity or idea you'd like to discuss? Send me a
            message and I'll get back to you.
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Information */}
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900">Get in touch</h3>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              I'm open to discussing full stack development opportunities,
              internships, projects and collaborations.
            </p>

            <div className="mt-8 space-y-5">
              {/* Email */}
              <a
                href={`mailto:${profile?.email}`}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
                  ✉
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 wrap-break-word text-sm font-medium text-gray-800">
                    {profile?.email}
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
                  📍
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {profile?.location}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Connect with me
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={profile?.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    GitHub
                  </a>

                  <a
                    href={profile?.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h3 className="text-xl font-bold text-gray-900">
                Send a message
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Fill out the form below and I'll receive your message.
              </p>
            </div>

            {success && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What would you like to discuss?"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  rows={6}
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-purple-700 hover:to-purple-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
