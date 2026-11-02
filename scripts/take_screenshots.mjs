import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\5edbe5cb-9212-4715-a454-6f6f8042c4a7\\screenshots';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

export function capture(url, filename, width = 1440, height = 960) {
  const dest = path.join(outDir, filename);
  const cmd = `"${edgePath}" --headless=new --disable-gpu --window-size=${width},${height} --screenshot="${dest}" "${url}"`;
  console.log(`Capturing ${url} (${width}x${height}) -> ${filename}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Saved: ${dest}`);
  } catch (err) {
    console.error(`Failed to capture ${filename}:`, err.message);
  }
  return dest;
}

const pages = [
  { url: 'http://localhost:3000', prefix: 'homepage' },
  { url: 'http://localhost:3000/routes', prefix: 'routes' },
  { url: 'http://localhost:3000/fares', prefix: 'fares' },
  { url: 'http://localhost:3000/tickets', prefix: 'tickets' },
  { url: 'http://localhost:3000/tracking', prefix: 'tracking' },
];

for (const p of pages) {
  capture(p.url, `${p.prefix}_desktop.png`, 1440, 960);
  capture(p.url, `${p.prefix}_mobile.png`, 390, 844);
}

console.log('All visual acceptance screenshots captured successfully!');
