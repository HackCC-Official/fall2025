import { Button } from "@/components/ui/button"
import PanelLayout from "../layout"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/account/components/account-table/columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAccount, getAccounts } from "@/features/account/api/account";
import { AccountForm } from "@/features/account/components/account-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AccountDTO } from "@/features/account/types/account-dto";

export default function AccountPage() {
  const [accountId, setAccountId] = useState<string>('');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false)
  const { isLoading, data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  })

  const deleteAccountMutation = useMutation({
    mutationFn: async (accountId: string) => deleteAccount({ id: accountId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });

  function onEdit(value: AccountDTO) {
    setAccountId(value.id);
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  function onDelete(value: AccountDTO) {
    deleteAccountMutation.mutate(value.id)
  }
  return (
    <div>
      <h1 className="font-bold text-3xl">Account</h1>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus />
              Create User
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Create Account</SheetTitle>
                <SheetDescription>
                  Create an account to use for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <AccountForm accountId={accountId} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable 
        isLoading={isLoading} 
        data={data || []} 
        columns={columns} 
        onEdit={onEdit}
        onDelete={onDelete}
        enableRightClick 
      />
    </div>
  )
}

AccountPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>