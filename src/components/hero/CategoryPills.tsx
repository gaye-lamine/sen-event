import React from 'react';
import { EventCategory, CategoryItem } from '../../types/event';
import { IconHelper } from '../common/IconHelper';

interface CategoryPillsProps {
  categories: CategoryItem[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                type="button"
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#0F141C] text-white shadow-sm ring-1 ring-black'
                      : 'bg-white text-gray-700 border border-gray-200/90 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                <IconHelper
                  name={cat.iconName}
                  className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
