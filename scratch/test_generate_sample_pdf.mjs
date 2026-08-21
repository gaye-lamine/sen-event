import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\lamine\\.gemini\\antigravity-ide\\brain\\b929a50f-8aa0-4278-b021-dbae82a40801';

async function generateTestPdf(category, bgColor, isDarkText) {
  const W = 80;
  const H = 182;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [W, H],
  });

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const bg = hexToRgb(bgColor);
  doc.setFillColor(bg.r, bg.g, bg.b);
  doc.rect(0, 0, W, H, 'F');

  // En-tête
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(isDarkText ? 20 : 255, isDarkText ? 20 : 255, isDarkText ? 20 : 255);
  doc.text('Sunu Events', W / 2, 10, { align: 'center' });

  // Titre & Événement
  doc.setFontSize(12);
  doc.text('Wally B. Seck en concert', W / 2, 22, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Dakar Arena • Diamniadio', W / 2, 28, { align: 'center' });
  doc.text('Dimanche 20 Décembre 2026 à 20:00', W / 2, 33, { align: 'center' });

  // QR Code
  const qrDataUrl = await QRCode.toDataURL('SUNUEVENTS-DEMO-SN-664079-VERIFIED', {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: isDarkText ? '#111827' : '#FFFFFF',
      light: '#00000000',
    },
  });

  const qrSize = 36;
  doc.addImage(qrDataUrl, 'PNG', (W - qrSize) / 2, 90, qrSize, qrSize);

  // Titulaire & Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TITULAIRE : NT TECHNOLOGIES', W / 2, 140, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CODE : TKT-A3VOJBW1LY', W / 2, 146, { align: 'center' });
  doc.text('COMMANDE : #SN-664079', W / 2, 151, { align: 'center' });

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  const filePath = path.join(artifactDir, `test_ticket_${category}.pdf`);
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`✅ Billet PDF généré : ${filePath} (${pdfBuffer.length} octets)`);
}

async function run() {
  await generateTestPdf('standard', '#0F111E', false);
  await generateTestPdf('vip', '#F2C12D', true);
  await generateTestPdf('place_reservee', '#AE1AFF', false);
}

run();
