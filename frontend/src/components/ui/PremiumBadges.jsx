import React from 'react';

export const StatusBadge = ({ status, isDepartment }) => {
  const displayStatus = isDepartment && status === 'SUBMITTED' ? 'PENDING' : status;
  
  if (status === 'RESOLVED') {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        {displayStatus}
      </span>
    );
  }
  if (status === 'SUBMITTED' || status === 'PENDING') {
    return (
      <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
        {displayStatus}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
      {displayStatus}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  if (priority === 'HIGH') {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
        {priority}
      </span>
    );
  }
  if (priority === 'MEDIUM') {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
        {priority}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] bg-blue-500/10 text-blue-400 border border-blue-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5" />
      {priority}
    </span>
  );
};
