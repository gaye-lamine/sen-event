import React, { useState, useEffect } from 'react';
import { X, Printer, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DigitalTicketCard, DigitalTicketData } from './DigitalTicketCard';
import { orderService } from '../../services/api/orderService';
import { authService } from '../../services/api/authService';
import { UserTicket } from '../../types/dashboard';

export interface DigitalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketSummary?: UserTicket | null;
  orderNumber?: string;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  isOpen,
  onClose,
  ticketSummary,
  orderNumber,
}) => {
  const [tickets, setTickets] = useState<DigitalTicketData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const activeOrderNum = orderNumber || ticketSummary?.order_number || ticketSummary?.id.replace(/^t-/, '');

  useEffect(() => {
    if (!isOpen) return;

    const loadFullTicketData = async () => {
      if (!activeOrderNum) return;
      setIsLoading(true);

      try {
        const response = await orderService.getOrderDetails(activeOrderNum);
        const orderData = response?.data;

        if (orderData && orderData.tickets && orderData.tickets.length > 0) {
          const mapped: DigitalTicketData[] = orderData.tickets.map((t) => ({
            orderNumber: orderData.orderNumber,
            ticketCode: t.ticketCode,
            qrCodeToken: t.qrCodeToken || `SUNUEVENTS-${orderData.orderNumber}-${t.ticketCode || '1'}`,
            title: orderData.event?.title || ticketSummary?.title || 'Événement Sunu Events',
            categoryName: t.ticketType?.name || 'Standard',
            categoryType: t.ticketType?.category || 'standard',
            venueName: orderData.event?.venueName || ticketSummary?.location || 'Dakar Arena',
            city: orderData.event?.city || 'Dakar',
            date: orderData.event?.startDate || ticketSummary?.date || '',
            time: orderData.event?.startTime?.substring(0, 5) || '',
            holderName: `${t.holderFirstName || orderData.customer?.firstName || ''} ${t.holderLastName || orderData.customer?.lastName || ''}`.trim() || 'Titulaire',
            price: t.ticketType?.price || orderData.amount,
            currency: orderData.currency || 'XOF',
            posterUrl: orderData.event?.posterUrl || ticketSummary?.image || '/images/wally.png',
            status: t.status || 'valid',
          }));

          setTickets(mapped);
          setCurrentIndex(0);
        } else if (ticketSummary) {
          const currentUser = authService.getCurrentUser();
          const realUserName = currentUser
            ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
            : '';
          const fallbackHolder = ticketSummary.holder_name || ticketSummary.customer_name || realUserName || 'Participant';

          setTickets([
            {
              orderNumber: activeOrderNum,
              qrCodeToken: ticketSummary.qr_code_token || `SUNUEVENTS-${activeOrderNum}-1`,
              title: ticketSummary.title,
              categoryName: ticketSummary.tiers || 'Standard',
              venueName: ticketSummary.location,
              date: ticketSummary.date,
              holderName: fallbackHolder,
              posterUrl: ticketSummary.image,
              price: ticketSummary.total_amount,
              currency: ticketSummary.currency,
            },
          ]);
        }
      } catch (err) {
        console.error('Erreur chargement détail billet:', err);
        if (ticketSummary) {
          const currentUser = authService.getCurrentUser();
          const realUserName = currentUser
            ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
            : '';
          const fallbackHolder = ticketSummary.holder_name || ticketSummary.customer_name || realUserName || 'Participant';

          setTickets([
            {
              orderNumber: activeOrderNum,
              qrCodeToken: ticketSummary.qr_code_token || `SUNUEVENTS-${activeOrderNum}-1`,
              title: ticketSummary.title,
              categoryName: ticketSummary.tiers || 'Standard',
              venueName: ticketSummary.location,
              date: ticketSummary.date,
              holderName: fallbackHolder,
              posterUrl: ticketSummary.image,
              price: ticketSummary.total_amount,
              currency: ticketSummary.currency,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFullTicketData();
  }, [isOpen, activeOrderNum, ticketSummary]);

  if (!isOpen) return null;

  const currentTicket = tickets[currentIndex];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Conteneur de la modale */}
      <div className="relative w-full max-w-lg bg-transparent flex flex-col items-center max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Barre d'action supérieure */}
        <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between gap-4 mb-4 text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du Billet */}
        {isLoading ? (
          <div className="w-full max-w-sm sm:max-w-md h-96 bg-[#12142B] rounded-[28px] border border-gray-800 flex flex-col items-center justify-center text-white gap-3 shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5722]" />
            <p className="text-xs text-gray-400">Chargement de votre billet sécurisé...</p>
          </div>
        ) : currentTicket ? (
          <div className="w-full">
            <DigitalTicketCard ticket={currentTicket} />

            {/* Pagination si plusieurs billets dans la commande */}
            {tickets.length > 1 && (
              <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md mx-auto mt-4 px-2 text-white">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <span className="text-xs font-bold text-gray-300">
                  Billet {currentIndex + 1} sur {tickets.length}
                </span>

                <button
                  type="button"
                  disabled={currentIndex === tickets.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(tickets.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md p-8 bg-[#12142B] rounded-[28px] text-center text-white border border-gray-800">
            <p className="text-sm font-bold">Impossible de charger le billet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
