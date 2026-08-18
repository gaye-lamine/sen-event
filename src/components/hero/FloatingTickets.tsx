import React from 'react';

export const FloatingTickets: React.FC = () => {
  return (
    <>
      {/* Left Purple Atmospheric Glow */}
      <div
        className="absolute pointer-events-none -z-0"
        style={{
          width: '260px',
          height: '260px',
          bottom: '0px',
          left: '120px',
          borderRadius: '130px',
          background: '#8B5CF6',
          opacity: 0.28,
          filter: 'blur(55px)',
        }}
        aria-hidden="true"
      />

      {/* Left card: gap from edge = 80px, cards lean -18deg, base hidden below */}
      <div
        className="absolute pointer-events-none select-none z-10 hidden sm:block animate-fluid-left"
        style={{
          width: '300px',
          height: '380px',
          bottom: '-140px',
          left: '60px',
          transformOrigin: 'bottom center',
        }}
      >
        <img
          src="/images/ticket_stack_left.jpg"
          alt="Tickets Dîner de Gala & Vogue Pass"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      {/* Right card: gap from edge = 80px, cards lean +18deg, base hidden below */}
      <div
        className="absolute pointer-events-none select-none z-10 hidden sm:block animate-fluid-right"
        style={{
          width: '300px',
          height: '380px',
          bottom: '-140px',
          right: '60px',
          transformOrigin: 'bottom center',
        }}
      >
        <img
          src="/images/ticket_stack_right.jpg"
          alt="Tickets Maggu VJ & Match Pass"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </>
  );
};
