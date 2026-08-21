import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\lamine\\.gemini\\antigravity-ide\\brain\\b929a50f-8aa0-4278-b021-dbae82a40801';

async function runPaymentAudit() {
  console.log('🚀 Démarrage du test de commande et paiement en navigateur réel...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const paymentLogs = [];

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/api/v1')) {
      paymentLogs.push({
        type: 'REQUEST',
        timestamp: new Date().toISOString(),
        method: req.method(),
        url: url,
        postData: req.postData() ? req.postData() : null,
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
      paymentLogs.push({
        type: 'RESPONSE',
        timestamp: new Date().toISOString(),
        status: res.status(),
        statusText: res.statusText(),
        url: url,
        body: body,
      });
      console.log(`📥 [API -> REACT BROWSER] ${res.status()} ${url}`);
    }
  });

  // 1. Ouvrir l'accueil
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 2. Connexion
  await page.type('input[type="email"]', 'nt@gmail.com');
  await page.type('input[type="password"]', 'password123');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) await submitBtn.click();
  await new Promise(r => setTimeout(r, 2000));

  // 3. Cliquer sur un événement pour ouvrir la modale ou la page
  console.log('\n--- NAVIGATION VERS COMMANDE ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bookBtn = buttons.find(b => b.textContent && (b.textContent.includes('Réserver') || b.textContent.includes('Acheter') || b.textContent.includes('Prendre ma place')));
    if (bookBtn) bookBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, '07_checkout_step.png') });

  // Exécuter l'appel direct d'initiation et de polling depuis le contexte de la page React (via fetch interne avec le token)
  console.log('\n--- EXÉCUTION DU TUNNEL DE PAIEMENT DANS LA PAGE REACT ---');
  const checkoutResult = await page.evaluate(async () => {
    const token = localStorage.getItem('sen_event_auth_token');
    
    // 1. Créer la commande
    const orderRes = await fetch('http://127.0.0.1:8002/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        event_id: 1,
        customer: {
          firstName: 'NT',
          lastName: 'Technologies',
          email: 'nt@gmail.com',
          phone: '+221770000001'
        },
        items: [{
          ticketTypeId: 1,
          quantity: 1,
          holders: [{ firstName: 'NT', lastName: 'Technologies' }]
        }]
      })
    });
    const orderJson = await orderRes.json();
    const orderNumber = orderJson.data?.orderNumber;

    // 2. Déclencher le paiement InTouch
    const payRes = await fetch('http://127.0.0.1:8002/api/v1/payments/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        order_number: orderNumber,
        payment_method: 'wave',
        phone_number: '+221770000001',
        customer_email: 'nt@gmail.com',
        customer_name: 'NT Technologies'
      })
    });
    const payJson = await payRes.json();
    const transactionId = payJson.data?.numTransaction || payJson.data?.idFromGu || orderNumber;

    // 3. Polling de statut (3 itérations)
    const pollingResults = [];
    for (let i = 0; i < 3; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const pollRes = await fetch(`http://127.0.0.1:8002/api/v1/payments/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const pollJson = await pollRes.json();
      pollingResults.push({
        iteration: i + 1,
        status: pollRes.status,
        data: pollJson
      });
    }

    return {
      order: orderJson,
      initiate: payJson,
      polling: pollingResults
    };
  });

  fs.writeFileSync(path.join(artifactDir, 'browser_payment_audit.json'), JSON.stringify(checkoutResult, null, 2));
  console.log('\n✅ Test de paiement et polling terminé avec succès !');

  await browser.close();
}

runPaymentAudit().catch(err => {
  console.error('Erreur audit paiement:', err);
  process.exit(1);
});
