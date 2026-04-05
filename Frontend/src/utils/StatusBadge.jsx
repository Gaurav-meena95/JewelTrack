import React from 'react';

const paymentStatusColors = {
   paid: 'bg-green-500/10 text-green-500 border-green-500/30',
   partially_paid: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
   unpaid: 'bg-red-500/10 text-red-500 border-red-500/30',
};

const StatusBadge = ({ status, className }) => {
   const colorClass = paymentStatusColors[status] || 'bg-secondary/10 text-muted-foreground border-border/30';
   const label = status ? status.replace('_', ' ') : 'unknown';
   
   return (
      <span className={`px-3 py-1 text-xs rounded-full border uppercase inline-block ${colorClass} ${className || ''}`}>
         {label}
      </span>
   );
};

export default StatusBadge;
