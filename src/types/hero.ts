import { CategoryItem, EventCategory } from './event';

export interface HeroSectionProps {
  searchQuery?: string;
  onSearch: (query: string) => void;
}

export interface CategoryPillsProps {
  categories: CategoryItem[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}
