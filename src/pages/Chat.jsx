import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadHealth, saveHealth, getDay, dayTotals, todayKey, GOALS } from '../utils/health.js';
import {
  Bot,
  User,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Menu,
  X,
  Eraser,
  Sparkles,
  ListChecks,
  Droplets,
  Smile,
  Check,
} from 'lucide-react';

/* ==========================================================================
   CONSTANTS & HELPERS
   ========================================================================== */

const STORAGE_KEY = 'novasync.conversations.v1';

// The three assistant "modes" the user can switch between.
const MODES = [
  { id: 'general', label: 'General' },
  { id: 'study', label: 'Study' },
  { id: 'health', label: 'Health' },
];

// Opening message for each mode.
const GREETINGS = {
  general: "Hi, I'm NovaSync AI. Ask me anything: coding, ideas, quick maths, general knowledge, you name it.",
  study: "Study mode on. Tell me what you're learning or when your exam is, and I'll help you plan and understand it.",
  health: "Wellness mode on. Ask about sleep, hydration, stress or movement and I'll share simple, practical tips.",
};

const SUGGESTIONS = [
  'Help me plan my study week',
  'Explain React hooks simply',
  'How can I sleep better?',
  'Give me a 25-minute focus routine',
  'What is 24 * 7 + 18?',
];

// Same mood options as the Health Tracker page so both stay in sync.
const MOOD_OPTIONS = ['Great', 'Good', 'Okay', 'Tired', 'Stressed'];

const uid = () => Math.random().toString(36).slice(2, 10);

const createMessage = (role, content) => ({
  id: uid(),
  role,
  content,
  time: new Date().toISOString(),
});

const createConversation = (mode = 'general') => ({
  id: uid(),
  title: 'New chat',
  mode,
  messages: [createMessage('assistant', GREETINGS[mode])],
});

const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* ==========================================================================
   SIMULATED "AI" ENGINE
   There is no real backend: replies are generated locally by matching
   keywords. Swap generateReply() for a real API call to use a real LLM.
   ========================================================================== */

// Each rule: a regex tested against the lowercase user text + a canned reply.
const RULES = [
  {
    test: /^(hi|hello|hey|good (morning|afternoon|evening))\b/,
    reply:
      "Hello! Great to see you. I can help with studying, coding, wellness habits or general questions. What's on your mind?",
  },
  {
    test: /(who are you|what are you|your name)/,
    reply:
      "I'm **NovaSync AI**, a demo assistant built for a university web programming project. My answers are simulated, but the interface is fully interactive.",
  },
  {
    test: /(thank|thanks|appreciate)/,
    reply: "You're very welcome! Let me know if there's anything else I can help with.",
  },
  {
    test: /(study|exam|test|revision|revise|deadline|assignment|plan my)/,
    reply:
      'Here is a simple plan you can start today:\n- **Map it out:** list every exam/deadline with its date and weight.\n- **Prioritise:** tackle the hardest or highest-value subject first.\n- **Focus blocks:** 50 minutes of work, then a 10-minute break.\n- **Active recall:** quiz yourself instead of rereading notes.\n- **Review:** spend 15 minutes each evening summarising what you learned.\nWant me to turn this into tasks in your planner panel?',
  },
  {
    test: /(focus|pomodoro|procrastinat|concentrat|distract)/,
    reply:
      'Try this **25-minute focus routine**:\n- Silence your phone and close extra tabs.\n- Write down one clear goal for the session.\n- Work for 25 minutes without switching tasks.\n- Take a 5-minute break: stretch, water, look away from the screen.\n- After four rounds, take a longer 20-minute break.',
  },
  {
    test: /(sleep|insomnia|tired|rest|nap)/,
    reply:
      'Better sleep usually comes from consistency:\n- Aim for **7-9 hours** at roughly the same time every night.\n- Avoid caffeine in the late afternoon.\n- Dim lights and put screens away 30-60 minutes before bed.\n- Keep your room cool, dark and quiet.\nIf sleep problems continue, it is worth talking to a healthcare professional.',
  },
  {
    test: /(water|hydrat|thirst)/,
    reply:
      'Staying hydrated helps concentration and energy. A common goal is around **8 glasses a day**, more if you exercise. Keep a bottle at your desk and use the water counter in the side panel to track it.',
  },
  {
    test: /(stress|anxious|anxiety|overwhelm|worried|panic)/,
    reply:
      "That sounds like a lot, and it's okay to feel that way. A few things that can help:\n- **Breathe:** inhale for 4 seconds, hold for 4, exhale for 6. Repeat a few times.\n- **Shrink the task:** pick one small next step instead of the whole pile.\n- **Move:** a short walk can reset your mind.\n- **Talk:** share how you feel with a friend, family member or campus counselling service.",
  },
  {
    test: /(workout|exercise|gym|fitness|run|walk|stretch)/,
    reply:
      'Movement boosts mood and memory. A simple routine:\n- 5 minutes of light warm-up\n- 10 minutes of bodyweight moves (squats, push-ups, planks)\n- 5 minutes of stretching\nEven a **20-minute daily walk** makes a real difference. Listen to your body and build up gradually.',
  },
  {
    test: /(eat|food|diet|meal|nutrition|snack|breakfast)/,
    reply:
      'For steady energy while studying:\n- Start the day with protein and fibre (eggs, oats, yoghurt, fruit).\n- Choose snacks like nuts, fruit or hummus over sugary drinks.\n- Do not skip meals before long study sessions.\nFor personal dietary advice, a registered dietitian is the best source.',
  },
  {
    test: /(react|hook|usestate|useeffect|component|jsx)/,
    reply:
      '**React hooks** let function components use state and lifecycle features:\n- **useState** stores values that change over time, like form input.\n- **useEffect** runs side effects such as fetching data or adding event listeners.\n- **useRef** keeps a mutable value or DOM reference without re-rendering.\n- **Custom hooks** let you reuse logic across components.\nWould you like a small example?',
  },
  {
    test: /(javascript|js\b|python|java\b|code|coding|program|bug|debug|html|css|tailwind)/,
    reply:
      "Happy to help with code. For the best answer:\n- Describe what you **expect** to happen and what actually happens.\n- Share the relevant snippet and any **error message**.\n- Mention the language or framework you're using.\nA good debugging habit: reproduce the bug, isolate the smallest failing piece, then fix and re-test.",
  },
  {
    test: /(summar|essay|write|outline|paragraph|thesis)/,
    reply:
      'A reliable structure for writing:\n- **Thesis:** one clear sentence stating your main argument.\n- **Outline:** 3 supporting points, each with evidence.\n- **Draft fast:** get ideas down before polishing.\n- **Revise:** cut repetition, check flow, then proofread.\nPaste a paragraph and I can suggest improvements.',
  },
  {
    test: /(motivat|inspire|give up|lazy|discouraged)/,
    reply:
      "Progress beats perfection. Start with just **five minutes** on the task; momentum usually follows. Celebrate small wins, and remember that every expert was once a beginner.",
  },
  {
    test: /(what time|what date|today)/,
    reply: () =>
      `Right now it's **${new Date().toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}** according to your device.`,
  },
];

/** Returns an assistant reply string for the given user input. */
function generateReply(input, mode) {
  const q = input.toLowerCase().trim();

  // 1) Simple arithmetic: strip phrases like "what is ... ?" first. Only digits and
  //    operators are allowed through, so evaluating the expression is safe.
  const expr = q.replace(/^(what is|what's|calculate|solve|compute)\s+/, '').replace(/[?=\s]+$/, '');
  if (/^[\d\s+\-*/().%]+$/.test(expr) && /\d/.test(expr) && /[+\-*/%]/.test(expr)) {
    try {
      const result = Function(`"use strict"; return (${expr});`)();
      if (Number.isFinite(result)) return `The answer is **${Number(result.toFixed(6))}**.`;
    } catch {
      /* not a valid expression, fall through to the other rules */
    }
  }

  // 2) Keyword rules.
  for (const rule of RULES) {
    if (rule.test.test(q)) return typeof rule.reply === 'function' ? rule.reply() : rule.reply;
  }

  // 3) Fallback: a thoughtful generic answer that adapts to the current mode.
  const topic = input.length > 70 ? `${input.slice(0, 70)}…` : input;
  const intro = {
    general: `Good question. Let's think through **"${topic}"** together.`,
    study: `Let's break **"${topic}"** down like a study topic.`,
    health: `Let's look at **"${topic}"** from a wellbeing point of view.`,
  }[mode];

  return `${intro}\n- **Clarify:** define exactly what you want to know or achieve.\n- **Break it down:** split it into two or three smaller parts.\n- **Gather:** note what you already know and what's missing.\n- **Act:** choose the smallest next step and try it.\nTell me more details and I'll tailor my answer. (This is a simulated demo response.)`;
}

/** Tiny renderer: supports "- " bullets and **bold** text. */
function RichText({ text }) {
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        const isBullet = line.startsWith('- ');
        const content = isBullet ? line.slice(2) : line;

        // Split on **bold** segments and style them.
        const parts = content.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        );

        return isBullet ? (
          <div key={i} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            <span>{parts}</span>
          </div>
        ) : (
          <p key={i}>{parts}</p>
        );
      })}
    </div>
  );
}

/* ==========================================================================
   CHAT PAGE COMPONENT
   ========================================================================== */

export default function Chat() {
  // ----- Conversations (persisted to localStorage) -----
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {
      /* ignore corrupted storage */
    }
    return [createConversation()];
  });
  const [activeId, setActiveId] = useState(() => conversations[0].id);

  // ----- UI state -----
  const [input, setInput] = useState('');
  const [typingId, setTypingId] = useState(null); // id of the conversation currently "typing"
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer

  // ----- Side-panel mini tools -----
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Review lecture notes', done: true },
    { id: 't2', text: 'Finish CSCI426 project', done: false },
  ]);
  const [newTask, setNewTask] = useState('');

  // Water and mood come from the SAME localStorage data as the Health Tracker page,
  // so a change here shows up there (and vice versa).
  const [health, setHealth] = useState(loadHealth);
  const healthToday = getDay(health, todayKey());
  const water = healthToday.water;
  const mood = healthToday.mood;
  const todayTotals = dayTotals(healthToday);
  const setHealthField = (field, value) =>
    setHealth((prev) => {
      const key = todayKey();
      return { ...prev, [key]: { ...getDay(prev, key), [field]: value } };
    });
  const setWater = (value) => setHealthField('water', value);
  const setMood = (value) => setHealthField('mood', value);

  const bottomRef = useRef(null);
  const timeoutsRef = useRef([]);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const isTyping = typingId === active.id;

  // Persist conversations whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      /* storage may be unavailable (private mode); ignore */
    }
  }, [conversations]);

  // Persist health data (water/mood) whenever it changes.
  useEffect(() => {
    saveHealth(health);
  }, [health]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [active.messages.length, isTyping, activeId]);

  // Clear any pending reply timers when leaving the page.
  useEffect(() => {
    const timers = timeoutsRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /** Immutable helper: update one conversation by id. */
  const updateConversation = (id, updater) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));

  /** Send a user message, show the typing loader, then append the simulated reply. */
  const sendMessage = (text) => {
    const content = text.trim();
    if (!content || typingId === active.id) return;

    const convId = active.id;
    const mode = active.mode;

    updateConversation(convId, (c) => ({
      ...c,
      // First user message becomes the conversation title.
      title: c.title === 'New chat' ? (content.length > 28 ? `${content.slice(0, 28)}…` : content) : c.title,
      messages: [...c.messages, createMessage('user', content)],
    }));
    setInput('');
    setTypingId(convId);

    // Simulate "thinking" time proportional to reply length.
    const reply = generateReply(content, mode);
    const delay = 900 + Math.min(reply.length * 4, 1600);
    const t = setTimeout(() => {
      updateConversation(convId, (c) => ({ ...c, messages: [...c.messages, createMessage('assistant', reply)] }));
      setTypingId((cur) => (cur === convId ? null : cur));
    }, delay);
    timeoutsRef.current.push(t);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Enter sends, Shift+Enter inserts a new line.
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startNewChat = () => {
    const conv = createConversation(active.mode);
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setSidebarOpen(false);
  };

  const deleteConversation = (id) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const fresh = createConversation();
      setConversations([fresh]);
      setActiveId(fresh.id);
      return;
    }
    setConversations(remaining);
    if (id === activeId) setActiveId(remaining[0].id);
  };

  const clearChat = () =>
    updateConversation(active.id, (c) => ({
      ...c,
      title: 'New chat',
      messages: [createMessage('assistant', GREETINGS[c.mode])],
    }));

  const changeMode = (modeId) =>
    updateConversation(active.id, (c) => ({
      ...c,
      mode: modeId,
      messages: [...c.messages, createMessage('assistant', GREETINGS[modeId])],
    }));

  // ----- Task helpers -----
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((t) => [...t, { id: uid(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };
  const toggleTask = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const removeTask = (id) => setTasks((t) => t.filter((x) => x.id !== id));
  const doneCount = tasks.filter((t) => t.done).length;

  const showSuggestions = active.messages.length <= 1;

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <section className="mx-auto max-w-[96rem] px-3 pb-6 pt-24 sm:px-6">
      <div className="glass relative flex h-[calc(100vh-7.5rem)] min-h-[560px] overflow-hidden rounded-3xl">
        {/* ============ LEFT: conversation list (drawer on mobile) ============ */}
        {sidebarOpen && (
          <div className="absolute inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/10 bg-ink-900/95 backdrop-blur-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:bg-transparent ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Conversations</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden" aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-3">
            <button onClick={startNewChat} className="btn-primary w-full !py-2.5 text-sm">
              <Plus className="h-4 w-4" /> New chat
            </button>
          </div>

          <ul className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {conversations.map((c) => (
              <li key={c.id}>
                <div
                  className={`group flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                    c.id === active.id
                      ? 'border-violet-400/40 bg-violet-500/15 text-white'
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveId(c.id);
                      setSidebarOpen(false);
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </button>
                  <button
                    onClick={() => deleteConversation(c.id)}
                    className="text-slate-500 opacity-100 transition hover:text-rose-400 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label={`Delete conversation ${c.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* ============ CENTER: messages + composer ============ */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:text-white lg:hidden"
                aria-label="Open conversations"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">NovaSync Assistant</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mode switcher */}
              <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.id !== active.mode && changeMode(m.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      active.mode === m.id
                        ? 'bg-violet-500/30 text-white shadow-[0_0_14px_rgba(139,92,246,0.45)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button
                onClick={clearChat}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition hover:text-white"
                aria-label="Clear this chat"
                title="Clear this chat"
              >
                <Eraser className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
            {active.messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex animate-fade-up gap-3 ${isUser ? 'justify-end' : ''}`}>
                  {!isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? 'rounded-tr-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]'
                          : 'rounded-tl-sm border border-white/10 bg-white/5 text-slate-200'
                      }`}
                    >
                      {isUser ? <p className="whitespace-pre-wrap break-words">{m.content}</p> : <RichText text={m.content} />}
                    </div>
                    <div className={`mt-1 text-[11px] text-slate-500 ${isUser ? 'text-right' : ''}`}>{formatTime(m.time)}</div>
                  </div>
                  {isUser && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-200">
                      <User className="h-4 w-4" />
                    </span>
                  )}
                </div>
              );
            })}

            {/* Typing loader */}
            {isTyping && (
              <div className="flex animate-fade-up gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-4" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 animate-bounce-dot rounded-full bg-violet-300" style={{ animationDelay: `${i * 0.18}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggested prompts (only on a fresh chat) */}
            {showSuggestions && !isTyping && (
              <div className="pt-2">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Try asking</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition-all hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/25">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask NovaSync anything…"
                className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.45)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Simulated AI for a university demo. Press Enter to send, Shift+Enter for a new line.
            </p>
          </form>
        </div>

        {/* ============ RIGHT: quick tools (desktop xl+) ============ */}
        <aside className="hidden w-72 shrink-0 space-y-5 overflow-y-auto border-l border-white/10 p-4 xl:block">
          {/* Study tasks */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <ListChecks className="h-4 w-4 text-fuchsia-300" /> Study tasks
              </h3>
              <span className="text-xs text-slate-400">
                {doneCount}/{tasks.length}
              </span>
            </div>

            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-500"
                style={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0%' }}
              />
            </div>

            <ul className="space-y-1.5">
              {tasks.map((t) => (
                <li key={t.id} className="group flex items-center gap-2 text-sm">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      t.done ? 'border-fuchsia-400 bg-fuchsia-500/30 text-fuchsia-100' : 'border-white/25 hover:border-fuchsia-400'
                    }`}
                    aria-label={t.done ? 'Mark as not done' : 'Mark as done'}
                  >
                    {t.done && <Check className="h-3 w-3" />}
                  </button>
                  <span className={`flex-1 truncate ${t.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{t.text}</span>
                  <button onClick={() => removeTask(t.id)} className="text-slate-600 opacity-0 transition hover:text-rose-400 group-hover:opacity-100" aria-label="Delete task">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              {tasks.length === 0 && <li className="text-xs text-slate-500">No tasks yet. Add one below.</li>}
            </ul>

            <form onSubmit={addTask} className="mt-3 flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task…"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-fuchsia-400/60"
              />
              <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/20 text-fuchsia-200 hover:bg-fuchsia-500/30" aria-label="Add task">
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Hydration */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Droplets className="h-4 w-4 text-cyan-300" /> Hydration
            </h3>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {Array.from({ length: GOALS.water }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWater(i + 1 === water ? i : i + 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                    i < water ? 'border-cyan-400/60 bg-cyan-400/25 text-cyan-100' : 'border-white/15 text-slate-600 hover:border-cyan-400/40'
                  }`}
                  aria-label={`Set water to ${i + 1} glasses`}
                >
                  <Droplets className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {water} of {GOALS.water} glasses today
            </p>
          </div>

          {/* Today's totals from the Health Tracker */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Today at a glance</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-white/5 py-2">
                <div className="text-lg font-bold text-amber-300">{todayTotals.calories}</div>
                <div className="text-[11px] text-slate-400">kcal eaten</div>
              </div>
              <div className="rounded-lg bg-white/5 py-2">
                <div className="text-lg font-bold text-emerald-300">{todayTotals.exercise}</div>
                <div className="text-[11px] text-slate-400">min exercise</div>
              </div>
            </div>
            <Link to="/tracker" className="mt-3 block text-center text-xs font-medium text-violet-300 hover:text-violet-200">
              Open Health Tracker →
            </Link>
          </div>

          {/* Mood */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Smile className="h-4 w-4 text-amber-300" /> Mood check-in
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    mood === m ? 'border-amber-300/60 bg-amber-400/15 text-amber-100' : 'border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={() => sendMessage(`I'm feeling ${mood.toLowerCase()} today. Any tips?`)}
              disabled={isTyping}
              className="mt-3 w-full rounded-lg bg-white/5 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              Ask the assistant about it
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
