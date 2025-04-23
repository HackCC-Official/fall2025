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
import { RequestTeamDTO } from "../type/team"
import { createTeam, getTeamById, updateTeam } from "../api/team"
import MultipleSelector from '@/components/ui/multiple-selector'
import { getFormattedAccount } from "../../account/components/account-badge"

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Team name must be at least 2 characters long'}),
  accounts: z.array(
    z.object({
    label: z.string(),
    value: z.string()
    })
  ).min(1, { message: 'Team must at least have one member in it'})
})

export function TeamForm({ teamId, setTeamId, setOpen } : { 
  teamId?: string, 
  setTeamId: Dispatch<SetStateAction<string>>, 
  setOpen: (o: boolean) => void 
}) {
  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q, 200);
  const queryClient = useQueryClient()

  
  const accountQuery = useQuery({
    queryKey: ['accounts', debouncedQ],
    queryFn: () => getAccounts(debouncedQ),
  })

  const teamQuery = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamId ? getTeamById(teamId) : undefined,
    enabled: !!teamId
  })

  const teamMutation = useMutation({
    mutationFn: (requestTeamDTO: RequestTeamDTO) => teamId ? updateTeam(teamId, requestTeamDTO) : createTeam(requestTeamDTO),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams']
      })
      if (teamId) {
        setTeamId('');
      }
      setOpen(false)
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      accounts: []
    }
  })

  useEffect(() => {
    if (teamId && teamQuery.data) {
      const team = teamQuery.data;
      form.reset({
        id: '',
        name: team.name,
        accounts: team.accounts.map(a => ({ label: getFormattedAccount(a), value: a.id }))
      });
    }
  }, [form, teamId, teamQuery.data])

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    teamMutation.mutate({
      name: values.name,
      account_ids: values.accounts.map(a => a.value)
    })
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <h3 className="font-semibold">Team Information</h3>
          <p className="text-muted-foreground text-xs">
            {"Fill in all fields for the team information."}
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
                Team&apos;s name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='accounts'
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
              The user roles
            </FormDescription>
            <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {
            teamId
            ?
            'Update Team'
            :
            'Create Team'
          }
        </Button>
      </form>
    </Form>
  )
}