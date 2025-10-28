import { cn } from '@/lib/utils';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/router';

export function QrCodeScanner({ buttonLabel = 'Take Attendance' } : { buttonLabel?: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-600'>{buttonLabel}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>QR Code Scanner</DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto px-4 pb-4 w-full max-w-md'>
          <div className='relative p-4 rounded-3xl overflow-hidden'>
            <div className='rounded-2xl overflow-hidden'>
                <Scanner
                  onScan={(result) => {
                    const firstQrCode = result[0];
                    setOpen(false)
                    router.push(`/attendee-dashboard/${firstQrCode.rawValue}`)
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
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}