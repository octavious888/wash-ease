import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'accepted':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'assigned':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'washing':
      return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    case 'washing_complete':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'delivery':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getStatusLabel(status: string) {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}