import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, GraduationCap } from 'lucide-react';

/** Footer – brand blurb, quick links and contact info on a glass panel. */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-900/40 backdrop-blur-xl">
      <div className="section grid gap-10 py-14 md:grid-cols-4">
        {/* Brand column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold text-white">
              Nova<span className="text-gradient">Sync</span> AI
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            An AI-powered academic and wellness companion that brings smart task tracking, health
            logging and an interactive assistant into a single, beautiful workspace.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/services', 'Services'],
              ['/tracker', 'Health Tracker'],
              ['/chat', 'AI Chat'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-slate-400 transition-colors hover:text-violet-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-violet-300" /> hello@novasync.ai
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-violet-300" /> University Campus, Lab 4
            </li>
            <li className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-300" /> CSCI426 Project
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NovaSync AI · Built with React, Tailwind CSS &amp; React Router for
        CSCI426 Advanced Web Programming.
      </div>
    </footer>
  );
}
