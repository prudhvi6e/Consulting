// Maps icon-name strings (stored in the CMS) to lucide-react components.
// CMS records reference an icon by name; the site resolves it here.
import {
  Scale, TrendingUp, Landmark, Briefcase, Shield, Cpu, HeartPulse, Pill, Factory,
  HardHat, Truck, Zap, ShoppingBag, Rocket, Sprout, GraduationCap, Umbrella,
  Clapperboard, RadioTower, Building2, FileCheck, Globe2, Network, Gavel, BookOpen,
  Stamp, Lightbulb, Target, Users, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Scale, TrendingUp, Landmark, Briefcase, Shield, Cpu, HeartPulse, Pill, Factory,
  HardHat, Truck, Zap, ShoppingBag, Rocket, Sprout, GraduationCap, Umbrella,
  Clapperboard, RadioTower, Building2, FileCheck, Globe2, Network, Gavel, BookOpen,
  Stamp, Lightbulb, Target, Users,
};

/** Resolve a CMS icon name to a lucide component (falls back to a neutral icon). */
export function getIcon(name?: string | null): LucideIcon {
  return (name && ICONS[name]) || Building2;
}

export type { LucideIcon };
