import { cn } from '@/lib/utils';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, ScanIcon } from 'lucide-react';
import { AccountCard } from '@/features/attendance/components/account-card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccountById } from '@/features/account/api/account';
import { AccountDTO } from '@/features/account/types/account-dto';
import { getApplicationByUserId } from '@/features/application/api/application';
import { ApplicationResponseDTO } from '@/features/application/types/application';
import { Spinner } from './ui/spinner';
import { getAttendanceByEventIdAndAccountId, takeAttendance } from '@/features/attendance/api/attendance';
import { EventDTO } from '@/features/event/types/event-dto';
import { getEvents } from '@/features/event/api/event';
import { format } from 'date-fns';
import { ApplicationStatus } from '@/features/application/types/status.enum';
import { AttendanceStatus } from '@/features/attendance/types/attendance-dto';

export enum ScannerAction {
  ATTENDANCE = 'ATTENDANCE',
  MEAL = 'MEAL',
  WORKSHOP = 'WORKSHOP',
  BADGE = 'BADGE'
}

interface ScannerContextI {
  application?: ApplicationResponseDTO;
  currentEvent?: EventDTO;
  isLoading: boolean;
}

export const ScannerContext = createContext<ScannerContextI>({ application: undefined, currentEvent: undefined, isLoading: false })

export function QrCodeScanner({ buttonLabel = 'Take Attendance', type, currentEvent }
  : { buttonLabel?: string, type: ScannerAction, currentEvent?: EventDTO }) {
  
  const [open, setOpen] = useState(false)
  const [openAction, setOpenAction] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)

  const applicationQuery = useQuery({
    queryKey: [`application`, accountId],
    queryFn: () => getApplicationByUserId(accountId || ''),
    enabled: () => !!accountId
  })
  
  const ActionComponent = () => {
    switch (type) {
      case ScannerAction.ATTENDANCE:
        return <AttendanceAction />;
      case ScannerAction.MEAL:
        return <MealAction />;
      case ScannerAction.WORKSHOP:
        return <WorkshopAction />;
      case ScannerAction.BADGE:
        return <div>BADGE ACTION: NOT IMPLEMENTED</div>
      default:
        return <div>Unknown action, error!</div>
    }
  }

  return (
    <Drawer open={open} 
    onOpenChange={(open) => {
      if (!open) {
        setAccountId('')
        setOpenAction(false)
        setOpen(false);
      } else {
        setOpen(open)
      }
    }}>
      <DrawerTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-600'><ScanIcon /> {buttonLabel}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>QR Code Scanner</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto'>
          {
            !currentEvent &&
            <div className='py-8 font-bold text-xl'> 
              {"There's no on-going event currently :("}
            </div>
          }
          {
            currentEvent && open && !openAction &&
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
            currentEvent && openAction && (
            <ScannerContext value={{
              application: applicationQuery.data,
              isLoading: applicationQuery.isLoading,
              currentEvent
            }}>
              <ActionComponent />
            </ScannerContext>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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

function MealAction() {
  return (
    <div>
      <AccountCard />
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