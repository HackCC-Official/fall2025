import { qrClient } from "@/api/qr-client";
import { MealType, ResponseMealAccountDTO } from "../types/meal";

export async function getAccountsByEventAndMealType(
  mealParams : {
    event_id: string,
    mealType: MealType
  }
): Promise<ResponseMealAccountDTO[]> {
  return (await qrClient.request({
    method: 'GET',
    url: 'meals',
    params: mealParams
  })).data
}