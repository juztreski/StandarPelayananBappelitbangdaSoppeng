import {
  MessageSquare, Megaphone, Database, DoorOpen, Lightbulb, Users,
  FileText, BarChart3, ClipboardCheck, TrendingUp, Wallet, Coffee,
  Calendar, Stethoscope, Baby, AlertCircle, Sun, GraduationCap,
  ArrowLeftRight, Award, FileBarChart, type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare, Megaphone, Database, DoorOpen, Lightbulb, Users,
  FileText, BarChart3, ClipboardCheck, TrendingUp, Wallet, Coffee,
  Calendar, Stethoscope, Baby, AlertCircle, Sun, GraduationCap,
  ArrowLeftRight, Award, FileBarChart,
};

export function getServiceIcon(name: string | null): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return FileBarChart;
}
