import { format } from "date-fns";

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM');
}

export function formatFullDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
}

export function getWeekProgress(): number {
  const startDate = new Date('2025-09-23');
  const currentDate = new Date();
  const totalWeeks = 11;
  
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return Math.min(Math.round((diffWeeks / totalWeeks) * 100), 100);
}

export function getCurrentWeek(): number {
  const startDate = new Date('2025-09-23');
  const currentDate = new Date();
  
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return Math.min(diffWeeks, 11);
}

export function getWeekDates(weekNumber: number): { start: Date; end: Date } {
  const startDate = new Date('2025-09-23');
  const weekStart = new Date(startDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  return { start: weekStart, end: weekEnd };
}
