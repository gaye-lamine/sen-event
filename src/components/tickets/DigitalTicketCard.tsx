import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export type TicketCategoryType = 'standard' | 'vip' | 'place-reservee' | string;

export interface DigitalTicketData {
  orderNumber: string;
  ticketCode?: string;
  qrCodeToken: string;
  title: string;
  categoryName?: string;
  categoryType?: TicketCategoryType;
  venueName: string;
  city?: string;
  date: string;
  time?: string;
  holderName: string;
  price?: string | number;
  currency?: string;
  posterUrl?: string;
  status?: string;
}

export interface DigitalTicketCardProps {
  ticket: DigitalTicketData;
  className?: string;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({
  ticket,
  className = '',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // 1. Détection de la catégorie exacte
  const rawCategory = (
    ticket.categoryType ||
    ticket.categoryName ||
    ''
  ).toLowerCase().trim();

  let categoryKey: 'standard' | 'vip' | 'place-reservee' = 'standard';
  if (rawCategory.includes('vip')) {
    categoryKey = 'vip';
  } else if (
    rawCategory.includes('reserve') ||
    rawCategory.includes('réservé') ||
    rawCategory.includes('balcon') ||
    rawCategory.includes('loge')
  ) {
    categoryKey = 'place-reservee';
  }

  // 2. Configuration des thèmes de couleurs exacts
  const THEMES = {
    standard: {
      bgColor: '#0F111E',
      watermarkText: 'STANDART',
      watermarkColor: 'rgba(255, 255, 255, 0.05)',
      titleColor: '#FFFFFF',
      dateColor: '#A0A5B8',
      holderColor: '#FFFFFF',
      subtitleColor: '#6B7280',
      orderNumberColor: '#6B7280',
      dividerColor: '#334155',
      priceColor: '#FFFFFF',
      dashedColor: '#FFFFFF',
      qrDark: '#FFFFFF',
      qrLight: '#0F111E',
    },
    vip: {
      bgColor: '#F2C12D',
      watermarkText: 'V.I.P',
      watermarkColor: '#D4A21A',
      titleColor: '#111827',
      dateColor: '#374151',
      holderColor: '#111827',
      subtitleColor: '#6B7280',
      orderNumberColor: '#854D0E',
      dividerColor: '#CA8A04',
      priceColor: '#111827',
      dashedColor: '#FFFFFF',
      qrDark: '#111827',
      qrLight: '#F2C12D',
    },
    'place-reservee': {
      bgColor: '#AE1AFF',
      watermarkText: 'PLACE RESERVE',
      watermarkColor: '#8B05D6',
      titleColor: '#FFFFFF',
      dateColor: '#E9D5FF',
      holderColor: '#FFFFFF',
      subtitleColor: '#C084FC',
      orderNumberColor: '#E9D5FF',
      dividerColor: '#9333EA',
      priceColor: '#FFFFFF',
      dashedColor: '#FFFFFF',
      qrDark: '#FFFFFF',
      qrLight: '#AE1AFF',
    },
  };

  const currentTheme = THEMES[categoryKey];

  // 3. Génération du QR Code adapté au fond
  useEffect(() => {
    const generateQr = async () => {
      try {
        const qrContent =
          ticket.qrCodeToken ||
          `SUNUEVENTS-${ticket.orderNumber}-${ticket.ticketCode || '1'}`;

        const dataUrl = await QRCode.toDataURL(qrContent, {
          width: 220,
          margin: 0,
          color: {
            dark: currentTheme.qrDark,
            light: currentTheme.qrLight,
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Erreur génération QR Code:', err);
      }
    };

    generateQr();
  }, [ticket.qrCodeToken, ticket.orderNumber, ticket.ticketCode, currentTheme]);

  // Formattage du prix
  const formattedPrice =
    typeof ticket.price === 'number'
      ? `${ticket.price.toLocaleString('fr-FR')} ${ticket.currency || 'F'}`
      : ticket.price || '10 000 F';

  // Géométrie exacte du billet
  const W = 280;
  const H = 640;
  const rc = 22; // Rayon des 4 coins concaves
  const rm = 20; // Rayon des 2 encoches de découpe centrales
  const ym = 390; // Hauteur de la ligne de perforation

  // Chemin SVG parfait avec 4 coins échancrés + 2 encoches centrales
  const ticketPath = `
    M ${rc},0 
    H ${W - rc} 
    A ${rc},${rc} 0 0,0 ${W},${rc} 
    V ${ym - rm} 
    A ${rm},${rm} 0 0,0 ${W},${ym + rm} 
    V ${H - rc} 
    A ${rc},${rc} 0 0,0 ${W - rc},${H} 
    H ${rc} 
    A ${rc},${rc} 0 0,0 0,${H - rc} 
    V ${ym + rm} 
    A ${rm},${rm} 0 0,0 0,${ym - rm} 
    V ${rc} 
    A ${rc},${rc} 0 0,0 ${rc},0 
    Z
  `.replace(/\s+/g, ' ');

  return (
    <div
      className={`digital-ticket-root inline-block relative select-none filter drop-shadow-2xl transition-transform ${className}`}
      style={{ width: `${W}px`, height: `${H}px` }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        {/* FOND AVEC LES DÉCOUPES EXACTES */}
        <path d={ticketPath} fill={currentTheme.bgColor} />

        {/* FILIGRANE DU HAUT */}
        <text
          x={W / 2}
          y="72"
          textAnchor="middle"
          fill={currentTheme.watermarkColor}
          fontSize={categoryKey === 'place-reservee' ? '28' : '38'}
          fontWeight="900"
          letterSpacing={categoryKey === 'vip' ? '8' : '2'}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          className="select-none pointer-events-none uppercase"
        >
          {currentTheme.watermarkText}
        </text>

        {/* TITRE DE L'ÉVÉNEMENT */}
        <text
          x="26"
          y="170"
          fill={currentTheme.titleColor}
          fontSize="15"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {ticket.title}
        </text>

        {/* DATE & LIEU */}
        <text
          x="26"
          y="194"
          fill={currentTheme.dateColor}
          fontSize="11"
          fontWeight="400"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {ticket.date}
          {ticket.venueName ? ` · ${ticket.venueName}` : ''}
        </text>

        {/* NOM DU PARTICIPANT */}
        <text
          x="26"
          y="238"
          fill={currentTheme.holderColor}
          fontSize="14"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {ticket.holderName}
        </text>

        {/* SOUS-TITRE BILLET NOMINATIF */}
        <text
          x="26"
          y="258"
          fill={currentTheme.subtitleColor}
          fontSize="11"
          fontWeight="400"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          Billet nominatif
        </text>

        {/* NUMÉRO DE COMMANDE & SÉPARATEUR */}
        <text
          x="26"
          y="336"
          fill={currentTheme.orderNumberColor}
          fontSize="13"
          fontWeight="500"
          fontFamily="monospace, system-ui, sans-serif"
        >
          #{ticket.orderNumber}
        </text>

        <line
          x1="138"
          y1="324"
          x2="138"
          y2="340"
          stroke={currentTheme.dividerColor}
          strokeWidth="1.5"
        />

        {/* PRIX */}
        <text
          x="170"
          y="336"
          fill={currentTheme.priceColor}
          fontSize="16"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {formattedPrice}
        </text>

        {/* LIGNE DE PERFORATION EN POINTILLÉS BLANCS */}
        <line
          x1="26"
          y1={ym}
          x2={W - 26}
          y2={ym}
          stroke={currentTheme.dashedColor}
          strokeWidth="2.5"
          strokeDasharray="9 7"
        />

        {/* QR CODE CENTRÉ DANS LA PARTIE INFÉRIEURE */}
        {qrDataUrl && (
          <image
            href={qrDataUrl}
            x={(W - 176) / 2}
            y={ym + 36}
            width="176"
            height="176"
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
    </div>
  );
};
