import "./globals.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function JudgesPage() {
  const [rounds, setRounds] = useState<
    { round: number; startTime: string; assignments: { judge: string; team: string }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [judges, setJudges] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/rounds")
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">Loading Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-300 text-lg text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Schedule Yet</h2>
          <p className="text-indigo-200">The judging schedule hasn't been published yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Judge Assignments
          </h1>
          <p className="text-xl text-indigo-200">View your judging schedule and assigned teams</p>
        </div>

        {/* Dropdown Card */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <label htmlFor="optionSelect" className="block text-lg font-semibold text-white mb-3">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Judge
              </span>
            </label>
            <select
              id="optionSelect"
              value={selectedOption || ""}
              onChange={handleOptionChange}
              className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 cursor-pointer backdrop-blur-sm hover:bg-white/25"
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
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        {round.round}
                      </span>
                      Round {round.round}
                    </h2>
                    <div className="flex items-center text-indigo-200 bg-white/10 px-4 py-2 rounded-lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{round.startTime}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {round.assignments.map((assignment, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 font-semibold">{assignment.judge}</span>
                          <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-white font-bold">{assignment.team}</span>
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
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          {round.round}
                        </span>
                        Round {round.round}
                      </h2>
                      <div className="flex items-center text-indigo-200 bg-white/10 px-4 py-2 rounded-lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{round.startTime}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
                        <p className="text-indigo-200 text-sm font-medium mb-1">Teams to judge:</p>
                        <p className="text-white text-2xl font-bold">{judgeAssignments.length} team{judgeAssignments.length !== 1 ? 's' : ''}</p>
                      </div>
                      {judgeAssignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-xl p-4 hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                            <span className="text-indigo-200 font-medium mr-2">Team:</span>
                            <span className="text-white font-bold text-lg">{assignment.team}</span>
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
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
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