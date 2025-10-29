import { accountClient } from "@/api/account-client";
import { AccountDTO } from "../types/account-dto";

export async function getAccounts(q?: string): Promise<AccountDTO[]> {
  return (await accountClient.request({
    method: 'GET',
    url: 'accounts',
    params: { q }
  })).data
}

export async function getAccountById(accountId: string): Promise<AccountDTO> {
  return (await accountClient.request({
    method: 'GET',
    url: 'accounts/' + accountId,
  })).data
}

export async function createAccountWithInviteLink({ accountDTO } : { accountDTO: AccountDTO }) : Promise<AccountDTO> {
  return (await accountClient.request({
    method: 'POST',
    url: 'accounts/invite-link',
    data: accountDTO
  })).data
}

export async function createAccount({ accountDTO } : { accountDTO: AccountDTO }) : Promise<AccountDTO>  {
  return (await accountClient.request({
    method: 'POST',
    url: 'accounts',
    data: accountDTO
  })).data
}

export async function updateAccount({ accountId, accountDTO } : { accountId: string, accountDTO: AccountDTO }) : Promise<AccountDTO> {
  return (await accountClient.request({
    method: 'PUT',
    url: 'accounts/' + accountId,
    data: accountDTO
  })).data
}

export async function deleteAccount({ id } : { id: string }) {
  await accountClient.request({
    method: 'DELETE',
    url: 'accounts/' + id,
  })
}