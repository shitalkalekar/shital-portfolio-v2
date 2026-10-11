import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const admin = useAuthStore((state) => state.admin);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Profile", path: "/admin/profile", icon: "👤" },
    { name: "Projects", path: "/admin/projects", icon: "💼" },
    { name: "Skills", path: "/admin/skills", icon: "⚡" },
    { name: "Experience", path: "/admin/experience", icon: "🏢" },
    { name: "Education", path: "/admin/education", icon: "🎓" },
    { name: "Certifications", path: "/admin/certifications", icon: "📜" },
    { name: "Messages", path: "/admin/messages", icon: "💬" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900">
            Shital Portfolio
          </h2>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl text-gray-700 transition hover:bg-gray-50"
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Shital Portfolio
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Management
          </p>

          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <span className="flex w-6 shrink-0 items-center justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Admin Information */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-400">
              Logged in as
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-gray-800">
              {admin?.name || "Admin"}
            </p>

            {admin?.email && (
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {admin.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen w-full md:ml-64 md:w-[calc(100%-16rem)]">
        {/* Mobile top spacing */}
        <div className="p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
