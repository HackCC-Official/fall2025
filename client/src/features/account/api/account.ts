import { accountClient } from "@/api/account-client";
import { AccountDTO } from "../types/account-dto";

export async function getAccounts(): Promise<AccountDTO[]> {
  return (await accountClient.request({
    method: 'GET',
    url: 'accounts'
  })).data
}

export async function createAccountWithInviteLink({ accountDTO } : { accountDTO: AccountDTO }) {
  await accountClient.request({
    method: 'POST',
    url: 'accounts/invite-link',
    data: accountDTO
  })
}

export async function deleteAccount({ id } : { id: string }) {
  await accountClient.request({
    method: 'DELETE',
    url: 'accounts/' + id,
  })
}