export interface EventDTO {
  id?: string;
  date: string;
  startingTime: string;
  lateTime: string;
  endingTime: string;
  active: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}