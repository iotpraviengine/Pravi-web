import {
  BadgeCheck, Building2, Bus, CalendarClock, Camera, ClipboardCheck, CloudFog, Cpu, Expand, Footprints,
  Forklift, Hammer, HandCoins, Headset, Heart, Hospital, Layers, Lightbulb, Megaphone, MicVocal, Monitor,
  Music, Package, Palette, PartyPopper, Presentation, Projector, Ruler, School, Search, ShieldCheck,
  SlidersHorizontal, Snowflake, Sparkles, Store, Sun, TriangleAlert, Trophy, Truck, Tv, UserCog, Users,
  UtensilsCrossed, Video, Wrench, Zap, type LucideIcon,
} from "lucide-react";

// Content JSON refers to icons by name; only the icons listed here are bundled.
const icons: Record<string, LucideIcon> = {
  BadgeCheck, Building2, Bus, CalendarClock, Camera, ClipboardCheck, CloudFog, Cpu, Expand, Footprints,
  Forklift, Hammer, HandCoins, Headset, Heart, Hospital, Layers, Lightbulb, Megaphone, MicVocal, Monitor,
  Music, Package, Palette, PartyPopper, Presentation, Projector, Ruler, School, Search, ShieldCheck,
  SlidersHorizontal, Snowflake, Sparkles, Store, Sun, TriangleAlert, Trophy, Truck, Tv, UserCog, Users,
  UtensilsCrossed, Video, Wrench, Zap,
};

export function Icon({ name, size = 28 }: { name: string; size?: number }) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp size={size} strokeWidth={1.6} aria-hidden="true" />;
}
