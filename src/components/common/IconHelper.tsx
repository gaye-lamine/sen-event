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
} from 'lucide-react';
import { IconHelperProps } from '../../types';

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-4 h-4', size }) => {
  switch (name.toLowerCase()) {
    case 'grid':
    case 'all':
    case 'layoutgrid':
      return <LayoutGrid className={className} size={size} />;
    case 'music':
    case 'concert':
      return <Music className={className} size={size} />;
    case 'trophy':
    case 'sport':
      return <Trophy className={className} size={size} />;
    case 'tent':
    case 'festival':
      return <Tent className={className} size={size} />;
    case 'theater':
    case 'theatre':
      return <Theater className={className} size={size} />;
    case 'graduationcap':
    case 'formation':
      return <GraduationCap className={className} size={size} />;
    case 'users':
    case 'conference':
      return <Users className={className} size={size} />;
    case 'moon':
    case 'soiree':
      return <Moon className={className} size={size} />;
    case 'smile':
    case 'humour':
      return <Smile className={className} size={size} />;
    case 'calendar':
      return <Calendar className={className} size={size} />;
    case 'mappin':
    case 'location':
      return <MapPin className={className} size={size} />;
    case 'heart':
      return <Heart className={className} size={size} />;
    case 'arrowright':
      return <ArrowRight className={className} size={size} />;
    case 'chevrondown':
      return <ChevronDown className={className} size={size} />;
    case 'chevronleft':
      return <ChevronLeft className={className} size={size} />;
    case 'chevronright':
      return <ChevronRight className={className} size={size} />;
    case 'search':
      return <Search className={className} size={size} />;
    case 'shoppingcart':
    case 'cart':
      return <ShoppingCart className={className} size={size} />;
    case 'filter':
    case 'sliders':
      return <SlidersHorizontal className={className} size={size} />;
    case 'x':
      return <X className={className} size={size} />;
    case 'check':
      return <Check className={className} size={size} />;
    case 'sparkles':
      return <Sparkles className={className} size={size} />;
    case 'ticket':
      return <Ticket className={className} size={size} />;
    case 'clock':
      return <Clock className={className} size={size} />;
    default:
      return <Music className={className} size={size} />;
  }
};
