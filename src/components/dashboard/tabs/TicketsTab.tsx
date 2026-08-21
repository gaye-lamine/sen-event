import React, { useState } from 'react';
import { Calendar, Download, Loader2, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { TicketFilterType, UserTicket } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';
import { ticketPdfGenerator } from '../../../services/tickets/ticketPdfGenerator';

export interface TicketsTabProps {
  tickets: UserTicket[];
  initialFilter?: TicketFilterType;
  onRefreshTickets?: () => void;
}

export const TicketsTab: React.FC<TicketsTabProps> = ({
  tickets,
  initialFilter = 'upcoming',
}) => {
  const [filter, setFilter] = useState<TicketFilterType>(initialFilter);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const upcomingTickets = tickets.filter((t) => t.status === 'upcoming');
  const pastTickets = tickets.filter((t) => t.status === 'past');
  const displayedTickets = filter === 'upcoming' ? upcomingTickets : pastTickets;

  const handleDownloadPdf = async (ticket: UserTicket) => {
    setDownloadingId(ticket.id);
    try {
      await ticketPdfGenerator.generateAndDownload(ticket);
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Erreur lors de la génération du PDF.';
      alert(message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Mes billets"
        subtitle="Retrouve ici tous tes billets électroniques, prêts à scanner."
      />

      {/* Filtre Sous-onglets */}
      <div className="flex items-center gap-6 border-b border-gray-200 text-xs sm:text-sm select-none">
        <button
          type="button"
          onClick={() => setFilter('upcoming')}
          className={`pb-2.5 transition-all cursor-pointer relative ${
            filter === 'upcoming'
              ? 'font-bold text-[#111827] border-b-2 border-[#FF5722]'
              : 'font-medium text-gray-400 hover:text-gray-700'
          }`}
        >
          À venir ({upcomingTickets.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('past')}
          className={`pb-2.5 transition-all cursor-pointer relative ${
            filter === 'past'
              ? 'font-bold text-[#111827] border-b-2 border-[#FF5722]'
              : 'font-medium text-gray-400 hover:text-gray-700'
          }`}
        >
          Passés ({pastTickets.length})
        </button>
      </div>

      {/* Liste des Cartes Billets */}
      {displayedTickets.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <TicketIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm sm:text-base text-gray-800">
            {filter === 'upcoming'
              ? 'Aucun billet à venir'
              : 'Aucun billet pour des évènements passés'}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {filter === 'upcoming'
              ? 'Explore le catalogue pour réserver tes prochains concerts, matchs et festivals.'
              : 'Tes anciens billets d’évènements archivés apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-xs border border-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/wally.png';
                  }}
                />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{ticket.location}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{ticket.date}</span>
                  </p>
                  {ticket.tiers && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                      {ticket.tiers}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="text-left sm:text-right">
                  <p className="text-xl sm:text-2xl font-black text-[#111827] leading-tight">
                    {ticket.quantity}
                  </p>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                    {ticket.quantity > 1 ? 'BILLETS' : 'BILLET'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(ticket)}
                  disabled={downloadingId === ticket.id}
                  className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 disabled:opacity-50"
                  title="Télécharger le billet PDF officiel"
                >
                  {downloadingId === ticket.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Génération...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
