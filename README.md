# NovaSync AI – HealthTrack & Academic Assistant

> CSCI426 Advanced Web Programming · Project Phase 1
> Theme: **HealthTrack – Fitness and Wellness System**, extended with an AI chat assistant and a study task list.

**Live demo:** `https://YOUR-USERNAME.github.io/novasync-ai/` *(replace with your deployed link)*
**Repository:** `https://github.com/YOUR-USERNAME/novasync-ai` *(replace)*

## Project description

NovaSync AI is a front-end web application that helps students stay healthy while they study. Users can:

- **Log meals, exercise routines and daily activities**, plus water, sleep and mood, for any day, and see progress bars and a 7-day trend chart.
- **Chat with an AI assistant** (simulated) in General, Study or Health mode, with multiple saved conversations.
- **Manage study tasks** and a quick hydration/mood check-in beside the chat.

The problem it addresses: students juggle deadlines, meals, sleep and exercise across several apps. NovaSync AI puts them in one place. There is no backend: all data is stored privately in the browser (`localStorage`).

## Pages (React Router)

| Route       | Page            | Highlights |
|-------------|-----------------|------------|
| `/`         | Home            | Hero with rotating headline, animated stats, feature grid, call to action |
| `/about`    | About           | Mission, story, academic project context, team |
| `/services` | Services        | Interactive tabs for AI Assistant, Health Tracker, Study Planner |
| `/tracker`  | Health Tracker  | **Dynamic page.** Meal, exercise and activity logs, daily goals, date browsing, 7-day chart, insights |
| `/chat`     | AI Chat         | **Dynamic page.** Multi-conversation chat, typing loader, modes, task and health side panel |
| `/contact`  | Contact         | Validated form, success alert, contact details |

## Tech stack

- **React 18** with hooks (`useState`, `useEffect`, `useRef`)
- **React Router v6** for client-side routing
- **Tailwind CSS 3** for styling (dark theme, glassmorphism, responsive utilities)
- **Vite** for development and builds
- **lucide-react** for icons

## Screenshots

| Home | Health Tracker |
|------|----------------|
| ![Home](docs/screenshots/home.png) | ![Tracker](docs/screenshots/tracker.png) |

| AI Chat | Mobile view |
|---------|-------------|
| ![Chat](docs/screenshots/chat.png) | ![Mobile](docs/screenshots/mobile.png) |

*(See `docs/screenshots/README.md` for the full list of screenshots to add.)*

## Setup and run locally

Requires **Node.js 18+** and Git.

```bash
git clone https://github.com/YOUR-USERNAME/novasync-ai.git
cd novasync-ai
npm install        # react, react-router-dom, lucide-react, tailwindcss, vite, ...
npm run dev        # open http://localhost:5173
```

Other commands:

```bash
npm run build      # production build into /dist
npm run preview    # serve the production build locally
```

## Deployment

All three options below handle page refreshes on routes like `/chat` correctly.

### Option A: Vercel (easiest)
1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com) choose **Add New > Project** and import the repo.
3. Keep the defaults (Vite is detected) and click **Deploy**.

`vercel.json` rewrites every path to `index.html`, so refreshing `/chat` works.

### Option B: Netlify
1. On [netlify.com](https://netlify.com) choose **Add new site > Import from Git** and pick the repo.
2. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).

`netlify.toml` and `public/_redirects` provide the same fallback to `index.html`.

### Option C: GitHub Pages
1. Push the repo to GitHub on the `main` branch.
2. In the repo go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Push any commit. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it at
   `https://YOUR-USERNAME.github.io/REPO-NAME/`.

GitHub Pages cannot rewrite URLs, so the build copies `index.html` to `404.html` (`scripts/copy-404.js`).
The site's base path is taken from the repository name automatically.

## Git workflow

Make small, meaningful commits as you work so the history shows your progress, for example:

```bash
git init
git add .
git commit -m "chore: initial Vite + React + Tailwind setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/novasync-ai.git
git push -u origin main
```

Suggested commit messages: `feat: add navbar and footer`, `feat: home page`, `feat: health tracker page`,
`feat: ai chat page`, `feat: contact form validation`, `chore: add deployment config`, `docs: update README`.

## Project structure

```
novasync-ai/
├── index.html
├── package.json
├── vite.config.js           # base path for GitHub Pages
├── tailwind.config.js
├── postcss.config.js
├── vercel.json              # Vercel SPA rewrite
├── netlify.toml             # Netlify build + SPA redirect
├── public/_redirects        # Netlify redirect (backup)
├── scripts/copy-404.js      # GitHub Pages 404 fallback
├── .github/workflows/deploy.yml
├── docs/screenshots/        # UI screenshots for this README
└── src/
    ├── main.jsx             # entry point
    ├── App.jsx              # layout + route table
    ├── index.css            # Tailwind + glassmorphism utilities
    ├── components/
    │   ├── Navbar.jsx
    │   └── Footer.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── About.jsx
    │   ├── Services.jsx
    │   ├── Tracker.jsx
    │   ├── Chat.jsx
    │   └── Contact.jsx
    └── utils/
        └── health.js        # localStorage helpers shared by Tracker and Chat
```

## Notes and limitations

- The AI replies are **simulated** by keyword matching in `generateReply()` (`src/pages/Chat.jsx`). It can be replaced with a real LLM API call.
- Data is stored in the browser only (`localStorage`); there are no accounts or backend.
- Daily goals (2000 kcal, 30 min exercise, 8 glasses of water, 8 h sleep) are general reference values, not medical advice.
- The statistics on the Home page are placeholder demo numbers.

## Group contribution

*(Complete this section if required: list each member and what they built. Delete it if you work alone.)*

| Member | Contribution |
|--------|--------------|
| Your name | … |
