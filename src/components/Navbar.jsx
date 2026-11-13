import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

// Single source of truth for navigation links (used by desktop + mobile menus).
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/chat', label: 'AI Chat' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Navbar – fixed glass header.
 * - Gains a stronger background after the user scrolls.
 * - Collapses into a hamburger menu on small screens.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position to toggle the "scrolled" style.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Active link gets a glowing pill; inactive links get a subtle hover.
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 lg:px-4 ${
      isActive
        ? 'bg-violet-500/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-white/10 bg-ink-950/70 backdrop-blur-2xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="section flex h-16 items-center justify-between">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-transform duration-300 group-hover:rotate-12">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Nova<span className="text-gradient">Sync</span> AI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Hidden below lg so the six nav links fit comfortably on tablets */}
        <div className="hidden lg:block">
          <Link to="/chat" className="btn-primary !px-5 !py-2 text-sm">
            Try the Assistant
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="glass flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`grid transition-all duration-300 md:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="section flex flex-col gap-1 pb-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
