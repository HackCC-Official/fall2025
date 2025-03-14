import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Mail, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { toast } from "sonner";
import { deleteAccount } from "../api/account";

interface AccountActionsProps {
  id: string;
  email: string;
}

export function AccountActions({ id, email }: AccountActionsProps) {
  const queryClient = useQueryClient();

  async function sendInvite() {
    const supabase = getBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_MAGIC_LINK
      }
    })

    if (error) {
      toast(error.message)
    }
  }

  const deleteMutatation = useMutation({
    mutationFn: async () => deleteAccount({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-transparent focus-visible:ring-0 w-4 h-4 hover:text-primary" size='icon' variant='ghost'>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            sendInvite()
          }}>
            <Mail /> Resend Invite
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            deleteMutatation.mutate();
          }}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}