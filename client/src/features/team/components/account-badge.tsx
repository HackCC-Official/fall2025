import { Badge } from "@/components/ui/badge";
import { AccountDTO } from "@/features/account/types/account-dto";

export function AccountBadge({ account } : { account: AccountDTO }) {
  return (
    <Badge>
      {getFormattedAccount(account)}
    </Badge>
  )
}

export function getFormattedAccount(account: AccountDTO): string {
  const a = account;
  return `${a.email} ${(a.firstName || a.lastName) ? `(${a.firstName} ${a.lastName})` : ''}`
}