import { useQuery } from "@tanstack/react-query";
import { getOutreachTeam } from "@/features/outreach/api/outreach";

type OutreachTeamResponse = Awaited<ReturnType<typeof getOutreachTeam>>;

/**
 * Custom hook to fetch and manage outreach team data
 * @returns Query object containing outreach team data and loading state
 */
export function useOutreachTeam() {
    return useQuery<OutreachTeamResponse>({
        queryKey: ["outreach-team"],
        queryFn: getOutreachTeam,
    });
}
