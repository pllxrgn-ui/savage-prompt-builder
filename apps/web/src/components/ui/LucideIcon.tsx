import {
  User,
  Mountain,
  MapPin,
  Package,
  Brush,
  Star,
  Droplets,
  BookOpen,
  Hexagon,
  Monitor,
  Image,
  Grid3x3,
  Box,
  Layers,
  Building,
  PersonStanding,
  Waves,
  Eye,
  Grid2x2,
  Scissors,
  Camera,
  Palette,
  PenTool,
  Sparkles,
  Sailboat,
  Cpu,
  Flame,
  Zap,
  Type,
  Banana,
  Server,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  User,
  Mountain,
  MapPin,
  Package,
  Brush,
  Star,
  Droplets,
  BookOpen,
  Hexagon,
  Monitor,
  Image,
  Grid3x3,
  Box,
  Layers,
  Building,
  PersonStanding,
  Waves,
  Eye,
  Grid2x2,
  Scissors,
  Camera,
  Palette,
  PenTool,
  Sparkles,
  Sailboat,
  Cpu,
  Flame,
  Zap,
  Type,
  Banana,
  Server,
};

interface LucideIconProps extends LucideProps {
  name: string;
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
