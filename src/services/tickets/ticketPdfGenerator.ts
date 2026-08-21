/**
 * @file ticketPdfGenerator.ts
 * @description Générateur de billets PDF officiel 100% exécuté côté Frontend.
 * Récupère les données réelles de l'API / session utilisateur et génère les 3 designs :
 * - Standard (Noir / Nuit #0F111E avec filigrane STANDART)
 * - V.I.P (Or #F2C12D avec filigrane V.I.P)
 * - Place Réservée (Violet #AE1AFF avec filigrane PLACE RESERVE)
 */

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { UserTicket } from '../../types/dashboard';
import { authService } from '../api/authService';
import { orderService } from '../api/orderService';

export interface TicketPdfOptions {
  orderNumber?: string;
  ticketCode?: string;
  qrCodeToken?: string;
  title?: string;
  location?: string;
  date?: string;
  holderName?: string;
  tiers?: string;
  price?: string | number;
  currency?: string;
}

export class TicketPdfGenerator {
  public async generateAndDownload(data: TicketPdfOptions | UserTicket): Promise<void> {
    const rawOrderNum =
      (data as TicketPdfOptions).orderNumber ||
      (data as UserTicket).order_number ||
      (data as UserTicket).id?.replace(/^t-/, '') ||
      '';

    let orderDetails: any = null;
    if (rawOrderNum) {
      try {
        const orderRes = await orderService.getOrderDetails(rawOrderNum);
        orderDetails = orderRes?.data;
      } catch (err) {
        // Fallback sur les données directes
      }
    }

    const currentUser = authService.getCurrentUser();
    const defaultUserFullName = currentUser
      ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
      : '';

    // Liste des tickets à générer
    const ticketsToRender: Array<{
      orderNum: string;
      ticketCode: string;
      title: string;
      location: string;
      date: string;
      holderName: string;
      tiers: string;
      qrToken: string;
      price: string | number;
    }> = [];

    if (orderDetails && orderDetails.tickets && orderDetails.tickets.length > 0) {
      for (const t of orderDetails.tickets) {
        const hName =
          `${t.holderFirstName || ''} ${t.holderLastName || ''}`.trim() ||
          `${orderDetails.customer?.firstName || ''} ${orderDetails.customer?.lastName || ''}`.trim() ||
          defaultUserFullName ||
          'Participant';

        ticketsToRender.push({
          orderNum: orderDetails.orderNumber || rawOrderNum,
          ticketCode: t.ticketCode || `TKT-${rawOrderNum}`,
          title: orderDetails.event?.title || data.title || 'Événement',
          location:
            `${orderDetails.event?.venueName || ''}${orderDetails.event?.city ? ` · ${orderDetails.event.city}` : ''}`.trim() ||
            data.location ||
            'Lieu de l\'évènement',
          date:
            orderDetails.event?.startDate ||
            data.date ||
            '',
          holderName: hName,
          tiers: t.ticketType?.name || (data as any).tiers || 'Standard',
          qrToken:
            t.qrCodeToken ||
            (data as UserTicket).qr_code_token ||
            `SUNUEVENTS-${rawOrderNum}-${t.ticketCode || '1'}`,
          price: t.ticketType?.price ?? orderDetails.amount ?? (data as any).total_amount ?? '',
        });
      }
    } else {
      const hName =
        (data as TicketPdfOptions).holderName ||
        (data as UserTicket).holder_name ||
        defaultUserFullName ||
        'Participant';

      ticketsToRender.push({
        orderNum: rawOrderNum,
        ticketCode: (data as TicketPdfOptions).ticketCode || `TKT-${rawOrderNum}`,
        title: data.title || 'Événement',
        location: data.location || 'Lieu de l\'évènement',
        date: data.date || '',
        holderName: hName,
        tiers: (data as any).tiers || 'Standard',
        qrToken:
          (data as UserTicket).qr_code_token ||
          (data as TicketPdfOptions).qrCodeToken ||
          `SUNUEVENTS-${rawOrderNum}-1`,
        price: (data as any).price ?? (data as any).total_amount ?? '',
      });
    }

    // Initialisation du document PDF
    const W = 80;
    const H = 182;
    const rc = 6.5; // Rayon des 4 coins
    const rm = 6.0; // Rayon des encoches centrales
    const ym = 112; // Hauteur de la découpe

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [W, H],
    });

    for (let i = 0; i < ticketsToRender.length; i++) {
      if (i > 0) {
        doc.addPage([W, H], 'portrait');
      }

      const item = ticketsToRender[i];

      // Formattage du prix
      let formattedPrice = '';
      if (typeof item.price === 'number') {
        formattedPrice = `${item.price.toLocaleString('fr-FR')} F`;
      } else if (item.price) {
        formattedPrice = String(item.price).includes('F')
          ? String(item.price)
          : `${item.price} F`;
      }

      // 1. Détection exacte de la catégorie
      const tierLower = (item.tiers || '').toLowerCase().trim();
      let categoryKey: 'standard' | 'vip' | 'place-reservee' = 'standard';

      if (tierLower.includes('vip')) {
        categoryKey = 'vip';
      } else if (
        tierLower.includes('reserve') ||
        tierLower.includes('réservé') ||
        tierLower.includes('balcon') ||
        tierLower.includes('loge')
      ) {
        categoryKey = 'place-reservee';
      }

      // 2. Thème de couleurs selon la maquette
      const THEMES = {
        standard: {
          bgR: 15,
          bgG: 17,
          bgB: 30, // #0F111E
          watermarkText: 'STANDART',
          watermarkR: 30,
          watermarkG: 34,
          watermarkB: 56,
          titleR: 255,
          titleG: 255,
          titleB: 255,
          dateR: 160,
          dateG: 165,
          dateB: 184,
          holderR: 255,
          holderG: 255,
          holderB: 255,
          subR: 107,
          subG: 114,
          subB: 128,
          orderR: 107,
          orderG: 114,
          orderB: 128,
          dividerR: 51,
          dividerG: 65,
          dividerB: 85,
          priceR: 255,
          priceG: 255,
          priceB: 255,
          qrDark: '#FFFFFF',
          qrLight: '#0F111E',
        },
        vip: {
          bgR: 242,
          bgG: 193,
          bgB: 45, // #F2C12D
          watermarkText: 'V . I . P',
          watermarkR: 212,
          watermarkG: 162,
          watermarkB: 26,
          titleR: 17,
          titleG: 24,
          titleB: 39,
          dateR: 55,
          dateG: 65,
          dateB: 81,
          holderR: 17,
          holderG: 24,
          holderB: 39,
          subR: 107,
          subG: 114,
          subB: 128,
          orderR: 133,
          orderG: 77,
          orderB: 14,
          dividerR: 202,
          dividerG: 138,
          dividerB: 4,
          priceR: 17,
          priceG: 24,
          priceB: 39,
          qrDark: '#111827',
          qrLight: '#F2C12D',
        },
        'place-reservee': {
          bgR: 174,
          bgG: 26,
          bgB: 255, // #AE1AFF
          watermarkText: 'PLACE RESERVE',
          watermarkR: 139,
          watermarkG: 5,
          watermarkB: 214,
          titleR: 255,
          titleG: 255,
          titleB: 255,
          dateR: 233,
          dateG: 213,
          dateB: 255,
          holderR: 255,
          holderG: 255,
          holderB: 255,
          subR: 192,
          subG: 132,
          subB: 252,
          orderR: 233,
          orderG: 213,
          orderB: 255,
          dividerR: 147,
          dividerG: 51,
          dividerB: 234,
          priceR: 255,
          priceG: 255,
          priceB: 255,
          qrDark: '#FFFFFF',
          qrLight: '#AE1AFF',
        },
      };

      const t = THEMES[categoryKey];

      // Fond plein
      doc.setFillColor(t.bgR, t.bgG, t.bgB);
      doc.rect(0, 0, W, H, 'F');

      // Découpe des 4 coins + 2 encoches centrales (Peintes en blanc pour simuler la découpe)
      doc.setFillColor(255, 255, 255);
      doc.circle(0, 0, rc, 'F');
      doc.circle(W, 0, rc, 'F');
      doc.circle(0, H, rc, 'F');
      doc.circle(W, H, rc, 'F');
      doc.circle(0, ym, rm, 'F');
      doc.circle(W, ym, rm, 'F');

      // Filigrane Supérieur
      doc.setTextColor(t.watermarkR, t.watermarkG, t.watermarkB);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(categoryKey === 'place-reservee' ? 16 : 22);
      doc.text(t.watermarkText, W / 2, 22, { align: 'center' });

      // Titre de l'événement
      doc.setTextColor(t.titleR, t.titleG, t.titleB);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(item.title, 8, 48);

      // Date & Lieu
      doc.setTextColor(t.dateR, t.dateG, t.dateB);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const dateVenueText = item.location ? `${item.date} · ${item.location}` : item.date;
      doc.text(dateVenueText, 8, 55);

      // Nom du participant
      doc.setTextColor(t.holderR, t.holderG, t.holderB);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(item.holderName, 8, 68);

      // Mention Billet nominatif
      doc.setTextColor(t.subR, t.subG, t.subB);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Billet nominatif', 8, 74);

      // Numéro de Commande & Séparateur & Prix
      doc.setTextColor(t.orderR, t.orderG, t.orderB);
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      doc.text(`#${item.orderNum}`, 8, 96);

      // Séparateur vertical
      doc.setDrawColor(t.dividerR, t.dividerG, t.dividerB);
      doc.setLineWidth(0.4);
      doc.line(38, 93, 38, 97);

      // Prix
      if (formattedPrice) {
        doc.setTextColor(t.priceR, t.priceG, t.priceB);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.text(formattedPrice, 48, 96);
      }

      // Ligne de Perforation en pointillés blancs
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.7);
      doc.setLineDashPattern([2.5, 2], 0);
      doc.line(rm + 1, ym, W - rm - 1, ym);
      doc.setLineDashPattern([], 0); // Reset

      // Génération du QR Code adapté
      const qrDataUrl = await QRCode.toDataURL(item.qrToken, {
        width: 300,
        margin: 0,
        color: {
          dark: t.qrDark,
          light: t.qrLight,
        },
        errorCorrectionLevel: 'M',
      });

      const qrSize = 50;
      const qrX = (W - qrSize) / 2;
      const qrY = ym + 10;

      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    }

    // Téléchargement immédiat du fichier PDF
    const firstOrderNum = ticketsToRender[0]?.orderNum || 'billet';
    doc.save(`billet-${firstOrderNum}.pdf`);
  }
}

export const ticketPdfGenerator = new TicketPdfGenerator();
