// GitHub Pages cannot rewrite URLs, so a refresh on /chat would show a 404.
// Workaround: GitHub serves dist/404.html for unknown paths. Copying index.html to
// 404.html means the React app loads and React Router then shows the correct page.
// (Written in Node so it works on Windows, macOS and Linux.)
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('Created dist/404.html for GitHub Pages routing fallback.');
