import PanelLayout from "../layout"
import { MealType } from "@/features/meal/types/meal";
import { EventDTO } from "@/features/event/types/event-dto";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQueries } from "@tanstack/react-query";
import { getEvents } from "@/features/event/api/event";
import { getAccountsByEventAndMealType } from "@/features/meal/api/meal";
import { format } from "date-fns";
import { InputSearch } from "@/components/input-search";
import { EventSelect } from "@/features/attendance/components/event-select";
import { MealTab } from "@/features/meal/components/meal-tab";
import { PanelHeader } from "@/components/panel-header";

export default function MealPage() {
  const [q, setQ] = useState('');
  const [debouncedSetQ] = useDebounce(setQ, 500);
  const [event, setEvent] = useState<EventDTO>();
  const [mealType, setMealType] = useState<MealType>(MealType.UNCLAIMED);

  const [eventQuery, mealAccountQuery] = useQueries({
    queries: [
      {
        queryKey: ['events'],
        queryFn: () => getEvents(),
      },
      {
        queryKey: ['accounts-meals', event?.date || '', mealType],
        queryFn: () => getAccountsByEventAndMealType({
            event_id: event?.id || '',
            mealType: mealType
        }),
        enabled: !!(event?.id && mealType)
      },
    ]
  })

  useEffect(() => {
    if (eventQuery.data) {
      const todayDate = format(new Date(), 'y-MM-dd');
      const todayEvent = eventQuery.data.find(d => d.date === todayDate)
      if (!event && todayEvent) {
        setEvent(todayEvent)
      }
    }
  }, [eventQuery, event])


  const queriedData = mealAccountQuery.data ? mealAccountQuery.data?.filter(d => 
    d.account.email.includes(q) 
    || 
    (d.account.firstName ? d.account.firstName.includes(q) : false)
    || 
    (d.account.lastName ? d.account.lastName.includes(q) : false)
  ) : [];

  return (
    <div>
      <PanelHeader>Meals</PanelHeader>
      <div className="flex justify-between items-center gap-4 mt-8">
        <InputSearch q={q} setQ={debouncedSetQ} placeholder="Search accounts..." />
        <EventSelect events={eventQuery.data || []} value={event} onClick={setEvent} />
      </div>
      <MealTab data={queriedData || []} isLoading={mealAccountQuery.isLoading} className="mt-4" setMealType={setMealType} />
    </div>
  )
}

MealPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>