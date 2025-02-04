import { Badge } from "./ui/badge"

export function ActiveBadge() {
  return (
    <Badge className="border-emerald-500 bg-emerald-100 hover:bg-emerald-200 border rounded-lg text-emerald-500 cursor-pointer">
      <div className="bg-emerald-500 mr-2 rounded-full w-1 h-1"></div>
      Active
    </Badge>
  )
}

export function InactiveBadge() {
  return (
    <Badge className="bg-red-100 hover:bg-red-200 border border-red-500 text-red-500 cursor-pointer">
      <div className="bg-red-500 mr-2 rounded-full w-1 h-1"></div>
      Inactive
    </Badge>
  )
}