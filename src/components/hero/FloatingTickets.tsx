import React from 'react';

/**
 * @component FloatingTickets
 * @description Rendu des billets VIP 3D décoratifs dans les coins inférieurs gauche et droit
 * de la section Hero (espacement 60px des bords, inclinaison subtile ±18° et base masquée).
 */
export const FloatingTickets: React.FC = () => {
  return (
    <>
      <div
        className="hidden md:block absolute -bottom-16 left-[60px] z-10 pointer-events-none select-none transition-transform duration-700 ease-out hover:scale-105"
        style={{
          transform: 'rotate(-18deg)',
        }}
        aria-hidden="true"
      >
        <img
          src="/images/ticket_stack_left.jpg"
          alt="Billet VIP gauche"
          className="w-48 lg:w-56 xl:w-64 h-auto drop-shadow-2xl rounded-2xl opacity-95"
        />
      </div>

      <div
        className="hidden md:block absolute -bottom-16 right-[60px] z-10 pointer-events-none select-none transition-transform duration-700 ease-out hover:scale-105"
        style={{
          transform: 'rotate(18deg)',
        }}
        aria-hidden="true"
      >
        <img
          src="/images/ticket_stack_right.jpg"
          alt="Billet VIP droit"
          className="w-48 lg:w-56 xl:w-64 h-auto drop-shadow-2xl rounded-2xl opacity-95"
        />
      </div>
    </>
  );
};
