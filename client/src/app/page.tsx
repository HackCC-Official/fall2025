import Image from "next/image";
import QRScanner from "./components/qrscan"

export default function Home() {
  return (
    <div className="">
      <button className="">See Your Judging Schedule</button>
      <button>Input Judging Scores</button>
      <button>View Applications</button>
      <button>Scan QR Codes</button>
      <button>Edit Judging Blocks</button>
      <button>Email Manager</button>
    </div>
  );
}
