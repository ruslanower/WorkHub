import * as React from 'react';
import {
  Hammer,
  Paintbrush,
  Truck,
  Sparkles,
  Wrench,
  Zap,
  HardHat,
  Package,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Hammer':
      return <Hammer className={className} />;
    case 'PaintRoller':
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'HardHat':
      return <HardHat className={className} />;
    default:
      return <Package className={className} />;
  }
};
