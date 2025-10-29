import { cn } from "@/lib/utils";
import { MealType, ResponseMealAccountDTO } from "../types/meal";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { columns } from "./meal-table/columns";

interface MealTabProps {
  className?: string;
  setMealType: (mealType: MealType) => void;
  isLoading: boolean;
  data: ResponseMealAccountDTO[];
  EventSelect: React.ReactNode
}

export function MealTab({ className, setMealType, isLoading, data, EventSelect }: MealTabProps) {
  return (
    <Tabs defaultValue={MealType.ALL} 
      onValueChange={(mealType) => setMealType(mealType as MealType)}
      className={cn([
        "w-full",
        className
      ])}
    >
      <div className="flex gap-4 mb-2">
        <TabsList>
          <TabsTrigger className="w-full" value={MealType.ALL}>All</TabsTrigger>
          <TabsTrigger className="w-full" value={MealType.UNCLAIMED}>Unclaimed</TabsTrigger>
          <TabsTrigger className="w-full" value={MealType.BREAKFAST}>Breakfast</TabsTrigger>
          <TabsTrigger className="w-full" value={MealType.LUNCH}>Lunch</TabsTrigger>
          <TabsTrigger className="w-full" value={MealType.DINNER}>Dinner</TabsTrigger>
        </TabsList>
        {EventSelect}
      </div>
      <TabsContent value={MealType.ALL}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={MealType.UNCLAIMED}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={MealType.BREAKFAST}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={MealType.LUNCH}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={MealType.DINNER}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
    </Tabs>
  )
}