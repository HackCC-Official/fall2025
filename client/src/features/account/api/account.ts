import { accountClient } from "@/api/account-client";
import { AccountDTO } from "../types/account-dto";

export async function getAccounts(): Promise<AccountDTO[]> {
  return (await accountClient.request({
    method: 'GET',
    url: 'accounts'
  })).data
}
