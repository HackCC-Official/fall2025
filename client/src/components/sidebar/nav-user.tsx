"use client"

import {
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"

export function NavUser({
  user,
  signOut,
}: {
  user: {
    name: string
    email: string
    avatar: string
  },
  signOut(): Promise<void>
}) {

  return (
    <SidebarMenu>
      <div className="flex items-center gap-2 p-2">
        <Avatar className="rounded-lg w-8 h-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="flex-1 grid text-sm text-left leading-tight">
          <span className="font-semibold truncate">{user.name}</span>
          <span className="text-xs truncate">{user.email}</span>
        </div>
        <Button size='icon' variant='ghost' onClick={() => signOut()}>
          <LogOut />
        </Button>
      </div>
    </SidebarMenu>
  )
}
