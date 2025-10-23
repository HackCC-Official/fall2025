import "./globals.css";
import { useState } from 'react';

import Apps from '../components/applications';
import Judgeblocks from '../components/judgesystem';
import JudgeEdit from '../components/judgeEdit';
import EmailManager from '../components/emailmanage';
import QRSys from '../components/qrscan';
import Button5 from '../components/applications';
import Button6 from '../components/applications';

export default function AdminPanel() {
  const [component, setComponent] = useState<React.ReactNode>(null);

  const loadComponent = (Comp: React.ElementType) => setComponent(<Comp />);

  return (
    <div className="flex flex-row h-[100%] min-h-screen">
      <div className="w-48 bg-gray-200 p-4 text-black flex flex-col items-center">
        <div className="mb-4 font-bold">W HackCC Admins</div>
        <button onClick={() => loadComponent(Apps)} className="w-full py-2 mb-2 bg-gray-300">
          Applications
        </button>
        <button onClick={() => loadComponent(Judgeblocks)} className="w-full py-2 mb-2 bg-gray-300">
          Judging
        </button>
        <button onClick={() => loadComponent(EmailManager)} className="w-full py-2 mb-2 bg-gray-300">
          Email Manager
        </button>
        <button onClick={() => loadComponent(QRSys)} className="w-full py-2 mb-2 bg-gray-300">
          QR Codes
        </button>
        <button onClick={() => loadComponent(JudgeEdit)} className="w-full py-2 mb-2 bg-gray-300">
          Judge Editor
        </button>
        <button onClick={() => loadComponent(Button6)} className="w-full py-2 mb-2 bg-gray-300">
          Button 6
        </button>
      </div>
      <div className="flex-grow p-6 bg-gray-700 text-white">{component}</div>
    </div>
  );
}
