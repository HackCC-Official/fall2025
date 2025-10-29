import "./globals.css";
import { useState } from 'react';

import Judgeblocks from '../components/judgesystem';
import JudgeEdit from '../components/judgeEdit';

export default function AdminPanel() {
  const [component, setComponent] = useState<React.ReactNode>(null);

  const loadComponent = (Comp: React.ElementType) => setComponent(<Comp />);

  return (
    <div className="flex flex-row h-[100%] min-h-screen">
      <div className="flex flex-col items-center bg-gray-200 p-4 w-48 text-black">
        <div className="mb-4 font-bold">W HackCC Admins</div>
        <button onClick={() => loadComponent(Judgeblocks)} className="bg-gray-300 mb-2 py-2 w-full">
          Judging
        </button>
        <button onClick={() => loadComponent(JudgeEdit)} className="bg-gray-300 mb-2 py-2 w-full">
          Judge Editor
        </button>
      </div>
      <div className="flex-grow bg-gray-700 p-6 text-white">{component}</div>
    </div>
  );
}
