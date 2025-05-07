import { AccountDTO } from "@/features/account/types/account-dto";

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  UNCLAIMED = 'UNCLAIMED',
  ALL = "ALL"
}

export interface ResponseMealAccountDTO {
  id: string;
  account: AccountDTO;
  event_id: string;
  mealType: MealType ;
  checkedInAt: string;
}

export interface RequestMealDTO {
  account_id: string;
  event_id: string;
}