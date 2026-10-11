import Navbar from "../../components/public/Navbar.jsx";
import Hero from "../../components/public/Hero.jsx";
import About from "../../components/public/About.jsx";
import Skills from "../../components/public/Skills.jsx";
import Projects from "../../components/public/Projects.jsx";
import Experience from "../../components/public/Experience.jsx";
import Education from "../../components/public/Education.jsx";
import Certifications from "../../components/public/Certifications.jsx";
import Contact from "../../components/public/Contact.jsx";
import Footer from "../../components/public/Footer.jsx";

import useProfile from "../../hooks/useProfile.js";

const Home = () => {
  const { profile, loading, error } = useProfile();

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar profile={profile} />

      {loading && (
        <div className="flex min-h-30 items-center justify-center">
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && profile && (
        <>
          <Hero profile={profile} />
          <About profile={profile} />
          <Skills />
          <Projects />
          <Experience />
          <Education />
          <Certifications />
          <Contact profile={profile} />
          <Footer profile={profile} />
        </>
      )}
    </main>
  );
};

export default Home;

