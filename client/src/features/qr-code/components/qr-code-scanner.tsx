import { cn } from '@/lib/utils';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, ScanIcon } from 'lucide-react';
import { AccountCard } from '@/features/attendance/components/account-card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccountById } from '@/features/account/api/account';
import { AccountDTO } from '@/features/account/types/account-dto';
import { getApplicationByUserId } from '@/features/application/api/application';
import { ApplicationResponseDTO } from '@/features/application/types/application';
import { Spinner } from '@/components/ui/spinner';
import { getAttendanceByEventIdAndAccountId, takeAttendance } from '@/features/attendance/api/attendance';
import { EventDTO } from '@/features/event/types/event-dto';
import { getEvents } from '@/features/event/api/event';
import { format } from 'date-fns';
import { ApplicationStatus } from '@/features/application/types/status.enum';
import { AttendanceStatus } from '@/features/attendance/types/attendance-dto';
import { claimMeal, getMealByAccountIdAndEventIDAndMealType } from '@/features/meal/api/meal';
import { MealType, RequestMealDTO } from '@/features/meal/types/meal';
import { getCurrentTime } from '@/features/event/utils/time';
import { getHourAtPST, getMealType } from '@/features/meal/utils/meal';
import { getTeamByAccountId } from '@/features/team/api/team';
import { sendNotification } from '@/features/notification/api/notification';
import { RequestNotificationDTO } from '@/features/notification/types/notification';
import { ResponseTeamDTO } from '@/features/team/type/team';
import { toast } from 'sonner';

export enum ScannerAction {
  ATTENDANCE = 'ATTENDANCE',
  MEAL = 'MEAL',
  WORKSHOP = 'WORKSHOP',
  BADGE = 'BADGE',
  TEAM = 'TEAM'
}

interface ScannerContextI {
  application?: ApplicationResponseDTO;
  currentEvent?: EventDTO;
  account?: AccountDTO;
  isLoading: boolean;
  currentTeam?: ResponseTeamDTO;
  isPanel: boolean;
}

export const ScannerContext = createContext<ScannerContextI>({ application: undefined, currentEvent: undefined, isLoading: false, account: undefined, currentTeam: undefined, isPanel: true })

export function QrCodeScanner({ 
  buttonLabel = 'Take Attendance', 
  type, 
  currentEvent, 
  mealType,
  button = <Button className='bg-green-500 hover:bg-green-600'><ScanIcon /> {buttonLabel}</Button>,
  isPanel = true,
  currentTeam
}
: 
{ 
  buttonLabel?: string,
  type: ScannerAction, 
  currentEvent?: EventDTO, 
  mealType?: MealType,
  button?: React.ReactElement,
  isPanel?: boolean,
  currentTeam?: ResponseTeamDTO
}) {
  
  const [open, setOpen] = useState<boolean>(false)
  const [openAction, setOpenAction] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)


  const applicationQuery = useQuery({
    queryKey: [`application`, accountId],
    queryFn: () => getApplicationByUserId(accountId || ''),
    enabled: () => !!accountId && isPanel
  })

  const accountQuery = useQuery({
    queryKey: [`account`, accountId],
    queryFn: () => getAccountById(accountId || ''),
    enabled: () => !!accountId && !isPanel
  })
  
  const ActionComponent = () => {
    switch (type) {
      case ScannerAction.ATTENDANCE:
        return <AttendanceAction />;
      case ScannerAction.MEAL:
        return ( mealType && <MealAction mealType={mealType} /> );
      case ScannerAction.WORKSHOP:
        return <WorkshopAction />;
      case ScannerAction.BADGE:
        return <div>BADGE ACTION: NOT IMPLEMENTED</div>
      case ScannerAction.TEAM:
        return <TeamAction closeDrawer={() => {
          setOpen(false)
          setOpenAction(false)
          setAccountId(null)
        }} />
      default:
        return <div>Unknown action, error!</div>
    }
  }

  return (
    <Drawer open={open} 
      onOpenChange={(open: boolean) => {
        if (!open) {
          setAccountId('')
          setOpenAction(false)
          setOpen(false);
        } else {
          setOpen(open)
        }
      }}>
      <DrawerTrigger asChild>
        {button}
      </DrawerTrigger>
      <DrawerContent className={cn(!isPanel && 'bg-[#5C4580] !border-[#5C4580] !outline-[#5C4580]')}>
        <DrawerHeader>
          <DrawerTitle className={cn([
            !isPanel && 'text-[#FBF574] font-bagel font-normal text-3xl'
          ])}>QR Code Scanner</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto'>
          {
            !currentEvent && type !== ScannerAction.TEAM &&
            <div className='py-8 font-bold text-xl'> 
              {"There's no on-going event currently :("}
            </div>
          }
          {
            ((isPanel && currentEvent && open && !openAction) || (!isPanel && open && !openAction)) &&
            (
            <div className='px-4 pb-4 w-full max-w-md'>
              <div className='relative p-4 rounded-3xl overflow-hidden'>
                <div className='rounded-2xl overflow-hidden'>
                    <Scanner
                      onScan={(result) => {
                        const firstQrCode = result[0];
                        setAccountId(firstQrCode.rawValue);
                        setOpenAction(true);
                      }}
                    />
                </div>
                {/* Corner borders */}
                <div className="top-2 left-2 absolute border-gray-700 border-t-2 border-l-2 rounded-tl-3xl w-12 h-12 pointer-events-none" />
                <div className="top-2 right-2 absolute border-gray-700 border-t-2 border-r-2 rounded-tr-3xl w-12 h-12 pointer-events-none" />
                <div className="bottom-2 left-2 absolute border-gray-700 border-b-2 border-l-2 rounded-bl-3xl w-12 h-12 pointer-events-none" />
                <div className="right-2 bottom-2 absolute border-gray-700 border-r-2 border-b-2 rounded-br-3xl w-12 h-12 pointer-events-none" />
              </div>
            </div>
            )
          }
          {
            ((isPanel && currentEvent && openAction) || (!isPanel && openAction)) && (
            <ScannerContext value={{
              application: applicationQuery.data,
              isLoading: applicationQuery.isLoading,
              currentEvent,
              account: accountQuery.data,
              currentTeam,
              isPanel
            }}>
              <ActionComponent />
            </ScannerContext>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button 
              className={cn([
                !isPanel && 'text-[#5C4580] font-mont bg-[#FBF574] border-0 rounded-xl hover:bg-[#f5ef60] font-semibold'
              ])}
              variant="outline"
              onClick={() => setOpen(false)}
            >
                Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function AttendanceAction() {
  const { application, currentEvent } = useContext(ScannerContext)

  const user_id: string = application && application.user.id || '';
  const event_id: string = currentEvent?.id || '';

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryFn: () => getAttendanceByEventIdAndAccountId(String(currentEvent?.id), user_id),
    queryKey: ['attendance', user_id],
    enabled: !!application
  })

  const takeAttendanceMutation = useMutation({
    mutationFn: async () => takeAttendance({ account_id: user_id, event_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] })
      queryClient.invalidateQueries({ queryKey: ['attendance', user_id] })
    }
  });

  const attendanceStatus: AttendanceStatus = data && data.status ? 
    data.status : AttendanceStatus.NOT_AVAILABLE;

  return (
    <div>
      <AccountCard />
      {
        isLoading &&
        <Spinner />
      }
      {
        !isLoading &&
        attendanceStatus === AttendanceStatus.ABSENT && (
          <div className='place-content-center grid mt-4'>
            <Button 
              className='bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
              onClick={() => takeAttendanceMutation.mutate()}
            >
              <Check /> Confirm Attendance
            </Button>
          </div>
        )
      }
      {
        !isLoading && 
        (attendanceStatus === AttendanceStatus.PRESENT || attendanceStatus == AttendanceStatus.LATE) && (
          <div className='mt-4 font-semibold text-xl text-center'>
            Already checked in!
          </div>
        )
      }
    </div>
  )
}

function MealAction({ mealType } : { mealType: MealType }) {
  const { application, currentEvent } = useContext(ScannerContext)

  const user_id: string = application && application.user.id || '';
  const event_id: string = currentEvent?.id || '';


  const currentHour = getHourAtPST()
  const currentMealStatus = getMealType(currentHour)

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryFn: () => getMealByAccountIdAndEventIDAndMealType(
      event_id,
      currentMealStatus,
      user_id
    ),
    queryKey: ['meal', user_id],
    enabled: !!application
  })

  const claimMealMutation = useMutation({
    mutationFn: async (requestMealDTO: RequestMealDTO) => claimMeal(requestMealDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['meal', user_id] })
    }
  });

  const currentMealType: MealType = (data && data.mealType) ? data.mealType : MealType.UNCLAIMED;

  return (
    <div>
      <AccountCard />
      {
        isLoading &&
        <Spinner />
      }
      {
        !isLoading &&
        currentMealType === MealType.UNCLAIMED && (
          <div className='place-content-center grid mt-4'>
            <Button 
              className='bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
              onClick={() => claimMealMutation.mutate({ event_id, account_id: user_id })}
            >
              <Check /> Confirm Meal Claim
            </Button>
          </div>
        )
      }
      {
        !isLoading && 
        (currentMealType !== MealType.UNCLAIMED) && (
          <div className='mt-4 font-semibold text-xl text-center'>
            Meal already claimed
          </div>
        )
      }
    </div>
  )
}

function WorkshopAction() {
  return (
    <div>
      <AccountCard />
    </div>
  )
}

function TeamAction({ closeDrawer } : { closeDrawer: () => void }) {
    const { account, currentTeam, } = useContext(ScannerContext)

  const user_id: string = account && account.id || '';

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryFn: () => getTeamByAccountId(user_id),
    queryKey: ['team', user_id],
    enabled: !!account
  })

  const sendNotificationlMutation = useMutation({
    mutationFn: (notificationDTO: RequestNotificationDTO) => sendNotification(notificationDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', user_id] })
    }
  });
  

  if (data) {
    return (
      <div className='my-8 font-mont text-white text-2xl'>
        Hacker already has a team :(
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center my-4'>
      <div className='my-8'>
        <AccountCard />
      </div>  
      {
        isLoading &&
        <Spinner />
      }
      {
        !isLoading &&
        <Button 
          className='bg-green-600 hover:bg-green-700 py-4 rounded-xl font-mont'
          onClick={() => {
            sendNotificationlMutation.mutate({ accountId: account?.id || '', teamId: currentTeam?.id || '' })
            closeDrawer()
            toast.success('User invited to team!')
          }}
        >
            Invite to team
        </Button>
      }
    </div>
  )
}