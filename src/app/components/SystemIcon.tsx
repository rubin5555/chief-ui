// Placeholder "logos" for source systems, until the real system icons are available.
import { Network, ChartGantt, Boxes, Database, type LucideIcon } from 'lucide-react';

type SystemBrand = { Icon: LucideIcon; from: string; to: string };

const SYSTEM_BRANDS: Record<string, SystemBrand> = {
  unitree: { Icon: Network,    from: '#3BAA7A', to: '#1F7550' },
  ganttit: { Icon: ChartGantt, from: '#F59A4A', to: '#D9631E' },
  lineapp: { Icon: Boxes,      from: '#6E72E0', to: '#4146B5' },
};
const FALLBACK: SystemBrand = { Icon: Database, from: '#5B7BB0', to: '#1B3A6B' };

const SIZES = {
  xs: { box: 16, icon: 10, radius: 5 },
  sm: { box: 20, icon: 12, radius: 6 },
  md: { box: 28, icon: 16, radius: 8 },
} as const;

export function SystemIcon({ name, size = 'sm', className = '' }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  const { Icon, from, to } = SYSTEM_BRANDS[name.trim().toLowerCase()] ?? FALLBACK;
  const s = SIZES[size];
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: s.box, height: s.box, borderRadius: s.radius,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px ${to}55`,
      }}>
      <Icon color="#fff" strokeWidth={2.4} style={{ width: s.icon, height: s.icon }} />
    </span>
  );
}
