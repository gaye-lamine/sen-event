import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('🚀 Démarrage du test SSO Organisateur sur l\'app React...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const networkRequests = [];

  page.on('console', msg => console.log('🖥️ [CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('🚨 [PAGE ERROR]', err.message));

  page.on('request', req => {
    if (req.url().includes('/api/v1/auth')) {
      console.log(`📡 [REQ] ${req.method()} ${req.url()}`);
    }
  });

  page.on('response', async res => {
    if (res.url().includes('/api/v1/auth')) {
      let body = '';
      try {
        body = await res.json();
      } catch (e) {
        body = await res.text();
      }
      console.log(`📥 [RES] ${res.status()} ${res.url()} ->`, JSON.stringify(body));
    }
  });

  // 1. Ouvrir la page de connexion sur le serveur de dev local
  console.log('\n--- 1. NAVIGATION VERS /login ---');
  await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle2' });

  // 2. Remplir le formulaire avec le compte organisateur créé
  const orgaEmail = 'orga_test_1787411529890@sunuevents.sn';
  const orgaPassword = 'password123';

  console.log(`\n--- 2. SAISIE DES IDENTIFIANTS (${orgaEmail}) ---`);
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', orgaEmail);
  await page.type('input[type="password"]', orgaPassword);

  console.log('\n--- 3. CLIC SUR SE CONNECTER ---');
  // Écouter la redirection
  const [response] = await Promise.all([
    page.waitForNavigation({ timeout: 15000 }).catch(e => console.log('Navigation event:', e.message)),
    page.click('button[type="submit"]')
  ]);

  const currentUrl = page.url();
  console.log('\n--- 4. VÉRIFICATION DE LA REDIRECTION EFFECTIVE ---');
  console.log('URL Finale atteinte:', currentUrl);

  const localStorageData = await page.evaluate(() => {
    return {
      sen_event_auth_token: localStorage.getItem('sen_event_auth_token'),
      sen_event_user: localStorage.getItem('sen_event_user'),
      sunu_events_auth: localStorage.getItem('sunu_events_auth'),
    };
  });
  console.log('\n--- 5. VÉRIFICATION DU STOCKAGE SESSION B2C ---');
  console.log('LocalStorage B2C:', localStorageData);

  await browser.close();
  console.log('\n✅ Test terminé avec succès !');
})();
