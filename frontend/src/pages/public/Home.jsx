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
  const { profile, loading, error, refetch } = useProfile();

  return (
    <main className="min-h-screen bg-white text-gray-800 dark:bg-[#0f111a] dark:text-gray-100">
      <Navbar profile={profile} />

      {loading && (
        <section
          aria-live="polite"
          className="flex min-h-[75vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-gray-700 dark:border-t-[#A58AEF]"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Loading portfolio...
          </p>
        </section>
      )}

      {!loading && error && (
        <section
          role="alert"
          className="flex min-h-[75vh] items-center justify-center px-4 pt-24 pb-16"
        >
          <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900/50 dark:bg-red-950/30 sm:p-8">
            <h1 className="text-lg font-bold text-red-800 dark:text-red-300">
              Unable to load portfolio
            </h1>
            <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-400">
              {error}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-purple-700 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {!loading && !error && !profile && (
        <section className="flex min-h-[75vh] items-center justify-center px-4 pt-24 pb-16">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-[#161822] sm:p-8">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Portfolio profile is not available yet.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>
        </section>
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

