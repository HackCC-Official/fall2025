import { Badge } from "@/components/ui/badge";
import { AccountRoles } from "../types/account-dto";

export function AdminBadge() {
  return (
    <Badge className="bg-amber-500 hover:bg-amber-400 border-amber-300 rounded-full font-medium text-white">
      Admin
    </Badge>
  )
}

export function OrganizerBadge() {
  return (
    <Badge className="bg-rose-600 hover:bg-rose-500 border-rose-400 rounded-full font-medium text-white">
      Organizer
    </Badge>
  )
}

export function JudgeBadge() {
  return (
    <Badge className="bg-green-600 hover:bg-green-500 border-green-400 rounded-full font-medium text-white">
      Judge
    </Badge>
  )
}

export function UserBadge() {
  return (
    <Badge className="bg-indigo-600 hover:bg-indigo-500 border-indigo-400 rounded-full font-medium text-white">
      User
    </Badge>
  )
}

export function RolesBadge({ roles }: { roles: AccountRoles[] }) {
  return (
    <div className="flex flex-wrap gap-2 min-w-max">
      {
        roles.map(role => {
          switch(role) {
            case AccountRoles.ADMIN:
              return <AdminBadge key={role} />
            case AccountRoles.JUDGE:
              return <JudgeBadge key={role} />
            case AccountRoles.ORGANIZER:
              return <OrganizerBadge key={role} />
            default:
              return <UserBadge key={role} />
          }
        })
      }
    </div>
  )
}