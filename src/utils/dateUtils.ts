// Import date-fns functions at the top
import { format, isSameDay } from 'date-fns';

// Date utility functions
export const normalizeDate = (date: string | Date): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Create a new date using just the year, month, and day to avoid timezone issues
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const formatDateHeader = (dateString: string): string => {
  // Parse the date string properly to avoid timezone issues
  // For YYYY-MM-DD format, split and create date manually
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  
  const today = normalizeDate(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  console.log('dateString', dateString);
  console.log('parsed date', date);
  console.log('today', today);
  console.log('yesterday', yesterday);
  
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