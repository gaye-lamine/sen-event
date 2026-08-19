import React, { useState } from 'react';
import { EventItem, SelectedTierItem, EventTabType } from '../types';
import { EventBreadcrumb } from '../components/event-detail/EventBreadcrumb';
import { EventHeroBanner } from '../components/event-detail/EventHeroBanner';
import { EventTabs } from '../components/event-detail/EventTabs';
import { EventAboutSection } from '../components/event-detail/EventAboutSection';
import { EventLocationMap } from '../components/event-detail/EventLocationMap';
import { SimilarEventsSection } from '../components/event-detail/SimilarEventsSection';
import { TicketSelectionCard } from '../components/event-detail/TicketSelectionCard';
import { EventFaqSection } from '../components/event-detail/EventFaqSection';

interface EventDetailPageProps {
  event: EventItem;
  similarEvents: EventItem[];
  onNavigateHome: () => void;
  onSelectEvent: (event: EventItem) => void;
  onProceedToCheckout?: (selectedTiers: SelectedTierItem[]) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  similarEvents,
  onNavigateHome,
  onSelectEvent,
  onProceedToCheckout,
}) => {
  const [activeTab, setActiveTab] = useState<EventTabType>('overview');

  const scrollToTickets = () => {
    const el = document.getElementById('ticket-selection-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumb navigation */}
        <EventBreadcrumb
          event={event}
          onNavigateHome={onNavigateHome}
        />

        {/* 2. Main Hero Banner Container */}
        <EventHeroBanner
          event={event}
          onScrollToTickets={scrollToTickets}
        />

        {/* 3. Section Tabs */}
        <EventTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 4. Two-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Main Content Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {activeTab === 'overview' && (
              <>
                <EventAboutSection event={event} />
                <EventLocationMap event={event} />
                <SimilarEventsSection
                  events={similarEvents}
                  onSelectEvent={onSelectEvent}
                />
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

          {/* Right Sticky Sidebar Column */}
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
