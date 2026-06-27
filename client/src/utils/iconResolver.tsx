import {
  TrendingUp,
  TrendingDown,
  Home,
  Car,
  GraduationCap,
  Calculator,
  Wallet,
  Landmark,
  Receipt,
  Percent,
  Flame,
  Shield,
  ShieldCheck,
  Target,
  PieChart,
  BarChart3,
  Briefcase,
  Award,
  Heart,
  Coins,
  Calendar,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the kebab-case icon name strings stored in calculator configs to actual
 * lucide-react components. Calculator configs only ever store a string (so the data
 * layer has no React/UI dependency) — this is the single place that resolves it.
 *
 * NOTE: "bar-chart-2" maps to BarChart3, not a literal BarChart2 import. Lucide has
 * renamed/deprecated BarChart2 in some package versions (it became an alias for a
 * differently-named icon); BarChart3 is the stable, unambiguous choice across versions
 * and looks visually equivalent for this site's purposes. Mapping happens here rather
 * than editing every config that uses "bar-chart-2", so the config data (the actual
 * content) doesn't need to encode an implementation detail of one npm package's
 * version history.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  home: Home,
  car: Car,
  "graduation-cap": GraduationCap,
  calculator: Calculator,
  wallet: Wallet,
  landmark: Landmark,
  receipt: Receipt,
  percent: Percent,
  flame: Flame,
  shield: Shield,
  "shield-check": ShieldCheck,
  target: Target,
  "pie-chart": PieChart,
  "bar-chart-2": BarChart3,
  briefcase: Briefcase,
  award: Award,
  heart: Heart,
  coins: Coins,
  calendar: Calendar,
  "piggy-bank": PiggyBank,
};

const DEFAULT_ICON = Calculator;

export function resolveIcon(iconName?: string): LucideIcon {
  if (!iconName) return DEFAULT_ICON;
  return ICON_MAP[iconName] ?? DEFAULT_ICON;
}
