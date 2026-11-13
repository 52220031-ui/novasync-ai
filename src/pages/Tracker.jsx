import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Dumbbell,
  Footprints,
  Flame,
  Droplets,
  Moon,
  Smile,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  Bot,
  Info,
  CalendarDays,
  Eraser,
} from 'lucide-react';
import {
  loadHealth,
  saveHealth,
  getDay,
  dayTotals,
  todayKey,
  shiftKey,
  parseKey,
  GOALS,
  uid,
} from '../utils/health.js';

/* ==========================================================================
   CONFIG – one object per log type. The generic <LogForm> and entry list
   are driven entirely by this config, so adding a new log type is easy.
   (Tailwind needs full class names, so accent classes are written out.)
   ========================================================================== */

const TABS = [
  {
    id: 'meals',
    listKey: 'meals',
    label: 'Meals',
    icon: Utensils,
    accent: { text: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-400/50', btn: 'from-amber-500 to-orange-500' },
    fields: [
      { name: 'name', label: 'Food / meal', type: 'text', required: true, wide: true, placeholder: 'e.g. Chicken salad' },
      { name: 'type', label: 'Meal type', type: 'select', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], default: 'Breakfast' },
      { name: 'calories', label: 'Calories (kcal)', type: 'number', required: true, max: 3000, placeholder: '450' },
    ],
    presets: [
      { name: 'Oatmeal with fruit', type: 'Breakfast', calories: 320 },
      { name: 'Chicken & rice bowl', type: 'Lunch', calories: 550 },
      { name: 'Greek yoghurt', type: 'Snack', calories: 150 },
      { name: 'Pasta with veggies', type: 'Dinner', calories: 600 },
    ],
    describe: (e) => `${e.type} · ${e.calories} kcal`,
    emptyText: 'No meals logged yet. Add what you ate to track your energy intake.',
  },
  {
    id: 'exercise',
    listKey: 'workouts',
    label: 'Exercise',
    icon: Dumbbell,
    accent: { text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-400/50', btn: 'from-emerald-500 to-teal-500' },
    fields: [
      { name: 'name', label: 'Workout', type: 'text', required: true, wide: true, placeholder: 'e.g. Morning run' },
      { name: 'type', label: 'Type', type: 'select', options: ['Cardio', 'Strength', 'Yoga', 'Sports', 'Walking'], default: 'Cardio' },
      { name: 'minutes', label: 'Duration (min)', type: 'number', required: true, max: 300, placeholder: '30' },
      { name: 'intensity', label: 'Intensity', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
    ],
    presets: [
      { name: '30-minute jog', type: 'Cardio', minutes: 30, intensity: 'Medium' },
      { name: 'Bodyweight circuit', type: 'Strength', minutes: 20, intensity: 'High' },
      { name: 'Yoga flow', type: 'Yoga', minutes: 25, intensity: 'Low' },
      { name: 'Brisk walk', type: 'Walking', minutes: 20, intensity: 'Low' },
    ],
    describe: (e) => `${e.type} · ${e.minutes} min · ${e.intensity} intensity`,
    emptyText: 'No workouts logged yet. Even a short walk counts!',
  },
  {
    id: 'activities',
    listKey: 'activities',
    label: 'Activities',
    icon: Footprints,
    accent: { text: 'text-cyan-300', bg: 'bg-cyan-500/15', border: 'border-cyan-400/50', btn: 'from-cyan-500 to-blue-500' },
    fields: [
      { name: 'name', label: 'Activity', type: 'text', required: true, wide: true, placeholder: 'e.g. Study session' },
      { name: 'category', label: 'Category', type: 'select', options: ['Study', 'Social', 'Chores', 'Hobby', 'Commute', 'Relaxing', 'Other'], default: 'Study' },
      { name: 'minutes', label: 'Duration (min)', type: 'number', required: true, max: 1440, placeholder: '60' },
    ],
    presets: [
      { name: 'Focused study block', category: 'Study', minutes: 50 },
      { name: 'Time with friends', category: 'Social', minutes: 60 },
      { name: 'Meditation', category: 'Relaxing', minutes: 10 },
      { name: 'Tidy up room', category: 'Chores', minutes: 20 },
    ],
    describe: (e) => `${e.category} · ${e.minutes} min`,
    emptyText: 'No activities logged yet. Track how you spend your day.',
  },
];

const MOODS = ['Great', 'Good', 'Okay', 'Tired', 'Stressed'];

/* ==========================================================================
   SMALL PRESENTATIONAL COMPONENTS
   ========================================================================== */

/** Progress card: icon, current value vs goal, and an animated bar. */
function StatCard({ icon: Icon, label, value, goal, unit, iconClass, barClass }) {
  const pct = Math.min((value / goal) * 100, 100);
  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs text-slate-500">
          Goal {goal.toLocaleString()} {unit}
        </span>
      </div>
      <div className="mt-4 text-3xl font-extrabold text-white">
        {Number.isInteger(value) ? value.toLocaleString() : value}
        <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
      </div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/**
 * Generic add-entry form. Fields, validation rules and quick-add presets all
 * come from the `tab` config above. Validation runs on submit.
 */
function LogForm({ tab, onAdd }) {
  const initial = Object.fromEntries(tab.fields.map((f) => [f.name, f.default ?? '']));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = {};

    tab.fields.forEach((f) => {
      const raw = String(values[f.name]).trim();
      if (f.required && !raw) {
        found[f.name] = `${f.label} is required`;
      } else if (f.type === 'number' && raw) {
        const n = Number(raw);
        if (!Number.isFinite(n) || n <= 0) found[f.name] = 'Enter a number above 0';
        else if (f.max && n > f.max) found[f.name] = `Maximum is ${f.max}`;
      }
    });

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Convert number fields to real numbers before saving.
    onAdd(
      Object.fromEntries(
        tab.fields.map((f) => [f.name, f.type === 'number' ? Number(values[f.name]) : String(values[f.name]).trim()])
      )
    );
    setValues(initial);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        {tab.fields.map((f) => (
          <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
            <label htmlFor={`${tab.id}-${f.name}`} className="mb-1.5 block text-xs font-medium text-slate-400">
              {f.label}
            </label>
            {f.type === 'select' ? (
              <select
                id={`${tab.id}-${f.name}`}
                name={f.name}
                value={values[f.name]}
                onChange={handleChange}
                className="input-base appearance-none !py-2.5 text-sm"
              >
                {f.options.map((o) => (
                  <option key={o} value={o} className="bg-ink-900">
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`${tab.id}-${f.name}`}
                name={f.name}
                type={f.type}
                min={f.type === 'number' ? 1 : undefined}
                value={values[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={`input-base !py-2.5 text-sm ${errors[f.name] ? '!border-rose-400/70' : ''}`}
              />
            )}
            {errors[f.name] && (
              <p className="mt-1 text-xs text-rose-400" role="alert">
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <button type="submit" className={`btn-primary w-full !py-2.5 text-sm !bg-gradient-to-r ${tab.accent.btn}`}>
            <Plus className="h-4 w-4" /> Add {tab.label.toLowerCase().replace(/s$/, '')}
          </button>
        </div>
      </form>

      {/* Quick-add presets */}
      <div className="mt-5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quick add</div>
        <div className="flex flex-wrap gap-2">
          {tab.presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => onAdd(p)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   TRACKER PAGE
   ========================================================================== */

export default function Tracker() {
  // All logged data, keyed by date. Lazily loaded from localStorage once.
  const [data, setData] = useState(loadHealth);
  const [dateKey, setDateKey] = useState(todayKey);
  const [tabId, setTabId] = useState('meals');
  const [chartMetric, setChartMetric] = useState('calories');

  // Save to localStorage whenever the data changes.
  useEffect(() => {
    saveHealth(data);
  }, [data]);

  const today = todayKey();
  const isToday = dateKey === today;
  const day = getDay(data, dateKey);
  const totals = dayTotals(day);
  const tab = TABS.find((t) => t.id === tabId);
  const entries = day[tab.listKey];

  /* ----- Immutable update helpers (always create new objects/arrays) ----- */
  const updateDay = (updater) =>
    setData((prev) => ({ ...prev, [dateKey]: updater(getDay(prev, dateKey)) }));

  const addEntry = (listKey, entry) =>
    updateDay((d) => ({ ...d, [listKey]: [...d[listKey], { id: uid(), ...entry }] }));

  const removeEntry = (listKey, id) =>
    updateDay((d) => ({ ...d, [listKey]: d[listKey].filter((e) => e.id !== id) }));

  const setField = (field, value) => updateDay((d) => ({ ...d, [field]: value }));

  const clearDay = () => {
    if (!window.confirm('Delete everything logged for this day?')) return;
    setData((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  /* ----- Date navigation ----- */
  const goPrev = () => setDateKey((k) => shiftKey(k, -1));
  const goNext = () => setDateKey((k) => (k < today ? shiftKey(k, 1) : k));
  const handleDateInput = (e) => {
    const v = e.target.value;
    if (v && v <= today) setDateKey(v); // ISO date strings compare correctly as text
  };

  /* ----- Last 7 days for the chart ----- */
  const week = Array.from({ length: 7 }, (_, i) => {
    const key = shiftKey(today, i - 6);
    const t = dayTotals(getDay(data, key));
    return {
      key,
      label: parseKey(key).toLocaleDateString([], { weekday: 'short' }),
      calories: t.calories,
      exercise: t.exercise,
    };
  });
  const chartGoal = chartMetric === 'calories' ? GOALS.calories : GOALS.exercise;
  const chartMax = Math.max(chartGoal, ...week.map((w) => w[chartMetric]));
  const chartUnit = chartMetric === 'calories' ? 'kcal' : 'min';

  /* ----- Simple rule-based insights for the selected day ----- */
  const hasData =
    day.meals.length + day.workouts.length + day.activities.length > 0 || day.water > 0 || day.sleep !== '' || day.mood !== '';
  const insights = [];
  if (!hasData) {
    insights.push('Nothing logged for this day yet. Add a meal, workout or activity to get started.');
  } else {
    const glassesLeft = GOALS.water - day.water;
    insights.push(
      glassesLeft > 0
        ? `${glassesLeft} more glass${glassesLeft === 1 ? '' : 'es'} of water to reach the hydration goal.`
        : 'Hydration goal reached. Nice work!'
    );
    insights.push(
      totals.exercise >= GOALS.exercise
        ? `${totals.exercise} minutes of exercise logged, above the ${GOALS.exercise}-minute goal.`
        : `${GOALS.exercise - totals.exercise} more minutes of movement to reach the exercise goal.`
    );
    if (day.sleep !== '' && Number(day.sleep) < 7) insights.push('Under 7 hours of sleep can hurt focus. Try an earlier wind-down tonight.');
    if (day.mood === 'Stressed') insights.push('Feeling stressed? A short walk or breathing break can help. The AI chat has quick tips.');
  }

  const dateLabel = parseKey(dateKey).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* ===== Header ===== */}
      <section className="section pb-6 pt-28 lg:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="animate-fade-up">
            <span className="pill">Health Tracker</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Your daily <span className="text-gradient">wellness log</span>
            </h1>
            <p className="mt-3 max-w-xl text-slate-400">
              Log meals, exercise and everyday activities, then watch your progress build up. Everything is saved privately in
              your browser.
            </p>
          </div>

          {/* Date navigator */}
          <div className="glass flex items-center gap-1 rounded-2xl p-1.5">
            <button onClick={goPrev} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Previous day">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <label className="relative flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white hover:bg-white/5">
              <CalendarDays className="h-4 w-4 text-violet-300" />
              <span className="hidden sm:inline">{dateLabel}</span>
              <span className="sm:hidden">{parseKey(dateKey).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              <input
                type="date"
                value={dateKey}
                max={today}
                onChange={handleDateInput}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Pick a date"
              />
            </label>
            <button
              onClick={goNext}
              disabled={isToday}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next day"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {!isToday && (
              <button onClick={() => setDateKey(today)} className="ml-1 rounded-xl bg-violet-500/20 px-3 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/30">
                Today
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== Progress cards ===== */}
      <section className="section py-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Flame} label="Calories eaten" value={totals.calories} goal={GOALS.calories} unit="kcal" iconClass="bg-amber-500/15 text-amber-300" barClass="bg-gradient-to-r from-amber-400 to-orange-500" />
          <StatCard icon={Dumbbell} label="Exercise" value={totals.exercise} goal={GOALS.exercise} unit="min" iconClass="bg-emerald-500/15 text-emerald-300" barClass="bg-gradient-to-r from-emerald-400 to-teal-500" />
          <StatCard icon={Droplets} label="Water" value={day.water} goal={GOALS.water} unit="glasses" iconClass="bg-cyan-500/15 text-cyan-300" barClass="bg-gradient-to-r from-cyan-400 to-blue-500" />
          <StatCard icon={Moon} label="Sleep" value={Number(day.sleep) || 0} goal={GOALS.sleep} unit="hours" iconClass="bg-violet-500/15 text-violet-300" barClass="bg-gradient-to-r from-violet-400 to-fuchsia-500" />
        </div>
      </section>

      {/* ===== Main two-column area ===== */}
      <section className="section grid gap-6 py-6 lg:grid-cols-3">
        {/* ---------- Left: log tabs ---------- */}
        <div className="glass rounded-3xl p-5 sm:p-7 lg:col-span-2">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = t.id === tabId;
              return (
                <button
                  key={t.id}
                  onClick={() => setTabId(t.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive ? `${t.accent.border} ${t.accent.bg} text-white` : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? t.accent.text : ''}`} />
                  {t.label}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{day[t.listKey].length}</span>
                </button>
              );
            })}
          </div>

          {/* key={tab.id} resets the form's internal state when switching tabs */}
          <div className="mt-6">
            <LogForm key={tab.id} tab={tab} onAdd={(entry) => addEntry(tab.listKey, entry)} />
          </div>

          {/* Entry list */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                {isToday ? "Today's" : 'This day\'s'} {tab.label.toLowerCase()}
              </h2>
              {tab.id === 'meals' && entries.length > 0 && <span className="text-xs text-slate-400">{totals.calories} kcal total</span>}
              {tab.id === 'exercise' && entries.length > 0 && <span className="text-xs text-slate-400">{totals.exercise} min total</span>}
              {tab.id === 'activities' && entries.length > 0 && <span className="text-xs text-slate-400">{totals.activity} min total</span>}
            </div>

            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center text-sm text-slate-500">
                {tab.emptyText}
              </div>
            ) : (
              <ul className="space-y-2">
                {entries.map((e) => (
                  <li key={e.id} className="group flex animate-fade-up items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tab.accent.bg} ${tab.accent.text}`}>
                      <tab.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white">{e.name}</div>
                      <div className="text-xs text-slate-400">{tab.describe(e)}</div>
                    </div>
                    <button
                      onClick={() => removeEntry(tab.listKey, e.id)}
                      className="text-slate-500 transition hover:text-rose-400"
                      aria-label={`Delete ${e.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ---------- Right: check-in, chart, insights ---------- */}
        <div className="space-y-6">
          {/* Daily check-in */}
          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Daily check-in</h2>

            {/* Water */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-300">
                  <Droplets className="h-4 w-4 text-cyan-300" /> Water
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setField('water', Math.max(0, day.water - 1))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-white/20" aria-label="Remove a glass of water">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold text-white">{day.water}</span>
                  <button onClick={() => setField('water', Math.min(20, day.water + 1))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/25 text-cyan-100 hover:bg-cyan-500/40" aria-label="Add a glass of water">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: Math.max(GOALS.water, day.water) }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                      i < day.water ? 'border-cyan-400/60 bg-cyan-400/25 text-cyan-100' : 'border-white/10 text-slate-700'
                    }`}
                  >
                    <Droplets className="h-3.5 w-3.5" />
                  </span>
                ))}
              </div>
            </div>

            {/* Sleep */}
            <div className="mt-5">
              <label htmlFor="sleep" className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Moon className="h-4 w-4 text-violet-300" /> Sleep (hours)
              </label>
              <input
                id="sleep"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={day.sleep}
                placeholder="e.g. 7.5"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '' || (Number(v) >= 0 && Number(v) <= 24)) setField('sleep', v);
                }}
                className="input-base !py-2.5 text-sm"
              />
            </div>

            {/* Mood */}
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <Smile className="h-4 w-4 text-amber-300" /> Mood
              </div>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setField('mood', day.mood === m ? '' : m)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      day.mood === m ? 'border-amber-300/60 bg-amber-400/15 text-amber-100' : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly chart */}
          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Last 7 days</h2>
              <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
                {[
                  ['calories', 'Calories'],
                  ['exercise', 'Exercise'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setChartMetric(id)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${chartMetric === id ? 'bg-violet-500/30 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-40">
              {/* Dashed goal line */}
              <div className="absolute inset-x-0 border-t border-dashed border-white/20" style={{ bottom: `${(chartGoal / chartMax) * 100}%` }}>
                <span className="absolute -top-4 right-0 text-[10px] text-slate-500">
                  goal {chartGoal} {chartUnit}
                </span>
              </div>
              <div className="relative flex h-full items-end gap-2">
                {week.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => setDateKey(w.key)}
                    className="group flex h-full flex-1 items-end"
                    aria-label={`${w.label}: ${w[chartMetric]} ${chartUnit}`}
                    title={`${w.label}: ${w[chartMetric]} ${chartUnit}`}
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        w.key === dateKey
                          ? 'bg-gradient-to-t from-violet-600 to-fuchsia-500 shadow-[0_0_18px_rgba(217,70,239,0.5)]'
                          : 'bg-white/15 group-hover:bg-violet-400/50'
                      }`}
                      style={{ height: `${w[chartMetric] ? Math.max((w[chartMetric] / chartMax) * 100, 6) : 2}%` }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              {week.map((w) => (
                <span key={w.key} className={`flex-1 text-center text-[11px] ${w.key === dateKey ? 'font-semibold text-white' : 'text-slate-500'}`}>
                  {w.label}
                </span>
              ))}
            </div>
          </div>

          {/* Insights + AI shortcut */}
          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Insights</h2>
            <ul className="mt-4 space-y-2.5">
              {insights.map((text) => (
                <li key={text} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/chat" className="btn-ghost mt-5 w-full !py-2.5 text-sm">
              <Bot className="h-4 w-4" /> Ask the AI for tips
            </Link>
            {hasData && (
              <button onClick={clearDay} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs text-slate-500 transition hover:text-rose-400">
                <Eraser className="h-3.5 w-3.5" /> Clear this day
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== Disclaimer ===== */}
      <section className="section pb-4 pt-2">
        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Goals shown are general reference values, and this tool is not medical advice. For personal health or nutrition
          guidance, speak with a qualified professional.
        </p>
      </section>
    </>
  );
}
