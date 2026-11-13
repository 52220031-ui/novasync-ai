import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Brain,
  HeartPulse,
  CalendarCheck,
  ShieldCheck,
  Zap,
  Bot,
  User,
  Rocket,
} from 'lucide-react';

// Words that rotate inside the hero headline for a dynamic feel.
const rotatingWords = ['Study smarter.', 'Live healthier.', 'Ask anything.'];

const features = [
  {
    icon: Brain,
    title: 'Conversational AI',
    text: 'Ask homework, coding, wellness or life questions and get clear, structured answers in seconds.',
    color: 'text-violet-300 bg-violet-500/15',
  },
  {
    icon: CalendarCheck,
    title: 'Smart Study Planner',
    text: 'Turn deadlines into daily action plans with priorities, focus blocks and progress tracking.',
    color: 'text-fuchsia-300 bg-fuchsia-500/15',
  },
  {
    icon: HeartPulse,
    title: 'Health & Wellness Log',
    text: 'Log meals, workouts and daily activities, plus sleep, water and mood, then spot the habits that boost your grades.',
    color: 'text-cyan-300 bg-cyan-500/15',
  },
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    text: 'Your chats and logs stay in your browser. No sign-up, no tracking, no surprises.',
    color: 'text-emerald-300 bg-emerald-500/15',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    text: 'A lightweight React interface that feels instant on phones, tablets and desktops.',
    color: 'text-amber-300 bg-amber-500/15',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Experience',
    text: 'A glassmorphic dark interface that is easy on the eyes during those late-night study sessions.',
    color: 'text-pink-300 bg-pink-500/15',
  },
];

const stats = [
  { value: 12000, suffix: '+', label: 'Questions answered' },
  { value: 3500, suffix: '+', label: 'Study plans created' },
  { value: 98, suffix: '%', label: 'Student satisfaction' },
  { value: 24, suffix: '/7', label: 'Availability' },
];

/**
 * useCountUp – animates a number from 0 to `target` using requestAnimationFrame
 * with an ease-out curve. Used by the stats section.
 */
function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({ value, suffix, label }) {
  const count = useCountUp(value);
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="text-4xl font-extrabold text-white">
        {count.toLocaleString()}
        <span className="text-gradient">{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function Home() {
  // Rotating headline word index.
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="section grid items-center gap-12 pb-16 pt-32 lg:grid-cols-2 lg:pt-40">
        <div className="animate-fade-up">
          <span className="pill">
            <Sparkles className="h-4 w-4" /> Now in public beta · CSCI426 Edition
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your AI co-pilot to
            <br />
            {/* key forces React to re-mount the span so the fade animation replays */}
            <span key={wordIndex} className="text-gradient inline-block animate-fade-up">
              {rotatingWords[wordIndex]}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            NovaSync AI blends a smart study planner, a wellness tracker and an interactive assistant
            into one glowing workspace, so you can focus on learning while it keeps you balanced.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/chat" className="btn-primary">
              Start chatting <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/tracker" className="btn-ghost">
              Open the tracker
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {['from-violet-500 to-fuchsia-500', 'from-cyan-400 to-blue-500', 'from-pink-500 to-orange-400'].map(
                (g) => (
                  <span key={g} className={`h-8 w-8 rounded-full border-2 border-ink-950 bg-gradient-to-br ${g}`} />
                )
              )}
            </div>
            Trusted by students who like their tools fast and beautiful.
          </div>
        </div>

        {/* Floating glass chat preview */}
        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-cyan-400/20 blur-3xl" />
          <div className="glass relative animate-float rounded-3xl p-5 shadow-[0_0_60px_rgba(139,92,246,0.3)]">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs text-slate-500">NovaSync Assistant</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-end gap-2">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-white">
                  I have 3 exams next week and I'm sleeping badly. Help?
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <User className="h-4 w-4" />
                </span>
              </div>

              <div className="flex gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
                  Let's balance both. I built a 5-day plan with 90-minute focus blocks and a wind-down
                  routine so you sleep 7+ hours.
                  <div className="mt-3 space-y-1.5">
                    {['Mon: Algorithms review', 'Tue: Databases practice', 'Wed: Web Programming mock'].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce-dot rounded-full bg-violet-300"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="section py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="section py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="pill">
            <Rocket className="h-4 w-4" /> Features
          </span>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Everything you need to <span className="text-gradient">thrive</span> at university
          </h2>
          <p className="mt-4 text-slate-400">
            Three powerful tools, one seamless experience. Designed for the way students actually work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="glass glass-hover rounded-2xl p-6">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="section pb-10">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/30 blur-[90px]" />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to sync your studies and wellbeing?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Jump into the assistant and ask your first question. It only takes a few seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/chat" className="btn-primary">
                Open AI Chat <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
