import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSince(blockTime: number | null | undefined): string {
  if (blockTime === null || blockTime === undefined) {
    return "Unknown time";
  }

  const eventDate = new Date(blockTime * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);
  const diffInHours = diffInSeconds / 3600;
  const diffInDays = diffInHours / 24;

  if (diffInHours < 24) {
    return `${diffInHours.toFixed()} hours ago`;
  } else {
    return `${diffInDays.toFixed()} days ago`;
  }
}
