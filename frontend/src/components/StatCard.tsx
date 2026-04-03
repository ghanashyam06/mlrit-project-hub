import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'green' | 'blue' | 'red' | 'default';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, variant = 'default' }) => {
  const bgClass = {
    green: 'bg-gradient-card-green',
    blue: 'bg-gradient-card-blue',
    red: 'bg-gradient-card-red',
    default: 'bg-card',
  };

  const iconBg = {
    green: 'bg-primary/10 text-primary',
    blue: 'bg-secondary/10 text-secondary',
    red: 'bg-destructive/10 text-destructive',
    default: 'bg-muted text-muted-foreground',
  };

  return (
    <div className={cn("rounded-xl border border-border p-5 animate-fade-in", bgClass[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-heading font-bold mt-1 animate-count-up">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
