import { Link } from 'react-router-dom';
import {
  Target,
  Lightbulb,
  Users,
  GraduationCap,
  Code2,
  Palette,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    text: 'Help students perform at their best by connecting academic productivity with physical and mental wellbeing.',
  },
  {
    icon: Lightbulb,
    title: 'Our Vision',
    text: 'A future where every learner has a personal, intelligent assistant that understands both their workload and their wellbeing.',
  },
  {
    icon: Users,
    title: 'Our Values',
    text: 'Accessibility, privacy and honesty. Tools should empower students, not overwhelm or exploit them.',
  },
];

const timeline = [
  { step: '01', title: 'The Problem', text: 'Students juggle deadlines, health habits and endless questions across five different apps.' },
  { step: '02', title: 'The Idea', text: 'Merge planning, wellness logging and AI chat into one focused, delightful workspace.' },
  { step: '03', title: 'The Build', text: 'Designed and engineered with React, React Router and Tailwind CSS as a CSCI426 project.' },
  { step: '04', title: 'The Future', text: 'Real LLM integration, user accounts and cloud sync to take NovaSync from prototype to product.' },
];

const stack = ['React 18', 'React Router v6', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Responsive Design', 'Glassmorphism UI'];

// Checklist mapping the assignment requirements to what this app delivers.
const requirements = [
  'Multi-page navigation with React Router (6 pages)',
  'Reusable components: Navbar, Footer, page sections',
  'Dynamic state: chat, health logs saved in localStorage, form validation',
  'HealthTrack theme: log meals, exercise routines and daily activities',
  'Responsive layout for mobile and desktop',
  'Modern dark theme with glassmorphism and glow effects',
];

export default function About() {
  return (
    <>
      {/* ===== Header ===== */}
      <section className="section pb-12 pt-32 text-center lg:pt-40">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="pill">About NovaSync AI</span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Where <span className="text-gradient">intelligence</span> meets wellbeing
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            NovaSync AI is an academic and health assistant built around one simple belief: you learn
            better when you feel better. We combine smart task tracking, wellness logging and an
            interactive AI chat into a single, intuitive web application.
          </p>
        </div>
      </section>

      {/* ===== Mission / Vision / Values ===== */}
      <section className="section py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass glass-hover rounded-2xl p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Story timeline ===== */}
      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold text-white">
          Our <span className="text-gradient">story</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {timeline.map((t) => (
            <div key={t.step} className="glass relative rounded-2xl p-6">
              <span className="text-gradient text-4xl font-extrabold">{t.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Academic context ===== */}
      <section className="section py-10">
        <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <span className="pill">
                <GraduationCap className="h-4 w-4" /> Academic Project
              </span>
              <h2 className="mt-5 text-3xl font-bold text-white">CSCI426 · Advanced Web Programming</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                NovaSync AI was created as a university project to demonstrate modern front-end
                engineering: component-driven architecture, client-side routing, state management with
                hooks, accessible form validation and a polished, responsive UI.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Layers className="h-5 w-5 text-violet-300" /> Requirements covered
              </h3>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                      <Check className="h-3 w-3" />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Team (edit with your own details) ===== */}
      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold text-white">
          Meet the <span className="text-gradient">builders</span>
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {[
            { name: 'Your Name', role: 'Full-Stack Developer', icon: Code2, grad: 'from-violet-500 to-fuchsia-500' },
            { name: 'Your Teammate', role: 'UI/UX Designer', icon: Palette, grad: 'from-cyan-400 to-blue-500' },
          ].map(({ name, role, icon: Icon, grad }) => (
            <div key={name} className="glass glass-hover rounded-2xl p-6 text-center">
              <span className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${grad} shadow-[0_0_30px_rgba(139,92,246,0.35)]`}>
                <Icon className="h-9 w-9 text-white" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{name}</h3>
              <p className="text-sm text-slate-400">{role}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/services" className="btn-primary">
            See what we built <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
