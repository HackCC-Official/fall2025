import { accountClient } from "@/api/account-client";
import { RequestTeamDTO, ResponseTeamDTO } from "../type/team";

export async function getTeams() : Promise<ResponseTeamDTO[]> {
  return (await accountClient.request({
    method: 'GET',
    url: 'teams'
  })).data
}

export async function getTeamById(teamId: string) : Promise<ResponseTeamDTO> {
  return (await accountClient.request({
    method: 'GET',
    url: 'teams/' + teamId
  })).data
}

export async function getTeamByAccountId(accountId: string) : Promise<ResponseTeamDTO> {
  return (await accountClient.request({
    method: 'GET',
    url: 'teams/account/' + accountId
  })).data
}

export async function createTeam(teamDTO: RequestTeamDTO) : Promise<ResponseTeamDTO> {
  return (await accountClient.request({
    method: 'POST',
    url: 'teams',
    data: teamDTO
  }))
}

export async function updateTeam(teamId: string, teamDTO: RequestTeamDTO) : Promise<ResponseTeamDTO> {
  return (await accountClient.request({
    method: 'PUT',
    url: 'teams/' + teamId,
    data: teamDTO
  }))
}

export async function deleteTeam(teamId: string) {
  return (await accountClient.request({
    method: 'DELETE',
    url: 'teams/' + teamId,
  }))
}