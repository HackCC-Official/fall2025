import { MealType } from "../types/meal";

export function getHourAtPST(date: Date = new Date()) {
  const format = new Intl.DateTimeFormat('en', {hour: '2-digit', hour12: false, timeZone: 'America/Los_Angeles' })
  return Number(format.formatToParts(date)[0].value)
}

export function getMealType(currentHour: number) {
  return currentHour >= 6 && currentHour < 11 ?
  MealType.BREAKFAST
  :
  currentHour >= 11 && currentHour <= 14
  ?
  MealType.LUNCH
  :
  MealType.DINNER;
}