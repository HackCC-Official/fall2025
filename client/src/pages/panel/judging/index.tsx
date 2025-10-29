import PanelLayout from "../layout"

export default function JudgingPage() {
  return (
    <JudgeSystem />
  )
}

JudgingPage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>

import { useState, useEffect } from "react";
import axios from "axios";
import { judgeClient } from "@/api/judge-client";
import { accountClient } from "@/api/account-client";

type Assignment = { judge: string; team: string };
type Round = { round: number; assignments: Assignment[]; time: string };
type Row = {
  id: number;
  round: number;
  judge: number;
  team: number;
  startTime: string;
  private: boolean;
};

export function JudgeSystem() {
  const [numJudges, setNumJudges] = useState(0);
  const [numTeams, setNumTeams] = useState(0);
  const [schedule, setSchedule] = useState<{ team: string; judges: string[] }[]>([]);
  const [judgeToTeams, setJudgeToTeams] = useState<Record<string, string[]>>({});
  const [rounds, setRounds] = useState<Round[]>([]);
  const [backendPayload, setBackendPayload] = useState<Omit<Row, "id">[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startTime, setStartTime] = useState("12:00 PM");
  const [buttonState, setButtonState] = useState<"initial" | "goLive" | "makePrivate">("initial");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);

  function parseTimeToMinutes(t: string) {
    const [time, meridiem] = t.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  
  function formatMinutes(m: number) {
    const hh24 = Math.floor(m / 60) % 24;
    const mm = m % 60;
    const hh12 = hh24 % 12 || 12;
    const suffix = hh24 < 12 ? "AM" : "PM";
    return `${String(hh12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${suffix}`;
  }
  
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoadingPercent(10);
        const { data } = await judgeClient.get<Row[]>("/rounds");
        
        if (!data.length) {
          setLoadingPercent(100);
          setTimeout(() => setIsLoading(false), 100);
          return;
        }
        
        setLoadingPercent(25);
        const map = new Map<string, Row>();
        data.forEach((row) => {
          const key = `${row.round}|${row.judge}|${row.team}`;
          if (!map.has(key)) map.set(key, row);
        });
        const unique = Array.from(map.values());
        setLoadingPercent(40);
        
        const jm: Record<string, Set<string>> = {};
        const tm: Record<string, Set<string>> = {};
        unique.forEach(({ judge, team }) => {
          const jKey = `Judge ${judge}`, tKey = `Team ${team}`;
          (jm[jKey] ||= new Set()).add(tKey);
          (tm[tKey] ||= new Set()).add(jKey);
        });
        setLoadingPercent(55);
        
        const sortedJudges = Object.keys(jm).sort((a, b) => +a.match(/\d+/)![0] - +b.match(/\d+/)![0]);
        const sortedTeams = Object.keys(tm).sort((a, b) => +a.match(/\d+/)![0] - +b.match(/\d+/)![0]);
        
        const judgeCount = sortedJudges.length;
        const teamCount = sortedTeams.length;
        
        const judgeToTeamsMap = Object.fromEntries(
          sortedJudges.map((j) => [j, Array.from(jm[j]).sort((a, b) => +a.match(/\d+/)![0] - +b.match(/\d+/)![0])])
        );
        
        const scheduleMap = sortedTeams.map((t) => ({
          team: t,
          judges: Array.from(tm[t]).sort((a, b) => +a.match(/\d+/)![0] - +b.match(/\d+/)![0]),
        }));
        
        setLoadingPercent(70);
        
        const byR: Record<number, { assignments: Assignment[]; time: string }> = {};
        unique.forEach(({ round, judge, team, startTime }) => {
          byR[round] ||= { assignments: [], time: startTime };
          byR[round].assignments.push({ judge: `Judge ${judge}`, team: `Team ${team}` });
        });
        
        const loadedRounds: Round[] = Object.entries(byR)
          .map(([r, info]) => {
            const seen = new Set<string>();
            const uniqAssignments = info.assignments.filter((a) => {
              const k = `${a.judge}|${a.team}`;
              if (seen.has(k)) return false;
              seen.add(k);
              return true;
            });
            return {
              round: +r,
              time: info.time,
              assignments: uniqAssignments.sort((a, b) => +a.judge.match(/\d+/)![0] - +b.judge.match(/\d+/)![0]),
            };
          })
          .sort((a, b) => a.round - b.round);
        
        setLoadingPercent(85);
        
        const payload = unique.map(({ id, ...rest }) => rest);
        const publicCount = unique.filter((i) => i.private === false || i.private === 0).length;
        const currentState = publicCount > 0 ? "makePrivate" : "goLive";
        
        setLoadingPercent(95);
        
        setNumJudges(judgeCount);
        setNumTeams(teamCount);
        setJudgeToTeams(judgeToTeamsMap);
        setSchedule(scheduleMap); 
        setRounds(loadedRounds);
        setBackendPayload(payload);
        setButtonState(currentState);
        setStartTime(loadedRounds[0].time);
        setShowSchedule(true);
        setIsGenerated(false);
        setLoadingPercent(100);
        setTimeout(() => setIsLoading(false), 200);
        
      } catch (err) {
        console.error("GET /rounds failed:", err);
        setLoadingPercent(100);
        setTimeout(() => setIsLoading(false), 200);
      }
    };
    loadSchedule();
  }, []);
  
  useEffect(() => {
    if (!isGenerated) return;
    const base = parseTimeToMinutes(startTime);
    const updated = rounds.map((r) => ({ ...r, time: formatMinutes(base + (r.round - 1) * 10) }));
    setRounds(updated);
    const payload = updated.flatMap((r) =>
      r.assignments.map((a) => ({
        round: r.round,
        judge: +a.judge.replace(/\D/g, ""),
        team: +a.team.replace(/\D/g, ""),
        startTime: r.time,
        private: false,
      }))
    );
    setBackendPayload(payload);
  }, [startTime, isGenerated]);
  
  function generateSchedule() {
    if (numJudges < 3) return alert("Need at least 3 judges.");
    if (!numJudges || !numTeams) return alert("Enter valid numbers.");
    
    const judges = Array.from({ length: numJudges }, (_, i) => `Judge ${i + 1}`);
    const teams = Array.from({ length: numTeams }, (_, i) => `Team ${i + 1}`);
    
    const loadCount = Object.fromEntries(judges.map((j) => [j, 0]));
    const pairCount: Record<string, number> = {};
    const jtMap: Record<string, string[]> = Object.fromEntries(judges.map((j) => [j, []]));
    const tmMap: Record<string, string[]> = Object.fromEntries(teams.map((t) => [t, []]));
    const pk = (a: string, b: string) => [a, b].sort().join("-");
    
    const scheduleMap = teams.map((team) => {
      const assigned: string[] = [];
      for (let i = 0; i < 3; i++) {
        const pick = judges
          .filter((j) => !assigned.includes(j))
          .sort((a, b) => {
            const d = loadCount[a] - loadCount[b];
            if (d) return d;
            const pa = assigned.reduce((s, o) => s + (pairCount[pk(a, o)] || 0), 0);
            const pb = assigned.reduce((s, o) => s + (pairCount[pk(b, o)] || 0), 0);
            return pa - pb;
          })[0]!;
        assigned.push(pick);
        loadCount[pick]++;
        assigned.forEach((o) => {
          if (o !== pick) pairCount[pk(pick, o)] = (pairCount[pk(pick, o)] || 0) + 1;
        });
        jtMap[pick].push(team);
      }
      tmMap[team] = assigned;
      return { team, judges: assigned };
    });
    
    let rem = [...teams];
    const raw: { round: number; assignments: Assignment[] }[] = [];
    const tmp = { ...tmMap };
    
    while (rem.length) {
      const used = new Set<string>();
      const thisRound: Assignment[] = [];
      rem
        .sort((a, b) => tmp[b].length - tmp[a].length)
        .forEach((t) => {
          const avail = tmp[t].filter((j) => !used.has(j));
          if (avail.length) {
            used.add(avail[0]);
            thisRound.push({ judge: avail[0], team: t });
            tmp[t] = tmp[t].filter((j) => j !== avail[0]);
          }
        });
      raw.push({
        round: raw.length + 1,
        assignments: thisRound.sort((a, b) => +a.judge.match(/\d+/)![0] - +b.judge.match(/\d+/)![0]),
      });
      rem = rem.filter((t) => tmp[t].length);
    }
    
    const base = parseTimeToMinutes(startTime);
    const timed: Round[] = raw.map((r) => ({ ...r, time: formatMinutes(base + (r.round - 1) * 10) }));
    const payload = timed.flatMap((r) =>
      r.assignments.map((a) => ({
        round: r.round,
        judge: +a.judge.replace(/\D/g, ""),
        team: +a.team.replace(/\D/g, ""),
        startTime: r.time,
        private: false,
      }))
    );
    
    setSchedule(scheduleMap);
    setJudgeToTeams(jtMap);
    setRounds(timed);
    setBackendPayload(payload);
    setShowSchedule(true);
    setButtonState("goLive");
    setIsGenerated(true);
  }
  async function handleButtonClick() {
  if (buttonState === "goLive") {
    if (!confirm("Go live with this schedule?")) return;
    try {
      console.log("🚀 Starting Go Live...");
      
      // Step 1: Delete ALL existing records (ignore 404 errors)
      const { data: existing } = await judgeClient.get<Row[]>("/rounds");
      console.log(`🗑️ Deleting ${existing.length} existing records...`);
      
      for (const record of existing) {
        try {
          await judgeClient.delete(`rounds/${record.id}`);
        } catch (err: any) {
          // Ignore 404 errors (record already deleted)
          if (err.response?.status !== 404) {
            throw err; // Re-throw other errors
          }
        }
      }
      console.log("✅ All records deleted");
      
      // Step 2: Post new schedule
      console.log("📝 Posting new schedule...");
      const publicPayload = backendPayload.map(r => ({ 
        ...r, 
        private: false,
        inUse: true
      }));
      
      for (const record of publicPayload) {
        await judgeClient.post<Row>("/rounds/", record);
      }
      
      console.log(`✅ Posted ${publicPayload.length} new records`);
      
      setBackendPayload(publicPayload);
      setButtonState("makePrivate");
      alert("Schedule is now live!");
      
    } catch (err) {
      console.error("❌ Failed:", err);
      alert("Failed to save schedule. Check console.");
    }
  } else {
    // Make Private
    if (!confirm("Make the schedule private?")) return;
    try {
      const { data: existing } = await judgeClient.get<Row[]>("/rounds");
      
      for (const record of existing) {
        try {
          await judgeClient.put(`/rounds/${record.id}`, {
            ...record,
            private: true,
            inUse: false
          });
        } catch (err: any) {
          if (err.response?.status !== 404) {
            throw err;
          }
        }
      }
      
      setButtonState("goLive");
      alert("Schedule is now private!");
    } catch (err) {
      console.error("❌ Failed:", err);
      alert("Failed to make private. Check console.");
    }
  }
}
  
  const btnText =
    buttonState === "goLive" ? "🚀 Go Live" : buttonState === "makePrivate" ? "🔒 Make Private" : "Generate";
  
  const btnColor =
    buttonState === "goLive"
      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/50"
      : buttonState === "makePrivate"
      ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/50"
      : "bg-gray-400 cursor-not-allowed";

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 shadow-2xl mx-auto mt-8 mb-16 p-8 rounded-2xl max-w-6xl min-h-[600px]">
      {isLoading && (
        <div className="z-50 absolute inset-0 flex justify-center items-center bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="inline-block border-4 border-white/30 border-t-white rounded-full w-20 h-20 animate-spin"></div>
              <div className="inline-block absolute inset-0 border-4 border-pink-400/30 border-b-pink-400 rounded-full w-20 h-20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <h2 className="mb-4 font-bold text-white text-3xl animate-pulse">Loading Schedule...</h2>
            <div className="bg-white/20 mb-4 rounded-full w-80 h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full h-3 transition-all duration-300 ease-out"
                style={{ width: `${loadingPercent}%` }}
              ></div>
            </div>
            <p className="bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200 font-bold text-transparent text-2xl">{loadingPercent}%</p>
          </div>
        </div>
      )}

      <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-4 rounded-xl w-14 h-14">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 font-bold text-transparent text-4xl">
            Schedule Generator
          </h2>
          <p className="text-gray-600 text-lg">Create and manage judging rounds</p>
        </div>

        <div className="bg-white/80 shadow-xl backdrop-blur-sm mb-6 p-6 border border-blue-100 rounded-2xl">
          <h3 className="flex items-center mb-4 font-bold text-gray-800 text-xl">
            <svg className="mr-2 w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Configuration
          </h3>
          
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-6">
            <div className="group">
              <label htmlFor="numJudges" className="block flex items-center mb-2 font-semibold text-gray-700 text-sm">
                <svg className="mr-1.5 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Number of Judges
              </label>
              <input
                id="numJudges"
                type="number"
                value={numJudges || ""}
                onChange={(e) => setNumJudges(+e.target.value || 0)}
                className="bg-white px-4 py-3 border-2 border-gray-200 focus:border-transparent group-hover:border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-full font-medium text-gray-900 transition-all duration-200"
                placeholder="Enter number"
              />
            </div>

            <div className="group">
              <label htmlFor="numTeams" className="block flex items-center mb-2 font-semibold text-gray-700 text-sm">
                <svg className="mr-1.5 w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Number of Teams
              </label>
              <input
                id="numTeams"
                type="number"
                value={numTeams || ""}
                onChange={(e) => setNumTeams(+e.target.value || 0)}
                className="bg-white px-4 py-3 border-2 border-gray-200 focus:border-transparent group-hover:border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-medium text-gray-900 transition-all duration-200"
                placeholder="Enter number"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateSchedule}
                className="flex justify-center items-center bg-gradient-to-r from-blue-500 hover:from-blue-600 to-indigo-600 hover:to-indigo-700 shadow-blue-500/30 shadow-lg px-6 py-3 rounded-xl w-full font-bold text-white hover:scale-105 transition-all duration-200 transform"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Schedule
              </button>
            </div>
          </div>

          <div className="group">
            <label htmlFor="startTime" className="block flex items-center mb-2 font-semibold text-gray-700 text-sm">
              <svg className="mr-1.5 w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Time
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white px-4 py-3 border-2 border-gray-200 focus:border-transparent group-hover:border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full font-medium text-gray-900 transition-all duration-200 cursor-pointer"
            >
              {Array.from({ length: 48 }, (_, i) => {
                const hour = Math.floor(i / 2) % 12 || 12;
                const minute = i % 2 === 0 ? "00" : "30";
                const period = i < 24 ? "AM" : "PM";
                const v = `${hour}:${minute} ${period}`;
                return <option key={i} value={v}>{v}</option>;
              })}
            </select>
          </div>
        </div>

        {showSchedule && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl p-6 border border-pink-200 rounded-2xl">
              <h3 className="flex items-center mb-4 font-bold text-gray-800 text-xl">
                <div className="flex justify-center items-center bg-gradient-to-br from-pink-400 to-purple-500 mr-3 rounded-lg w-8 h-8">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                Teams and Their Judges
              </h3>
              <div className="flex space-x-4 pb-4 overflow-x-auto">
                {schedule.map((e, i) => (
                  <div key={i} className="bg-white/80 shadow-md hover:shadow-lg backdrop-blur-sm p-5 border border-pink-200 rounded-xl min-w-[220px] hover:scale-105 transition-all duration-200">
                    <h4 className="flex items-center mb-3 font-bold text-gray-800 text-lg">
                      <span className="flex justify-center items-center bg-gradient-to-br from-pink-400 to-purple-500 mr-2 rounded-lg w-7 h-7 text-white text-sm">{i + 1}</span>
                      {e.team}
                    </h4>
                    <div className="space-y-2">
                      {e.judges.map((j, idx) => (
                        <div key={idx} className="flex items-center bg-pink-50 px-3 py-2 rounded-lg text-gray-700">
                          <div className="bg-pink-400 mr-2 rounded-full w-2 h-2"></div>
                          <span className="font-medium text-sm">{j}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl p-6 border border-blue-200 rounded-2xl">
              <h3 className="flex items-center mb-4 font-bold text-gray-800 text-xl">
                <div className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-500 mr-3 rounded-lg w-8 h-8">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Judges and Their Teams
              </h3>
              <div className="flex space-x-4 pb-4 overflow-x-auto">
                {Object.entries(judgeToTeams).map(([j, teams], i) => (
                  <div key={i} className="bg-white/80 shadow-md hover:shadow-lg backdrop-blur-sm p-5 border border-blue-200 rounded-xl min-w-[220px] hover:scale-105 transition-all duration-200">
                    <h4 className="flex items-center mb-3 font-bold text-gray-800 text-lg">
                      <span className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-500 mr-2 rounded-lg w-7 h-7 text-white text-sm">{i + 1}</span>
                      {j}
                    </h4>
                    <div className="space-y-2">
                      {teams.map((t, idx) => (
                        <div key={idx} className="flex items-center bg-blue-50 px-3 py-2 rounded-lg text-gray-700">
                          <div className="bg-blue-400 mr-2 rounded-full w-2 h-2"></div>
                          <span className="font-medium text-sm">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl p-6 border border-emerald-200 rounded-2xl">
              <h3 className="flex items-center mb-4 font-bold text-gray-800 text-xl">
                <div className="flex justify-center items-center bg-gradient-to-br from-emerald-400 to-teal-500 mr-3 rounded-lg w-8 h-8">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Rounds Schedule
              </h3>
              <div className="flex space-x-4 pb-4 overflow-x-auto">
                {rounds.map((r) => (
                  <div key={r.round} className="bg-white/80 shadow-md hover:shadow-lg backdrop-blur-sm p-5 border border-emerald-200 rounded-xl min-w-[320px] hover:scale-105 transition-all duration-200">
                    <div className="flex justify-between items-center mb-4 pb-3 border-emerald-200 border-b">
                      <h4 className="flex items-center font-bold text-gray-800 text-lg">
                        <span className="flex justify-center items-center bg-gradient-to-br from-emerald-400 to-teal-500 mr-2 rounded-lg w-8 h-8 text-white">{r.round}</span>
                        Round {r.round}
                      </h4>
                      <div className="flex items-center bg-emerald-100 px-3 py-1 rounded-lg text-emerald-700">
                        <svg className="mr-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-sm">{r.time}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {r.assignments.map((a, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-lg">
                          <span className="font-semibold text-blue-600 text-sm">{a.judge}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="font-semibold text-purple-600 text-sm">{a.team}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleButtonClick}
            className={`px-10 py-4 text-white text-lg font-bold rounded-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center ${btnColor}`}
            disabled={buttonState === "initial"}
          >
            {buttonState === "goLive" && (
              <svg className="mr-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )}
            {buttonState === "makePrivate" && (
              <svg className="mr-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}