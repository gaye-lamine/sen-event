import React, { useState, useEffect } from 'react';
import { EventTabType, EventDetailPageProps, EventItem } from '../types';
import { EventBreadcrumb } from '../components/event-detail/EventBreadcrumb';
import { EventHeroBanner } from '../components/event-detail/EventHeroBanner';
import { EventTabs } from '../components/event-detail/EventTabs';
import { EventAboutSection } from '../components/event-detail/EventAboutSection';
import { EventLocationMap } from '../components/event-detail/EventLocationMap';
import { SimilarEventsSection } from '../components/event-detail/SimilarEventsSection';
import { TicketSelectionCard } from '../components/event-detail/TicketSelectionCard';
import { EventFaqSection } from '../components/event-detail/EventFaqSection';
import { eventService } from '../services/api/eventService';

/**
 * @page EventDetailPage
 * @description Page de détail complète d'un événement orchestrant le fil d'Ariane,
 * la bannière immersive, les onglets de contenu et la réservation latérale.
 */
export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event: initialEvent,
  similarEvents,
  onNavigateHome,
  onSelectEvent,
  onProceedToCheckout,
}) => {
  const [event, setEvent] = useState<EventItem>(initialEvent);
  const [activeTab, setActiveTab] = useState<EventTabType>('overview');

  useEffect(() => {
    setEvent(initialEvent);
    const loadFreshEvent = async () => {
      try {
        const targetId = initialEvent.slug || initialEvent.id;
        const fresh = await eventService.getEventById(targetId);
        if (fresh) {
          setEvent(fresh);
        }
      } catch (err) {
        console.error('Erreur chargement détail événement:', err);
      }
    };
    loadFreshEvent();
  }, [initialEvent.id, initialEvent.slug]);

  const scrollToTickets = () => {
    const el = document.getElementById('ticket-selection-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtrage strict : même catégorie obligatoire et exclusion de l'événement courant
  const trueSimilarEvents = (similarEvents || []).filter(
    (e) =>
      String(e.id) !== String(event.id) &&
      e.slug !== event.slug &&
      e.category === event.category
  );

  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventBreadcrumb
          event={event}
          onNavigateHome={onNavigateHome}
        />

        <EventHeroBanner
          event={event}
          onScrollToTickets={scrollToTickets}
        />

        <EventTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {activeTab === 'overview' && (
              <>
                <EventAboutSection event={event} />
                <EventLocationMap event={event} />
                {trueSimilarEvents.length > 0 && (
                  <SimilarEventsSection
                    events={trueSimilarEvents}
                    onSelectEvent={onSelectEvent}
                  />
                )}
              </>
            )}

            {activeTab === 'location' && (
              <>
                <EventLocationMap event={event} />
                <EventAboutSection event={event} />
              </>
            )}

            {activeTab === 'faq' && (
              <>
                <EventFaqSection faq={event.faq} />
                <EventAboutSection event={event} />
              </>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <TicketSelectionCard
              event={event}
              onProceedToCheckout={onProceedToCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
