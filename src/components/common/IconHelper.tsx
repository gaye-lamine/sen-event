import React from 'react';
import {
  LayoutGrid,
  Music,
  Trophy,
  Tent,
  Theater,
  GraduationCap,
  Users,
  Moon,
  Smile,
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
  Check,
  Sparkles,
  Ticket,
  Clock,
  LucideIcon,
} from 'lucide-react';
import { IconHelperProps } from '../../types';

const ICON_MAP: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  all: LayoutGrid,
  layoutgrid: LayoutGrid,
  music: Music,
  concert: Music,
  trophy: Trophy,
  sport: Trophy,
  tent: Tent,
  festival: Tent,
  theater: Theater,
  theatre: Theater,
  graduationcap: GraduationCap,
  formation: GraduationCap,
  users: Users,
  conference: Users,
  moon: Moon,
  soiree: Moon,
  smile: Smile,
  humour: Smile,
  calendar: Calendar,
  mappin: MapPin,
  location: MapPin,
  heart: Heart,
  arrowright: ArrowRight,
  chevrondown: ChevronDown,
  chevronleft: ChevronLeft,
  chevronright: ChevronRight,
  search: Search,
  shoppingcart: ShoppingCart,
  cart: ShoppingCart,
  filter: SlidersHorizontal,
  sliders: SlidersHorizontal,
  x: X,
  check: Check,
  sparkles: Sparkles,
  ticket: Ticket,
  clock: Clock,
};

/**
 * @component IconHelper
 * @description Mappeur déclaratif en O(1) d'icônes vectorielles Lucide selon des identifiants textuels.
 * @param {IconHelperProps} props - Contrat de propriétés du composant
 */
export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-4 h-4', size }) => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || Music;
  return <IconComponent className={className} size={size} />;
};
