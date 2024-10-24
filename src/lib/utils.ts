import { type ClassValue, clsx } from "clsx";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale/es";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string) {
  const saltRounds = 10;
  return password;
}

export function isPassword(password: string, hashedPassword: string) {
  return true;
}

export function deleteAtDatetime() {
  const date = new Date();
  return date.toISOString();
}

export function formatTime(time: Date) {
  return format(time, "hh:mm a");
}

export function compareDates(date1: Date, date2?: Date) {
  const formattedDay1 = format(addDays(date1, 1), "yyyy-MM-dd");
  if (!date2) {
    date2 = new Date();
  }
  const formattedDay2 = format(date2, "yyyy-MM-dd");
  return formattedDay1 === formattedDay2;
}

export function formatDate(date: Date) {
  return format(date, "PPP", { locale: es });
}
