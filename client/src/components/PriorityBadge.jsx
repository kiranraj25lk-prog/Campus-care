import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority, size = 'sm' }) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = ArrowDown;

  if (priority === 'High') {
    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
    Icon = AlertCircle;
  } else if (priority === 'Medium') {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    Icon = AlertTriangle;
  }

  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${badgeStyle} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      {priority || 'Medium'}
    </span>
  );
}
