import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, showIcon = true, size = 'sm' }) {
  let badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  let Icon = Clock;

  if (status === 'In Progress') {
    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
    Icon = RefreshCw;
  } else if (status === 'Resolved') {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    Icon = CheckCircle2;
  }

  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${badgeStyle} ${sizeClasses}`}>
      {showIcon && <Icon className={`w-3.5 h-3.5 ${status === 'In Progress' ? 'animate-spin' : ''}`} />}
      {status || 'Pending'}
    </span>
  );
}
