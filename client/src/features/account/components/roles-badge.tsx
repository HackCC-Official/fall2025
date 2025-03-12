import { Badge } from "@/components/ui/badge";
import { AccountRoles } from "../types/account-dto";

export function AdminBadge() {
  return (
    <Badge className="bg-indigo-600 border-indigo-400 rounded-full font-medium text-white">
      Admin
    </Badge>
  )
}

export function OrganizerBadge() {
  return (
    <Badge className="bg-rose-600 border-rose-400 rounded-full font-medium text-white">
      Organizer
    </Badge>
  )
}

export function JudgeBadge() {
  return (
    <Badge className="bg-green-600 border-green-400 rounded-full text-white">
      Judge
    </Badge>
  )
}

export function UserBadge() {
  return (
    <Badge className="bg-indigo-200 border-indigo-500 text-white">
      User
    </Badge>
  )
}

export function RolesBadge({ roles }: { roles: AccountRoles[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {
        roles.map(role => {
          switch(role) {
            case AccountRoles.ADMIN:
              return <AdminBadge />
            case AccountRoles.JUDGE:
              return <JudgeBadge />
            case AccountRoles.ORGANIZER:
              return <OrganizerBadge />
            default:
              return <UserBadge />
          }
        })
      }
    </div>
  )
}