import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AccountDTO, AccountRoles } from "../types/account-dto"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Gavel, Shield, User, Wrench } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAccountWithInviteLink, getAccountById, updateAccount } from "../api/account"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters long'}),
  lastName: z.string().min(2,  { message: 'Last name must be at least 2 characters long'}),
  email: z.string().email({ message: 'Email must be valid'}),
  roles: z.array(z.nativeEnum(AccountRoles))
})

export function AccountForm({ accountId, setOpen } : { accountId?: string, setOpen: (o: boolean) => void }) {
  const queryClient = useQueryClient()
  const accountMutation = useMutation({
    mutationFn: (accountDTO: AccountDTO) => 
      accountId ?  updateAccount({ accountId, accountDTO }) : createAccountWithInviteLink({ accountDTO }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      })
    }
  })

  const accountQuery = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountId ? getAccountById(accountId) : undefined,
    enabled: !!accountId
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: [AccountRoles.USER]
    }
  })

  useEffect(() => {
    if (accountId && accountQuery.data) {
      const account = accountQuery.data;
      console.log(account)
      form.reset({
        id: '',
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        roles: account.roles
      });
    }
  }, [accountId, accountQuery.data, form])

  const roleOptions = [
    {
      label: 'User',
      value: AccountRoles.USER,
      icon: User
    },
    {
      label: 'Judge',
      value: AccountRoles.JUDGE,
      icon: Gavel
    },
    {
      label: 'Organizer',
      value: AccountRoles.ORGANIZER,
      icon: Wrench
    },
    {
      label: 'Admin',
      value: AccountRoles.ADMIN,
      icon: Shield
    },
  ]

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    accountMutation.mutate(values)
    setOpen(false)
  }

  console.log(form.getValues())

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <h3 className="font-semibold">Personal Information</h3>
          <p className="text-muted-foreground text-xs">
            {"Fill in the fields for the user's personal information."}
          </p>
        </div>
        <div className="gap-8 grid grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Carl" {...field} />
                </FormControl>
                <FormDescription>
                  The first name of the user
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Backett" {...field} />
                </FormControl>
                <FormDescription>
                  The last name of the user
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <h3 className="font-semibold">Account Details</h3>
          <p className="text-muted-foreground text-xs">
            {"Fill in the fields for the account details."}
          </p>
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="carl_backett@hackcc.net" {...field} />
              </FormControl>
              <FormDescription>
                The email associated with the user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='roles'
          render={({field}) => (
            <FormItem>
            <FormLabel>Roles</FormLabel>
              <MultiSelect
                variant='secondary'
                options={roleOptions}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                placeholder="Select roles"
                animation={2}
                maxCount={3}
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
            accountId
            ?
            'Update Account'
            :
            'Create Account'
          }
        </Button>
      </form>
    </Form>
  )
}