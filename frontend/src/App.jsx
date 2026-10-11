import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import ProfileManagement from "./pages/admin/ProfileManagement.jsx";
import ProjectManagement from "./pages/admin/ProjectManagement.jsx";
import SkillManagement from "./pages/admin/SkillManagement.jsx";
import ExperienceManagement from "./pages/admin/ExperienceManagement.jsx";
import EducationManagement from "./pages/admin/EducationManagement.jsx";
import CertificationManagement from "./pages/admin/CertificationManagement.jsx";
import MessageManagement from "./pages/admin/MessageManagement.jsx";

import Home from "./pages/public/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/profile" element={<ProfileManagement />} />

            <Route path="/admin/projects" element={<ProjectManagement />} />

            <Route path="/admin/skills" element={<SkillManagement />} />

            <Route
              path="/admin/experience"
              element={<ExperienceManagement />}
            />

            <Route path="/admin/education" element={<EducationManagement />} />

            <Route
              path="/admin/certifications"
              element={<CertificationManagement />}
            />

            <Route path="/admin/messages" element={<MessageManagement />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
