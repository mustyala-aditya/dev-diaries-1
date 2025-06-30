// Import date-fns functions at the top
import { format, isSameDay } from 'date-fns';

// Date utility functions
export const normalizeDate = (date: string | Date): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Create a new date using just the year, month, and day to avoid timezone issues
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const today = normalizeDate(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM d, yyyy');
  }
};

// Re-export date-fns functions we use
export { format, isSameDay };