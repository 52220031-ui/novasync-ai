import "./style.css";
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Tracker from './pages/Tracker.jsx';
import Chat from './pages/Chat.jsx';
import Contact from './pages/Contact.jsx';

// Vite exposes the build's base path as BASE_URL ("/" or "/repo-name/"). React Router
// wants it without the trailing slash, so "/repo-name/" becomes "/repo-name".
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

/**
 * ScrollToTop – React Router keeps the scroll position between routes,
 * so we reset it to the top every time the pathname changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Simple 404 page for unknown URLs. */
function NotFound() {
  return (
    <section className="section flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <div className="glass mb-6 flex h-20 w-20 items-center justify-center rounded-3xl">
        <Compass className="h-10 w-10 text-violet-300" />
      </div>
      <h1 className="text-5xl font-extrabold text-white">404</h1>
      <p className="mt-3 max-w-md text-slate-400">
        This page drifted out of orbit. Let's get you back to somewhere familiar.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  );
}

/**
 * App – defines the global layout (background glow, navbar, footer)
 * and the route table. Each <Route> renders one full page.
 */
export default function App() {
  return (
    // basename comes from Vite's `base` option. It is "/" normally and the repo path
    // (e.g. "/novasync-ai") for the GitHub Pages build, so routes work in both cases.
    <BrowserRouter basename={BASENAME}>
      <ScrollToTop />

      {/* Decorative animated glow blobs behind all content */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] animate-blob rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] animate-blob rounded-full bg-fuchsia-600/20 blur-[120px] [animation-delay:-5s]" />
        <div className="absolute -bottom-32 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-cyan-500/15 blur-[120px] [animation-delay:-9s]" />
        {/* Subtle grid overlay for a techy feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <Navbar />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
