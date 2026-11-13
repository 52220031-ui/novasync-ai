import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  HeartPulse,
  CalendarCheck,
  Check,
  ArrowRight,
  Bell,
  ShieldCheck,
  BarChart3,
  Download,
  Accessibility,
  WifiOff,
  Bot,
  User,
  Droplets,
  Moon,
  Dumbbell,
} from 'lucide-react';

/**
 * Service definitions. Tailwind needs full class names written out
 * (it cannot detect dynamically built strings), so each accent is explicit.
 */
const services = [
  {
    id: 'assistant',
    icon: Brain,
    name: 'AI Assistant',
    tagline: 'Ask anything. Get structured answers.',
    description:
      'A conversational workspace that explains concepts, debugs code, drafts outlines, solves quick maths and offers wellness tips, all in a clean multi-conversation interface.',
    features: [
      'Multiple saved conversations',
      'Study, Health and General modes',
      'Typing indicator & instant replies',
      'Suggested prompts to get started',
      'Chats stored privately in your browser',
      'Mobile-friendly chat drawer',
    ],
    steps: ['Pick a mode', 'Type any question', 'Get a structured answer', 'Follow up or start a new chat'],
    accent: {
      text: 'text-violet-300',
      bg: 'bg-violet-500/15',
      border: 'border-violet-400/50',
      glow: 'shadow-[0_0_40px_rgba(139,92,246,0.35)]',
      bar: 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
    },
  },
  {
    id: 'health',
    icon: HeartPulse,
    name: 'Health Tracker',
    tagline: 'Small habits. Big results.',
    description:
      'Log meals, exercise routines and daily activities, plus water, sleep and mood. Progress bars and a 7-day chart show how your habits add up, and everything is saved in your browser.',
    features: [
      'Meal log with calorie totals',
      'Exercise log: type, duration, intensity',
      'Daily activity log (study, social, chores)',
      'Water, sleep and mood check-in',
      'Browse any past day by date',
      '7-day trend chart with goal line',
    ],
    steps: ['Log meals & workouts', 'Check daily goals', 'Review the 7-day chart', 'Ask the AI for tips'],
    accent: {
      text: 'text-cyan-300',
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-400/50',
      glow: 'shadow-[0_0_40px_rgba(34,211,238,0.3)]',
      bar: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    },
  },
  {
    id: 'planner',
    icon: CalendarCheck,
    name: 'Study Planner',
    tagline: 'Turn deadlines into daily wins.',
    description:
      'Capture assignments and exams, prioritise what matters, and check tasks off as you go. The planner keeps your workload visible and manageable.',
    features: [
      'Quick-add task list',
      'Check off & delete tasks',
      'Progress at a glance',
      'Focus-block suggestions',
      'Exam countdown friendly',
      'Works alongside the AI chat',
    ],
    steps: ['Add your tasks', 'Prioritise the week', 'Focus in blocks', 'Tick off & celebrate'],
    accent: {
      text: 'text-fuchsia-300',
      bg: 'bg-fuchsia-500/15',
      border: 'border-fuchsia-400/50',
      glow: 'shadow-[0_0_40px_rgba(217,70,239,0.3)]',
      bar: 'bg-gradient-to-r from-fuchsia-500 to-pink-500',
    },
  },
];

const extras = [
  { icon: Bell, title: 'Smart Reminders', text: 'Nudges for deadlines, hydration and breaks.' },
  { icon: ShieldCheck, title: 'Privacy First', text: 'Data stays on your device by default.' },
  { icon: BarChart3, title: 'Progress Insights', text: 'Visual summaries of your weekly habits.' },
  { icon: Download, title: 'Export Ready', text: 'Save notes and plans for later use.' },
  { icon: Accessibility, title: 'Accessible UI', text: 'Keyboard friendly with readable contrast.' },
  { icon: WifiOff, title: 'Lightweight', text: 'Fast loading and minimal dependencies.' },
];

/** Small decorative preview that changes with the selected service. */
function Preview({ id }) {
  if (id === 'assistant') {
    return (
      <div className="space-y-3 text-sm">
        <div className="flex justify-end gap-2">
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-white">
            Explain React hooks simply
          </div>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
            <User className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
            Hooks let function components use state and lifecycle features. Start with useState and useEffect.
          </div>
        </div>
      </div>
    );
  }

  if (id === 'health') {
    const rows = [
      { icon: Droplets, label: 'Hydration', value: '6 / 8 glasses', pct: 'w-3/4' },
      { icon: Moon, label: 'Sleep', value: '7.5 hours', pct: 'w-5/6' },
      { icon: Dumbbell, label: 'Activity', value: '35 minutes', pct: 'w-1/2' },
    ];
    return (
      <div className="space-y-4">
        {rows.map(({ icon: Icon, label, value, pct }) => (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-300">
                <Icon className="h-4 w-4 text-cyan-300" /> {label}
              </span>
              <span className="text-slate-400">{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ${pct}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Study planner preview
  const tasks = [
    { t: 'Finish Web Programming project', done: true },
    { t: 'Revise database normalization', done: false },
    { t: 'Prepare presentation slides', done: false },
  ];
  return (
    <ul className="space-y-3">
      {tasks.map(({ t, done }) => (
        <li key={t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
              done ? 'border-fuchsia-400 bg-fuchsia-500/30 text-fuchsia-200' : 'border-white/20'
            }`}
          >
            {done && <Check className="h-3 w-3" />}
          </span>
          <span className={done ? 'text-slate-500 line-through' : 'text-slate-200'}>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  // Which service tab is currently selected.
  const [activeId, setActiveId] = useState('assistant');
  const active = services.find((s) => s.id === activeId);
  const ActiveIcon = active.icon;

  return (
    <>
      {/* ===== Header ===== */}
      <section className="section pb-10 pt-32 text-center lg:pt-40">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <span className="pill">Services &amp; Features</span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Three tools. One <span className="text-gradient">seamless</span> workspace.
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            Explore everything NovaSync AI can do for your academic life and your wellbeing.
          </p>
        </div>
      </section>

      {/* ===== Interactive tabs ===== */}
      <section className="section py-6">
        {/* Tab buttons */}
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
          {services.map(({ id, icon: Icon, name, accent }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? `${accent.border} ${accent.bg} ${accent.glow} text-white`
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? accent.text : ''}`} />
                {name}
              </button>
            );
          })}
        </div>

        {/* Detail panel (key re-mounts it so the fade animation replays on tab change) */}
        <div key={active.id} className="glass mt-10 animate-fade-up rounded-3xl p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${active.accent.bg} ${active.accent.text}`}>
                <ActiveIcon className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-3xl font-bold text-white">{active.name}</h2>
              <p className={`mt-1 font-medium ${active.accent.text}`}>{active.tagline}</p>
              <p className="mt-4 leading-relaxed text-slate-400">{active.description}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active.accent.bg} ${active.accent.text}`}>
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {/* Live preview */}
              <div className={`rounded-2xl border border-white/10 bg-ink-900/60 p-5 ${active.accent.glow}`}>
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Live preview</div>
                <Preview id={active.id} />
              </div>

              {/* How it works */}
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">How it works</div>
                <ol className="grid grid-cols-2 gap-3">
                  {active.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${active.accent.bar}`}>
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Extras ===== */}
      <section className="section py-16">
        <h2 className="text-center text-3xl font-bold text-white">
          Built for <span className="text-gradient">real student life</span>
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass glass-hover flex items-start gap-4 rounded-2xl p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section pb-6 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tracker" className="btn-primary">
            Open the Health Tracker <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/chat" className="btn-ghost">
            Try the AI Assistant
          </Link>
        </div>
      </section>
    </>
  );
}
