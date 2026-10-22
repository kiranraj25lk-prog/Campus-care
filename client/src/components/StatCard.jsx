import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtext }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-cobalt-600',
      border: 'border-blue-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100'
    }
  };

  const current = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${current.bg} ${current.text} ${current.border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">
          {value !== undefined ? value : 0}
        </span>
        {subtext && (
          <span className="text-xs text-slate-500 font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
