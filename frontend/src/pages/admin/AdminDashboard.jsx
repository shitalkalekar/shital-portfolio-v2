import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboardStats } from "../../services/dashboard.service.js";
import { getMessages } from "../../services/message.service.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    education: 0,
    certifications: 0,
    messages: 0,
    unreadMessages: 0,
  });

  const [recentMessages, setRecentMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const statsResponse = await getDashboardStats();

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        const messagesResponse = await getMessages();

        if (messagesResponse.success) {
          setRecentMessages(messagesResponse.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading dashboard...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // STATISTICS
  // ========================================

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: "💼",
      link: "/admin/projects",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: "⚡",
      link: "/admin/skills",
    },
    {
      title: "Experience",
      value: stats.experiences,
      icon: "🏢",
      link: "/admin/experience",
    },
    {
      title: "Education",
      value: stats.education,
      icon: "🎓",
      link: "/admin/education",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      icon: "📜",
      link: "/admin/certifications",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: "💬",
      link: "/admin/messages",
    },
  ];

  // ========================================
  // QUICK ACTIONS
  // ========================================

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update personal information",
      icon: "👤",
      link: "/admin/profile",
    },
    {
      title: "Manage Projects",
      description: "Add or update projects",
      icon: "💼",
      link: "/admin/projects",
    },
    {
      title: "Manage Skills",
      description: "Add or update skills",
      icon: "⚡",
      link: "/admin/skills",
    },
    {
      title: "Manage Experience",
      description: "Add or update experience",
      icon: "🏢",
      link: "/admin/experience",
    },
    {
      title: "Manage Education",
      description: "Add or update education",
      icon: "🎓",
      link: "/admin/education",
    },
    {
      title: "Manage Certifications",
      description: "Add or update certificates",
      icon: "📜",
      link: "/admin/certifications",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ========================================
          HEADER
      ======================================== */}

      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Admin Panel
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your portfolio content, projects, skills, and messages from
              one place.
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:w-auto"
          >
            <span>View Portfolio</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span className="mt-0.5">⚠️</span>

            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================
          PORTFOLIO OVERVIEW
      ======================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Portfolio Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A quick summary of your portfolio content.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
            >
              {/* Decorative accent */}
              <div className="absolute right-0 top-0 h-16 w-16 translate-x-5 -translate-y-5 rounded-full bg-purple-50 transition-transform duration-200 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-lg">
                    {card.icon}
                  </div>

                  <span className="text-sm text-gray-300 transition-colors group-hover:text-purple-500">
                    ↗
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Unread Messages */}
        <div className="mt-4 overflow-hidden rounded-xl border border-purple-100 bg-linear-to-r from-purple-50 to-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                🔔
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Unread Messages
                </p>

                <p className="mt-0.5 text-xs leading-5 text-gray-500">
                  Messages that still need your attention.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-2xl font-bold text-purple-700">
                {stats.unreadMessages}
              </span>

              <Link
                to="/admin/messages"
                className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:from-purple-700 hover:to-purple-500"
              >
                View Messages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          QUICK ACTIONS
      ======================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access your portfolio management sections.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-purple-200 hover:bg-purple-50/[0.4]hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg transition-colors group-hover:bg-purple-100">
                  {action.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {action.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {action.description}
                  </p>
                </div>

                <span className="text-sm text-gray-300 transition-colors group-hover:text-purple-500">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Messages Action */}
        <Link
          to="/admin/messages"
          className="group mt-3 block rounded-xl border border-purple-100 bg-purple-50/60 p-4 transition-all duration-200 hover:border-purple-200 hover:bg-purple-50"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
              💬
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">
                View Messages
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Check and manage contact messages received through your
                portfolio.
              </p>
            </div>

            <span className="text-sm font-semibold text-purple-600 transition-transform group-hover:translate-x-1">
              View →
            </span>
          </div>
        </Link>
      </section>

      {/* ========================================
          RECENT MESSAGES
      ======================================== */}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Messages
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest messages received through your portfolio.
            </p>
          </div>

          <Link
            to="/admin/messages"
            className="inline-flex w-fit text-sm font-semibold text-purple-600 transition-colors hover:text-purple-700"
          >
            View all →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl">
              💬
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No messages yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              New contact messages from your portfolio will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div
                key={message._id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4">
                  {/* Message Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="wrap-break-word text-sm font-semibold text-gray-900 sm:text-base">
                          {message.subject}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            message.status === "unread"
                              ? "bg-blue-50 text-blue-700"
                              : message.status === "replied"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:gap-5">
                        <p>
                          <span className="font-medium text-gray-700">
                            From:
                          </span>{" "}
                          {message.name}
                        </p>

                        <p className="min-w-0 truncate">
                          <span className="font-medium text-gray-700">
                            Email:
                          </span>{" "}
                          {message.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/messages"
                      className="inline-flex w-full shrink-0 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:w-auto"
                    >
                      View Messages
                    </Link>
                  </div>

                  {/* Message Preview */}
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                      {message.message}
                    </p>
                  </div>

                  {/* Message Date */}
                  {message.createdAt && (
                    <p className="text-xs text-gray-400">
                      Received {new Date(message.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;

