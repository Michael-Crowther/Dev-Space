import { addDays, subDays } from "date-fns";

export function randomDate(
  daysBefore: number = 7,
  daysAfter: number = 0
): Date {
  const now = new Date();
  const startDate = subDays(now, daysBefore);
  const endDate = addDays(now, daysAfter);

  const randomTimestamp =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTimestamp);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot return random item from empty list");
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export function randomBoolean(): boolean {
  return Math.random() >= 0.5;
}

export async function delaySeconds(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
