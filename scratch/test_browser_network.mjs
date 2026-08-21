import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\lamine\\.gemini\\antigravity-ide\\brain\\b929a50f-8aa0-4278-b021-dbae82a40801';

async function runBrowserAudit() {
  console.log('🚀 Démarrage de Google Chrome en mode automatisé...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const networkLogs = [];

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/api/v1')) {
      networkLogs.push({
        type: 'REQUEST',
        method: req.method(),
        url: url,
        postData: req.postData() ? req.postData() : null,
        headers: req.headers(),
      });
      console.log(`📡 [REACT BROWSER -> API] ${req.method()} ${url}`);
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/v1')) {
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
        body: body,
      });
      console.log(`📥 [API -> REACT BROWSER] ${res.status()} ${url}`);
    }
  });

  // 1. Navigation
  console.log('\n--- 1. NAVIGATION VERS HTTP://LOCALHOST:3000 ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, '01_login_gate.png') });

  // 2. Connexion
  console.log('\n--- 2. CONNEXION AVEC NT@GMAIL.COM / PASSWORD123 ---');
  await page.type('input[type="email"]', 'nt@gmail.com');
  await page.type('input[type="password"]', 'password123');
  
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  }
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(artifactDir, '02_home_after_login.png') });

  // 3. Ouvrir le Dashboard
  console.log('\n--- 3. OUVERTURE DU DASHBOARD ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dashBtn = buttons.find(b => b.textContent && (b.textContent.includes('NT') || b.textContent.includes('Espace') || b.textContent.includes('Mon compte') || b.textContent.includes('Profil')));
    if (dashBtn) dashBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(artifactDir, '03_dashboard_tickets.png') });

  // 4. Cliquer sur l'onglet Mes Favoris
  console.log('\n--- 4. CLIC SUR L\'ONGLET FAVORIS ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const favBtn = buttons.find(b => b.textContent && (b.textContent.includes('favoris') || b.textContent.includes('Favoris')));
    if (favBtn) favBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, '04_dashboard_favorites.png') });

  // 5. Retour accueil et favori toggle
  console.log('\n--- 5. RETOUR ACCUEIL & TOGGLE FAVORIS ---');
  await page.evaluate(() => {
    const logo = document.querySelector('header button, nav button');
    if (logo) logo.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const heartBtn = allButtons.find(b => b.querySelector('svg.lucide-heart') || b.innerHTML.includes('lucide-heart'));
    if (heartBtn) heartBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, '05_favorite_toggled.png') });

  fs.writeFileSync(path.join(artifactDir, 'browser_network_logs.json'), JSON.stringify(networkLogs, null, 2));
  console.log('\n✅ Audit terminé avec succès ! Logs enregistrés dans browser_network_logs.json');

  await browser.close();
}

runBrowserAudit().catch(err => {
  console.error('Erreur audit:', err);
  process.exit(1);
});
