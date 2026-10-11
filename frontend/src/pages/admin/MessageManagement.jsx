import { useEffect, useState } from "react";

import {
  getMessages,
  updateMessage,
  deleteMessage,
} from "../../services/message.service.js";

const MessageManagement = () => {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ========================================
  // LOAD MESSAGES
  // ========================================

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMessages();

        if (response.success) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch messages:",
          error,
        );

        setError(
          error.response?.data?.message ||
            "Failed to load messages.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  // ========================================
  // UPDATE MESSAGE STATUS
  // ========================================

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      const response = await updateMessage(id, {
        status,
      });

      if (response.success) {
        setMessages((prev) =>
          prev.map((message) =>
            message._id === id
              ? response.data
              : message,
          ),
        );

        setSuccess(
          "Message status updated successfully.",
        );
      }
    } catch (error) {
      console.error(
        "Failed to update message:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Failed to update message.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================
  // DELETE MESSAGE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteMessage(id);

      setMessages((prev) =>
        prev.filter(
          (message) => message._id !== id,
        ),
      );

      setSuccess("Message deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error,
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete message.",
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
            Loading messages...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // MESSAGE COUNTS
  // ========================================

  const unreadCount = messages.filter(
    (message) => message.status === "unread",
  ).length;

  const readCount = messages.filter(
    (message) => message.status === "read",
  ).length;

  const repliedCount = messages.filter(
    (message) => message.status === "replied",
  ).length;

  // ========================================
  // STATUS CONFIG
  // ========================================

  const getStatusConfig = (status) => {
    if (status === "unread") {
      return {
        label: "Unread",
        badge:
          "bg-purple-50 text-purple-700 border-purple-100",
        dot: "bg-purple-500",
      };
    }

    if (status === "read") {
      return {
        label: "Read",
        badge:
          "bg-blue-50 text-blue-700 border-blue-100",
        dot: "bg-blue-500",
      };
    }

    return {
      label: "Replied",
      badge:
        "bg-green-50 text-green-700 border-green-100",
      dot: "bg-green-500",
    };
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              <span>💬</span>
              Communication
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Messages
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Review and manage messages received through your
              portfolio contact form.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />

            <span className="text-xs font-semibold text-purple-700">
              {messages.length}{" "}
              {messages.length === 1
                ? "Message"
                : "Messages"}
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
          MESSAGE SUMMARY
      ======================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Messages
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {messages.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-lg">
              💬
            </div>
          </div>
        </div>

        {/* Unread */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Unread
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-lg">
              🔔
            </div>
          </div>
        </div>

        {/* Read */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Read
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {readCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
              ✓
            </div>
          </div>
        </div>

        {/* Replied */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Replied
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {repliedCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-lg">
              ↗
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          RECEIVED MESSAGES
      ======================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Received Messages
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review messages from visitors and update their
              status.
            </p>
          </div>

          <span className="text-xs font-medium text-gray-400">
            {messages.length} total
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-2xl">
              💬
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No messages found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Messages received through your portfolio contact
              form will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message) => {
              const isUpdating =
                updatingId === message._id;

              const statusConfig =
                getStatusConfig(message.status);

              return (
                <article
                  key={message._id}
                  className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${
                    message.status === "unread"
                      ? "border-purple-200 shadow-purple-100"
                      : "border-gray-200 hover:border-purple-200 hover:shadow-md"
                  }`}
                >
                  {/* Message Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {/* Avatar */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${
                            message.status === "unread"
                              ? "bg-purple-100"
                              : "bg-gray-100"
                          }`}
                        >
                          💬
                        </div>

                        {/* Sender Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`wrap-break-word text-base ${
                                message.status === "unread"
                                  ? "font-bold text-gray-900"
                                  : "font-semibold text-gray-800"
                              }`}
                            >
                              {message.subject}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                              />

                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className="font-semibold text-gray-700">
                              {message.name}
                            </span>

                            <span className="hidden text-gray-300 sm:inline">
                              •
                            </span>

                            <a
                              href={`mailto:${message.email}`}
                              className="wrap-break-word text-purple-600 transition-colors hover:text-purple-800"
                            >
                              {message.email}
                            </a>
                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            Received{" "}
                            {message.createdAt
                              ? new Date(
                                  message.createdAt,
                                ).toLocaleString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Message
                        </p>
                      </div>

                      <p className="wrap-break-word whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {message.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="mb-2 text-xs font-semibold text-gray-400">
                          Update Status
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {/* Unread */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(
                                message._id,
                                "unread",
                              )
                            }
                            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                              message.status === "unread"
                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                          >
                            {isUpdating &&
                            message.status !== "unread"
                              ? "Updating..."
                              : "Mark Unread"}
                          </button>

                          {/* Read */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(
                                message._id,
                                "read",
                              )
                            }
                            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                              message.status === "read"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            {isUpdating &&
                            message.status !== "read"
                              ? "Updating..."
                              : "Mark Read"}
                          </button>

                          {/* Replied */}
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleStatusChange(
                                message._id,
                                "replied",
                              )
                            }
                            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                              message.status === "replied"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            {isUpdating &&
                            message.status !== "replied"
                              ? "Updating..."
                              : "Mark Replied"}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(message._id)
                        }
                        className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 sm:w-auto"
                      >
                        Delete Message
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MessageManagement;

