import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\lamine\\.gemini\\antigravity-ide\\brain\\b929a50f-8aa0-4278-b021-dbae82a40801';

async function runLiveNetlifyAudit() {
  console.log('🚀 Démarrage du test sur https://senevent.netlify.app dans Google Chrome réel...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const consoleMessages = [];
  const networkLogs = [];

  page.on('console', (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
    });
    console.log(`🖥️ [BROWSER CONSOLE] [${msg.type().toUpperCase()}]: ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    consoleMessages.push({
      type: 'PAGE_ERROR',
      text: err.message,
    });
    console.error(`💥 [BROWSER PAGE ERROR]: ${err.message}`);
  });

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('sunu-event.backnd-api.cloud') || url.includes('/api/v1')) {
      networkLogs.push({
        type: 'REQUEST',
        method: req.method(),
        url: url,
        postData: req.postData() || null,
        headers: req.headers(),
      });
      console.log(`📡 [NETLIFY -> API] ${req.method()} ${url}`);
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('sunu-event.backnd-api.cloud') || url.includes('/api/v1')) {
      let body = '';
      try {
        body = await res.text();
      } catch (e) {
        body = '[Non lisible]';
      }
      networkLogs.push({
        type: 'RESPONSE',
        status: res.status(),
        statusText: res.statusText(),
        url: url,
        headers: res.headers(),
        body: body,
      });
      console.log(`📥 [API -> NETLIFY] ${res.status()} ${url}`);
    }
  });

  // 1. Ouvrir senevent.netlify.app
  console.log('\n--- 1. NAVIGATION VERS HTTPS://SENEVENT.NETLIFY.APP ---');
  await page.goto('https://senevent.netlify.app', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(artifactDir, 'netlify_01_gate.png') });

  // 2. Connexion avec nt@gmail.com / password123
  console.log('\n--- 2. CONNEXION SUR NETLIFY ---');
  await page.type('input[type="email"]', 'nt@gmail.com');
  await page.type('input[type="password"]', 'password123');

  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  }
  await new Promise((r) => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(artifactDir, 'netlify_02_home.png') });

  // 3. Navigation sur le catalogue
  console.log('\n--- 3. NAVIGATION CATALOGUE ---');
  await page.evaluate(() => {
    window.scrollTo({ top: 600, behavior: 'smooth' });
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'netlify_03_catalog.png') });

  fs.writeFileSync(
    path.join(artifactDir, 'netlify_live_audit.json'),
    JSON.stringify({ consoleMessages, networkLogs }, null, 2)
  );

  console.log('\n✅ Audit en ligne terminé avec succès !');
  await browser.close();
}

runLiveNetlifyAudit().catch((err) => {
  console.error('Erreur audit Netlify:', err);
  process.exit(1);
});
