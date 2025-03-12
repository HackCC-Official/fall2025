import { Button } from "@/components/ui/button"
import PanelLayout from "../layout"
import { Plus } from "lucide-react"
import { useRouter } from "next/router"
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/account/components/account-table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/account/api/account";
import { CreateAccountForm } from "@/features/account/components/create-account-form";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function AccountPage() {
  const router = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  })
  return (
    <div>
    <div className="py-10">
      <h1 className="font-bold text-3xl">Account</h1>
      <div className="flex space-x-4 my-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus />
              Create User
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[425px]">
              <SheetHeader>
                <SheetTitle>Create Account</SheetTitle>
                <SheetDescription>
                  Create an account to use for the hackathon
                </SheetDescription>
              </SheetHeader>
              <CreateAccountForm />
              <SheetFooter>
                <Button type="submit">Save changes</Button>
              </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <DataTable isLoading={isLoading} data={data || []} columns={columns} />
    </div>
    </div>
  )
}

AccountPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>