import { cn } from '@/utils/utils';

const Dot = ({ color, className }: { color: string; className?: string }) => {
  return <div className={cn(`w-3 h-3 rounded-full`, className)} style={{ background: color }}></div>;
};

export default Dot;
