import React, { useState } from 'react';
import { Bell, Heart, Mail, Newspaper, Smartphone, Tag } from 'lucide-react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';
import { NotificationPreferences } from '../../../types/dashboard';

export interface NotificationsTabProps {
  userEmail: string;
  userPhone: string;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  userEmail,
  userPhone,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    reminder: true,
    newDates: true,
    promos: true,
    newsletter: true,
    email: true,
    sms: true,
  });

  const updatePref = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Notifications"
        subtitle="Choisis comment et quand Sunu Events peut te contacter."
      />

      <div className="space-y-6">
        {/* GROUPE 1 : ÉVÈNEMENTS */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-[#111827] mb-2">
            Évènements
          </h3>

          <div className="divide-y divide-gray-100">
            {/* Paramètre 1 : Rappel */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Rappel avant un évènement
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    24h avant chaque évènement pour lequel tu as un billet
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.reminder}
                onChange={(val) => updatePref('reminder', val)}
                ariaLabel="Rappel avant un évènement"
              />
            </div>

            {/* Paramètre 2 : Nouvelles dates */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Nouvelles dates de tes artistes suivis
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Alerte dès qu'un favori programme un nouvel évènement
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.newDates}
                onChange={(val) => updatePref('newDates', val)}
                ariaLabel="Nouvelles dates"
              />
            </div>
          </div>
        </div>

        {/* GROUPE 2 : OFFRES & ACTUALITÉS */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-[#111827] mb-2">
            Offres & actualités
          </h3>

          <div className="divide-y divide-gray-100">
            {/* Paramètre 3 : Offres promos */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Offres promotionnelles
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Réductions et ventes flash sur des évènements sélectionnés
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.promos}
                onChange={(val) => updatePref('promos', val)}
                ariaLabel="Offres promotionnelles"
              />
            </div>

            {/* Paramètre 4 : Newsletter */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Newsletter mensuelle
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Le meilleur des sorties au Sénégal, une fois par mois
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.newsletter}
                onChange={(val) => updatePref('newsletter', val)}
                ariaLabel="Newsletter mensuelle"
              />
            </div>
          </div>
        </div>

        {/* GROUPE 3 : CANAUX */}
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-[#111827] mb-2">
            Canaux
          </h3>

          <div className="divide-y divide-gray-100">
            {/* Paramètre 5 : Email */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Notifications par email
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">
                    {userEmail}
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.email}
                onChange={(val) => updatePref('email', val)}
                ariaLabel="Notifications par email"
              />
            </div>

            {/* Paramètre 6 : SMS */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Notifications par SMS
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 font-normal">
                    +221 {userPhone}
                  </p>
                </div>
              </div>

              <ToggleSwitch
                checked={preferences.sms}
                onChange={(val) => updatePref('sms', val)}
                ariaLabel="Notifications par SMS"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
