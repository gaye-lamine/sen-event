import React from 'react';

export interface DashboardSectionHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardSectionHeader: React.FC<DashboardSectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        {subtitle}
      </p>
    </div>
  );
};
