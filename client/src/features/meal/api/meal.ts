import { qrClient } from "@/api/qr-client";
import { MealType, RequestMealDTO, ResponseMealAccountDTO } from "../types/meal";

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

export async function getMealByAccountIdAndEventIDAndMealType(
  event_id: string, mealType: MealType, account_id: string) : Promise<ResponseMealAccountDTO> {
    console.log(event_id, mealType, account_id)
  return (await qrClient.request({
    method: 'GET',
    url: `meals/event/${event_id}/type/${mealType}/account/${account_id}`,
  })).data
}

export async function claimMeal(requestMealDTO: RequestMealDTO) {
  return (await qrClient.request({
    method: 'POST',
    url: 'meals',
    data: requestMealDTO
  })).data
}