import { accountClient } from "@/api/account-client";
import { RequestTeamDTO, ResponseTeamDTO } from "../type/team";

export async function getTeams() : Promise<ResponseTeamDTO> {
  return (await accountClient.request({
    method: 'GET',
    url: 'teams'
  }))
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