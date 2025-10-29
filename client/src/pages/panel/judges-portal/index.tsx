import PanelLayout from "../layout"

export default function JudgesEditorPage() {
  return (
    <JudgesPortal />
  )
}

JudgesEditorPage.getLayout =(page: React.ReactElement) => page

import { useState, useEffect } from "react";
import axios from "axios";
import { judgeClient } from "@/api/judge-client";
import { useAuthentication } from "@/features/auth/hooks/use-authentication";

export function JudgesPortal() {
  const [rounds, setRounds] = useState<
    { round: number; startTime: string; assignments: { judge: string; team: string }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [judges, setJudges] = useState<string[]>([]);

  useEffect(() => {
    judgeClient
      .get('/rounds')
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          // Filter for public AND in-use records only
          const publicRecords = response.data.filter((record: any) => 
            (record.private === false || record.private === 0) &&
            (record.inUse === true || record.inUse === 1)
          );

          console.log(`Filtered ${publicRecords.length} public & in-use records from ${response.data.length} total records`);

          const roundsMap: Record<number, { 
            round: number; 
            startTime: string; 
            assignments: { judge: string; team: string }[] 
          }> = {};
          
          publicRecords.forEach((record: any) => {
            if (!roundsMap[record.round]) {
              roundsMap[record.round] = {
                round: record.round,
                startTime: record.startTime,
                assignments: []
              };
            }
            roundsMap[record.round].assignments.push({
              judge: `Judge ${record.judge}`,
              team: `Team ${record.team}`
            });
          });

          const validRounds = Object.values(roundsMap).sort((a, b) => a.round - b.round);
          setRounds(validRounds);
          
          const allJudges = validRounds
            .flatMap((round) => round.assignments.map((assignment: any) => assignment.judge))
            .filter((judge, index, self) => self.indexOf(judge) === index)
            .sort((a, b) => {
              const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
              const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
              return numA - numB;
            });
          
          setJudges(allJudges);
        } else {
          throw new Error("Invalid data format from the backend.");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch rounds. Please try again later.");
        console.error("Fetch Error:", err);
        setIsLoading(false);
      });
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value || null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 min-h-screen">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="border-4 border-white border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
            <div className="absolute inset-0 border-4 border-blue-400 border-b-transparent rounded-full w-16 h-16 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 font-semibold text-white text-xl animate-pulse">Loading Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 p-6 min-h-screen">
        <div className="bg-white/10 backdrop-blur-lg p-8 border border-white/20 rounded-2xl max-w-md">
          <div className="flex justify-center items-center bg-red-500/20 mx-auto mb-4 rounded-full w-16 h-16">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium text-red-300 text-lg text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 p-6 min-h-screen">
        <div className="bg-white/10 backdrop-blur-lg p-12 border border-white/20 rounded-2xl max-w-md text-center">
          <div className="flex justify-center items-center bg-indigo-500/20 mx-auto mb-6 rounded-full w-20 h-20">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mb-3 font-bold text-white text-2xl">No Schedule Yet</h2>
          <p className="text-indigo-200">The judging schedule hasn't been published yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg mx-auto mb-4 rounded-2xl w-16 h-16">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="mb-3 font-bold text-white text-5xl tracking-tight">
            Judge Assignments
          </h1>
          <p className="text-indigo-200 text-xl">View your judging schedule and assigned teams</p>
        </div>

        {/* Dropdown Card */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/10 hover:bg-white/15 shadow-2xl backdrop-blur-lg p-6 border border-white/20 rounded-2xl transition-all duration-300">
            <label htmlFor="optionSelect" className="block mb-3 font-semibold text-white text-lg">
              <span className="flex items-center">
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Judge
              </span>
            </label>
            <select
              id="optionSelect"
              value={selectedOption || ""}
              onChange={handleOptionChange}
              className="bg-white/20 hover:bg-white/25 backdrop-blur-sm px-5 py-4 border-2 border-white/30 focus:border-blue-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 w-full font-medium text-white text-lg transition-all duration-200 cursor-pointer"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem'
              }}
            >
              <option value="" disabled className="bg-gray-800 text-white">
                {judges.length > 0 ? "Choose a judge..." : "No judges available (Schedule not public yet)"}
              </option>
              <option value="all" className="bg-gray-800 text-white">📋 View All Rounds</option>
              {judges.map((judge) => (
                <option key={judge} value={judge} className="bg-gray-800 text-white">
                  ⚖️ {judge}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rounds Display */}
        {selectedOption && (
          <div className="space-y-6">
            {selectedOption === "all" &&
              rounds.map((round, idx) => (
                <div
                  key={round.round}
                  className="bg-white/10 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-lg p-6 border border-white/20 rounded-2xl hover:scale-[1.02] transition-all animate-slide-up duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-between items-center mb-4 pb-4 border-white/20 border-b">
                    <h2 className="flex items-center font-bold text-white text-2xl">
                      <span className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg mr-3 rounded-lg w-10 h-10 text-white">
                        {round.round}
                      </span>
                      Round {round.round}
                    </h2>
                    <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg text-indigo-200">
                      <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{round.startTime}</span>
                    </div>
                  </div>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {round.assignments.map((assignment, index) => (
                      <div
                        key={index}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 border border-white/20 rounded-xl transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-300">{assignment.judge}</span>
                          <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="font-bold text-white">{assignment.team}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {judges.includes(selectedOption || "") &&
              rounds.map((round, idx) => {
                const judgeAssignments = round.assignments.filter(
                  (assignment) => assignment.judge === selectedOption
                );
                
                if (judgeAssignments.length === 0) return null;
                
                return (
                  <div
                    key={round.round}
                    className="bg-white/10 shadow-2xl hover:shadow-blue-500/20 backdrop-blur-lg p-6 border border-white/20 rounded-2xl hover:scale-[1.02] transition-all animate-slide-up duration-300"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-4 pb-4 border-white/20 border-b">
                      <h2 className="flex items-center font-bold text-white text-2xl">
                        <span className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg mr-3 rounded-lg w-10 h-10 text-white">
                          {round.round}
                        </span>
                        Round {round.round}
                      </h2>
                      <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg text-indigo-200">
                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{round.startTime}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 mb-4 p-4 border border-blue-400/30 rounded-xl">
                        <p className="mb-1 font-medium text-indigo-200 text-sm">Teams to judge:</p>
                        <p className="font-bold text-white text-2xl">{judgeAssignments.length} team{judgeAssignments.length !== 1 ? 's' : ''}</p>
                      </div>
                      {judgeAssignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-500/20 hover:from-blue-500/30 to-indigo-500/20 hover:to-indigo-500/30 p-4 border border-blue-400/30 rounded-xl transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-400 mr-3 rounded-full w-2 h-2"></div>
                            <span className="mr-2 font-medium text-indigo-200">Team:</span>
                            <span className="font-bold text-white text-lg">{assignment.team}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Empty State */}
        {selectedOption && selectedOption !== "all" && 
         judges.includes(selectedOption) &&
         !rounds.some(round => round.assignments.some(a => a.judge === selectedOption)) && (
          <div className="bg-white/10 backdrop-blur-lg p-12 border border-white/20 rounded-2xl text-center">
            <div className="flex justify-center items-center bg-indigo-500/20 mx-auto mb-6 rounded-full w-20 h-20">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-indigo-200 text-lg">No teams assigned to this judge.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
}