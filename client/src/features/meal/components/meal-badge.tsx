import { FullRoundBadge } from "@/features/attendance/components/attendance-badge";
import React from "react";
import { MealType } from "../types/meal";

export function UnclaimedBadge() {
  return (
    <FullRoundBadge>
      Unclaimed
    </FullRoundBadge>
  )
}

export function BreakfastBadge() {
  return (
    <FullRoundBadge className="bg-blue-500 hover:bg-blue-600">
      Breakfast
    </FullRoundBadge>
  )
}

export function LunchBadge() {
  return (
    <FullRoundBadge className="bg-amber-500 hover:bg-amber-600">
      Lunch
    </FullRoundBadge>
  )
}

export function DinnerBadge() {
  return (
    <FullRoundBadge className="bg-pink-500 hover:bg-pink-600">
      Dinner
    </FullRoundBadge>
  )
}

export function MealBadge({ mealType } : { mealType: MealType }) {
  switch(mealType) {
    case MealType.BREAKFAST:
      return <BreakfastBadge />
    case MealType.LUNCH:
      return <LunchBadge />
    case MealType.DINNER:
      return <DinnerBadge />
    default:
      return <UnclaimedBadge />
  }
}