/* ==========================================================================
   Health data helpers – shared by the Tracker page and the Chat side panel.

   Data shape saved in localStorage (one object, keyed by date "YYYY-MM-DD"):
   {
     "2026-11-13": {
       meals:      [{ id, name, type, calories }],
       workouts:   [{ id, name, type, minutes, intensity }],
       activities: [{ id, name, category, minutes }],
       water: 5,          // glasses
       sleep: "7.5",      // hours (string so the input can be empty)
       mood: "Good"
     }
   }
   ========================================================================== */

export const HEALTH_KEY = 'novasync.health.v1';

// Daily targets used for progress bars and insights.
export const GOALS = { calories: 2000, exercise: 30, water: 8, sleep: 8 };

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Date -> "YYYY-MM-DD" using the LOCAL date (toISOString would use UTC and can be off by a day). */
export const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const todayKey = () => toKey(new Date());

/** "YYYY-MM-DD" -> local Date at midnight. */
export const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Move a date key forward/backward by a number of days. */
export const shiftKey = (key, days) => {
  const d = parseKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
};

export const emptyDay = () => ({
  meals: [],
  workouts: [],
  activities: [],
  water: 0,
  sleep: '',
  mood: '',
});

/** Read everything from localStorage (returns {} if empty or corrupted). */
export function loadHealth() {
  try {
    const raw = JSON.parse(localStorage.getItem(HEALTH_KEY));
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw;
  } catch {
    /* ignore corrupted data */
  }
  return {};
}

export function saveHealth(data) {
  try {
    localStorage.setItem(HEALTH_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (e.g. private mode) – ignore */
  }
}

/** Get one day's record, filling in any missing fields with defaults. */
export const getDay = (data, key) => ({ ...emptyDay(), ...(data[key] || {}) });

/** Totals for a day, used by progress cards, the weekly chart and the chat panel. */
export function dayTotals(day) {
  const sum = (list, field) => list.reduce((total, item) => total + (Number(item[field]) || 0), 0);
  return {
    calories: sum(day.meals, 'calories'),
    exercise: sum(day.workouts, 'minutes'),
    activity: sum(day.activities, 'minutes'),
    meals: day.meals.length,
    workouts: day.workouts.length,
  };
}
