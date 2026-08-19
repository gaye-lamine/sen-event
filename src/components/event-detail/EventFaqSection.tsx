import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem, EventFaqSectionProps } from '../../types';

/**
 * @component EventFaqSection
 * @description Accordéon de foire aux questions fréquemment posées sur l'événement.
 * @param {EventFaqSectionProps} props - Contrat de propriétés du composant
 */
export const EventFaqSection: React.FC<EventFaqSectionProps> = ({ faq }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaq: FaqItem[] = [
    {
      question: 'À quelle heure ouvrent les portes ?',
      answer: "Les portes ouvrent généralement 2 heures avant le début du spectacle (dès 18h00) pour permettre le contrôle des billets électroniques et l'installation en salle.",
    },
    {
      question: 'Comment vais-je recevoir mes billets ?',
      answer: 'Vos billets avec QR Code sécurisé sont envoyés instantanément par e-mail et par SMS dès la confirmation de votre paiement Wave ou Orange Money.',
    },
    {
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons Wave Sénégal, Orange Money, Free Money et les cartes bancaires Visa / Mastercard.',
    },
    {
      question: 'Les billets sont-ils remboursables ?',
      answer: "En cas d'annulation ou de report de l'événement par l'organisateur, vos billets sont intégralement remboursés directement sur votre compte Wave ou Orange Money sous 48h.",
    },
  ];

  const items = faq && faq.length > 0 ? faq : defaultFaq;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 text-left pt-6">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        Questions fréquentes (FAQ)
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleAccordion(index)}
                type="button"
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-gray-900 hover:bg-gray-50/80 transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-gray-900' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
