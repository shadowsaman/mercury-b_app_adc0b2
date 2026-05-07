import React, { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
}

export function PageHeader({ title, subtitle, action, onAction, actionIcon }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && (
        <Button onClick={onAction} className="shrink-0">
          {actionIcon && <span className="mr-2 flex items-center">{actionIcon}</span>}
          {action}
        </Button>
      )}
    </div>
  );
}
