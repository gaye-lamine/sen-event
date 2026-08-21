import React, { useState } from 'react';
import { Calendar, Download, MapPin } from 'lucide-react';
import { TicketFilterType, UserTicket } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface TicketsTabProps {
  tickets: UserTicket[];
  initialFilter?: TicketFilterType;
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

  const handleDownloadPdf = (ticket: UserTicket) => {
    setDownloadingId(ticket.id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Téléchargement du billet PDF pour "${ticket.title}" terminé !`);
    }, 800);
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
          Passés ({pastTickets.length + 7})
        </button>
      </div>

      {/* Liste des Cartes Billets */}
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
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
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
                className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloadingId === ticket.id ? 'Chargement...' : 'PDF'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
