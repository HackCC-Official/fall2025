import { useState } from 'react';
import { Users, Trash2, QrCode, Plus, X, Bell, Check } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTeam, deleteTeam, getTeamByAccountId } from '@/features/team/api/team';
import { RequestTeamDTO, ResponseTeamDTO } from '@/features/team/type/team';
import { useAuthentication } from '@/features/auth/hooks/use-authentication';
import { AccountDTO } from '@/features/account/types/account-dto';
import { QrCodeScanner, ScannerAction } from '@/features/qr-code/components/qr-code-scanner';
import { Toaster } from '@/components/ui/toaster';
import { getAllNotification, acceptNotification, denyNotification } from '@/features/notification/api/notification';
import { ResponseNotificationDTO } from '@/features/notification/types/notification';

function CreateTeamCard({ onCreateTeam } : { onCreateTeam: (teamDTO: RequestTeamDTO) => Promise<void> }) {
    const [teamName, setTeamName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = () => {
        if (teamName.trim() && teamName.trim().length >= 2) {
            onCreateTeam({ name: teamName.trim(), account_ids: [] });
            setTeamName('');
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    if (!isCreating) {
        return (
            <button
                onClick={() => setIsCreating(true)}
                className="group flex flex-col justify-center items-center gap-3 bg-[#4A376B] hover:bg-[#523B75] p-8 rounded-3xl w-full transition-all animate-fadeIn duration-300"
            >
                <div className="flex justify-center items-center bg-[#FBF574] rounded-full w-16 h-16 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-[#4A376B]" />
                </div>
                <h3 className="font-bagel text-[#FBF574] text-2xl">Create New Team</h3>
            </button>
        );
    }

    return (
        <div className="bg-[#4A376B] p-8 rounded-3xl w-full animate-fadeIn">
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bagel text-[#FBF574] text-2xl">Create Team</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setIsCreating(false);
                            setTeamName('');
                        }}
                        className="flex justify-center items-center bg-[#523B75] hover:bg-[#3d2b59] rounded-full w-8 h-8 transition-colors"
                    >
                        <X className="w-5 h-5 text-[#FBF574]" />
                    </button>
                </div>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter team name (min. 2 characters)..."
                    className="bg-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-[#FBF574] focus:ring-2 w-full font-mont text-[#4A376B] placeholder-gray-400"
                    autoFocus
                />
                {teamName.trim() && teamName.trim().length < 2 && (
                    <p className="font-mont text-red-300 text-xs">
                        Team name must be at least 2 characters
                    </p>
                )}
                <button
                    onClick={handleSubmit}
                    disabled={!teamName.trim() || teamName.trim().length < 2}
                    className="bg-[#FBF574] hover:bg-[#f5ef60] disabled:bg-gray-400 py-4 rounded-2xl w-full font-mont font-semibold text-[#4A376B] transition-colors disabled:cursor-not-allowed"
                >
                    Create Team
                </button>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6 bg-[#4A376B] p-8 rounded-3xl w-full animate-pulse">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-400 rounded-full w-12 h-12"></div>
                    <div className="space-y-2">
                        <div className="bg-gray-400 rounded w-32 h-6"></div>
                        <div className="bg-gray-400 rounded w-20 h-4"></div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="bg-[#523B75] p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-400 rounded-full w-10 h-10"></div>
                        <div className="bg-gray-400 rounded w-24 h-4"></div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-400 py-4 rounded-2xl w-full h-14"></div>
        </div>
    );
}

function TeamMemberCard({ fullName, isYou } : { fullName: string, isYou: boolean }) {
    return (
        <div className="flex items-center gap-3 bg-[#523B75] hover:bg-[#5d4285] p-4 rounded-2xl transition-colors">
            <div className="flex flex-shrink-0 justify-center items-center bg-[#FBF574] rounded-full w-10 h-10">
                <span className="font-bagel text-[#4A376B] text-sm">
                    {fullName.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-mont font-medium text-white text-sm">
                    {fullName} {isYou && <span className="text-[#FBF574]">(You)</span>}
                </p>
            </div>
        </div>
    );
}

function InvitationCard({ notification, onAccept, onDecline, isLoading }: { 
    notification: ResponseNotificationDTO, 
    onAccept: (id: string) => void, 
    onDecline: (id: string) => void,
    isLoading: boolean
}) {
    const inviterName = `${notification.account.firstName} ${notification.account.lastName}`;
    
    return (
        <div className="bg-[#523B75] p-4 rounded-2xl animate-fadeIn">
            <div className="flex items-start gap-3">
                <div className="flex flex-shrink-0 justify-center items-center bg-[#FBF574] rounded-full w-10 h-10">
                    <Users className="w-5 h-5 text-[#4A376B]" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="mb-1 font-mont font-medium text-white text-sm">
                        {notification.team.name}
                    </p>
                    <p className="mb-3 font-mont text-gray-300 text-xs">
                        Invited by {inviterName}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onAccept(notification.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1 bg-[#FBF574] hover:bg-[#f5ef60] disabled:bg-gray-400 px-4 py-2 rounded-xl font-mont font-semibold text-[#4A376B] text-xs transition-colors disabled:cursor-not-allowed"
                        >
                            <Check className="w-3 h-3" />
                            Accept
                        </button>
                        <button
                            onClick={() => onDecline(notification.id)}
                            disabled={isLoading}
                            className="flex items-center gap-1 bg-[#4A376B] hover:bg-[#3d2b59] disabled:bg-gray-600 px-4 py-2 rounded-xl font-mont font-semibold text-gray-300 text-xs transition-colors disabled:cursor-not-allowed"
                        >
                            <X className="w-3 h-3" />
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationsPanel({ 
    notifications, 
    onAccept, 
    onDecline, 
    onClose,
    isLoading 
}: { 
    notifications: ResponseNotificationDTO[], 
    onAccept: (id: string) => void, 
    onDecline: (id: string) => void, 
    onClose: () => void,
    isLoading: boolean
}) {
    return (
        <div className="bg-[#4A376B] mb-6 p-6 rounded-3xl w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#FBF574]" />
                    <h3 className="font-bagel text-[#FBF574] text-xl">Team Invitations</h3>
                </div>
                <button
                    onClick={onClose}
                    className="flex justify-center items-center bg-[#523B75] hover:bg-[#3d2b59] rounded-full w-8 h-8 transition-colors"
                >
                    <X className="w-4 h-4 text-[#FBF574]" />
                </button>
            </div>
            
            {notifications.length === 0 ? (
                <p className="py-4 font-mont text-gray-300 text-sm text-center">
                    No pending invitations
                </p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <InvitationCard
                            key={notification.id}
                            notification={notification}
                            onAccept={onAccept}
                            onDecline={onDecline}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ActiveTeamCard({ team, onDeleteTeam } : { team: ResponseTeamDTO, onDeleteTeam: () => void }) {
    const { user } = useAuthentication()
    const canDelete = team.accounts.length === 1;
    const isTeamFull = team.accounts.length >= 4;

    return (
        <div className="space-y-6 bg-[#4A376B] p-8 rounded-3xl w-full animate-fadeIn">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex justify-center items-center bg-white rounded-full w-12 h-12">
                            <Users className="w-6 h-6 text-[#4A376B]" />
                        </div>
                        <h3 className="font-bagel text-white text-2xl">{team.name}</h3>
                    </div>
                    <p className="ml-15 font-mont text-gray-300 text-sm">
                        {team.accounts.length} {team.accounts.length === 1 ? 'member' : 'members'}
                    </p>
                </div>
                {canDelete && (
                    <button
                        onClick={onDeleteTeam}
                        className="flex justify-center items-center bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 transition-colors"
                        title="Delete team"
                    >
                        <Trash2 className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>

            {team.accounts.length > 0 && (
                <div>
                    <h4 className="mb-3 font-mont text-gray-300 text-sm">Team Members</h4>
                    <div className="space-y-2">
                        {team.accounts.map((account: AccountDTO) => (
                            <TeamMemberCard 
                                key={account.id} 
                                fullName={`${account.firstName} ${account.lastName}`} 
                                isYou={account.id === (user?.id || '')} 
                            />
                        ))}
                    </div>
                </div>
            )}

            <QrCodeScanner
                isPanel={false}
                type={ScannerAction.TEAM}
                currentTeam={team}
                button={
                <button
                    disabled={isTeamFull}
                    className="flex justify-center items-center gap-2 bg-[#FBF574] hover:bg-[#f5ef60] disabled:bg-gray-400 py-4 rounded-2xl w-full font-mont font-semibold text-[#4A376B] transition-colors disabled:cursor-not-allowed"
                >
                    <QrCode className="w-5 h-5" />
                    {isTeamFull ? 'Team Full (4/4)' : 'Scan QR Code to Invite'}
                </button>
                }   
            />
        </div>
    );
}

export function TeamUpSection() {
    const queryClient = useQueryClient()
    const { user } = useAuthentication()
    const [showNotifications, setShowNotifications] = useState(false);

    const teamQuery = useQuery({
        queryKey: ['team', user?.id],
        queryFn: () => getTeamByAccountId(user?.id || ''),
        enabled: !!user?.id
    })

    const notificationsQuery = useQuery({
        queryKey: ['notifications'],
        queryFn: getAllNotification,
        enabled: !!user?.id && !teamQuery.data, // Only fetch if user has no team
        refetchInterval: !teamQuery.data ? 30000 : false, // Only refetch if user has no team
    })

    const createTeamMutation = useMutation({
        mutationFn: (teamDTO: RequestTeamDTO) => createTeam(teamDTO),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['team', user?.id] })
        }
    })

    const deleteTeamMutation = useMutation({
        mutationFn: () => deleteTeam(teamQuery.data?.id || ''),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['team', user?.id] })
        },
    })

    const acceptNotificationMutation = useMutation({
        mutationFn: (notificationId: string) => acceptNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            queryClient.invalidateQueries({ queryKey: ['team', user?.id] })
        }
    })

    const denyNotificationMutation = useMutation({
        mutationFn: (notificationId: string) => denyNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const handleAcceptInvitation = (notificationId: string) => {
        acceptNotificationMutation.mutate(notificationId)
    };

    const handleDeclineInvitation = (notificationId: string) => {
        denyNotificationMutation.mutate(notificationId)
    };

    const notifications = notificationsQuery.data || [];
    const isNotificationActionLoading = acceptNotificationMutation.isPending || denyNotificationMutation.isPending;

    return (
        <div>
            <Toaster />
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-bagel text-white text-2xl sm:text-3xl md:text-4xl">Team Up</h1>
                {!teamQuery.data && (
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative flex justify-center items-center bg-[#4A376B] hover:bg-[#523B75] rounded-full w-12 h-12 transition-colors"
                    >
                        <Bell className="w-6 h-6 text-[#FBF574]" />
                        {notifications.length > 0 && (
                            <span className="-top-1 -right-1 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 font-mont font-bold text-white text-xs">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {!teamQuery.data && showNotifications && (
                <NotificationsPanel
                    notifications={notifications}
                    onAccept={handleAcceptInvitation}
                    onDecline={handleDeclineInvitation}
                    onClose={() => setShowNotifications(false)}
                    isLoading={isNotificationActionLoading}
                />
            )}
            
            {teamQuery.isLoading ? (
                <LoadingSkeleton />
            ) : !teamQuery.data ? (
                <CreateTeamCard onCreateTeam={
                    async (teamDTO: RequestTeamDTO) => 
                    { 
                        createTeamMutation.mutate(teamDTO) 
                    }
                } 
                />
            ) : (
                <ActiveTeamCard 
                    team={teamQuery.data} 
                    onDeleteTeam={() => { deleteTeamMutation.mutate() }}
                />
            )}

            <div className="bg-[#523B75] mt-6 p-6 rounded-3xl">
                <p className="font-mont text-gray-300 text-sm text-center">
                    Looking for teammates? Head over to the HackCC Discord server or use our QR code feature to connect!
                </p>
            </div>
        </div>
    );
}