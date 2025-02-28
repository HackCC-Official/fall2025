import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getInterestedUsers,
    createInterestedUser,
    deleteInterestedUser,
} from "@/features/outreach/api/outreach";
import type { InterestedUserDto } from "@/features/outreach/types/interested-users.dto";

type InterestedUsersResponse = Awaited<ReturnType<typeof getInterestedUsers>>;

/**
 * Custom hook to fetch and manage interested users data
 * @returns Object containing query and mutation functions for interested users
 */
export function useInterestedUsers() {
    const queryClient = useQueryClient();

    const query = useQuery<InterestedUsersResponse>({
        queryKey: ["interested-users"],
        queryFn: getInterestedUsers,
    });

    const createMutation = useMutation({
        mutationFn: (newUser: InterestedUserDto) =>
            createInterestedUser(newUser),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interested-users"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: string) => deleteInterestedUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interested-users"] });
        },
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        createUser: createMutation.mutate,
        deleteUser: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
