import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { getAccounts } from "@/features/account/api/account"
import MultipleSelector from '@/components/ui/multiple-selector'
import { getFormattedAccount } from "../../account/components/account-badge"
import { createWorkshop, getWorkshopById, updateWorkshop } from "../api/workshop"
import { WorkshopRequestDTO } from "../types/workshop"

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Workshop name must be at least 2 characters long'}),
  description: z.string(),
  location: z.string().min(1, { message: 'Workshop location is required'}),
  organizers: z.array(
    z.object({
    label: z.string(),
    value: z.string()
    })
  ).min(1, { message: 'Team must at least have one member in it'}),
})

export function WorkshopForm({ workshopId, setWorkshopId, setOpen } : { 
  workshopId?: string, 
  setWorkshopId: Dispatch<SetStateAction<string>>, 
  setOpen: (o: boolean) => void 
}) {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q, 200);
  const queryClient = useQueryClient()

  
  const accountQuery = useQuery({
    queryKey: ['accounts', debouncedQ],
    queryFn: () => getAccounts(debouncedQ),
  })

  const workshopQuery = useQuery({
    queryKey: ['workshop', workshopId],
    queryFn: () => workshopId ? getWorkshopById(workshopId) : undefined,
    enabled: !!workshopId
  })

  const teamMutation = useMutation({
    mutationFn: (requestWorkshopDTO: WorkshopRequestDTO) => 
      workshopId ? 
      updateWorkshop(workshopId, requestWorkshopDTO) 
      : 
      createWorkshop(requestWorkshopDTO),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['workshops']
      })
      if (workshopId) {
        setWorkshopId('');
      }
      setOpen(false)
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      location: '',
      organizers: []
    }
  })

  useEffect(() => {
    if (workshopId && workshopQuery.data) {
      const workshop = workshopQuery.data;
      form.reset({
        id: '',
        name: workshop.name,
        description: workshop.description,
        location: workshop.location,
        organizers: workshop.organizers.map(a => ({ label: getFormattedAccount(a), value: a.id }))
      });
    }
  }, [form, workshopQuery.data, workshopId])

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    teamMutation.mutate({
      name: values.name,
      description: values.description,
      location: values.location,
      organizers: values.organizers.map(a => a.value)
    })
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <h3 className="font-semibold">Workshop Information</h3>
          <p className="text-muted-foreground text-xs">
            {"Fill in all fields for the workshop information."}
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Carl" {...field} />
              </FormControl>
              <FormDescription>
                Workshop&apos;s name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Carl loves our backend system" {...field} />
              </FormControl>
              <FormDescription>
                Workshop&apos;s description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Drescher Hall, DSCH 205" {...field} />
              </FormControl>
              <FormDescription>
                Workshop&apos;s location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='organizers'
          render={({field}) => (
            <FormItem>
            <FormLabel>Members</FormLabel>
              <MultipleSelector
                inputProps={{
                  onValueChange: (value: string) => {
                    setQ(value)
                  }
                }}
                value={field.value}
                onChange={field.onChange}
                placeholder="Search accounts"
                options={
                  accountQuery.data?.map(a => 
                      ({ 
                      label: getFormattedAccount(a),
                      value: a.id 
                      })) 
                    || 
                    []
                }
              />
            <FormDescription>
              The workshop organizers
            </FormDescription>
            <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {
            workshopId
            ?
            'Update Workshop'
            :
            'Create Workshop'
          }
        </Button>
      </form>
    </Form>
  )
}