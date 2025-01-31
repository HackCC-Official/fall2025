import "../globals.css";
import Link from 'next/link'

export default function PanelLayout({ children } : { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-[100vh]">
      <div className="flex flex-col items-center bg-gray-200 p-4 w-48 text-black">
        <div className="mb-4 font-bold">W HackCC Admins</div>
        <Link href='application' className="bg-gray-300 mb-2 py-2 w-full">
          Applications
        </Link>
        <Link href='judging' className="bg-gray-300 mb-2 py-2 w-full">
          Judging
        </Link>
        <Link href='email' className="bg-gray-300 mb-2 py-2 w-full">
          Email Manager
        </Link>
        <Link href="qr-code" className="bg-gray-300 mb-2 py-2 w-full">
          QR Codes
        </Link>
      </div>
      <div className="flex-grow bg-gray-700 p-6 text-white">{children}</div>
    </div>
  );
}
