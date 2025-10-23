import "./globals.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TeamsPage() {
  const [rounds, setRounds] = useState<
    { round: number; startTime: string; assignments: { judge: string; team: string }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);

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
          
          const allTeams = validRounds
            .flatMap((round) => round.assignments.map((assignment: any) => assignment.team))
            .filter((team, index, self) => self.indexOf(team) === index)
            .sort((a, b) => {
              const teamNumberA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
              const teamNumberB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
              return teamNumberA - teamNumberB;
            });
          
          setTeams(allTeams);
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">Loading Schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex justify-center items-center p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex justify-center items-center p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Schedule Yet</h2>
          <p className="text-purple-200">The judging schedule hasn't been published yet. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Team Assignments
          </h1>
          <p className="text-xl text-purple-200">Find your judging schedule below</p>
        </div>

        {/* Dropdown Card */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <label htmlFor="optionSelect" className="block text-lg font-semibold text-white mb-3">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Team
              </span>
            </label>
            <select
              id="optionSelect"
              value={selectedOption || ""}
              onChange={handleOptionChange}
              className="w-full px-5 py-4 bg-white/20 border-2 border-white/30 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-200 cursor-pointer backdrop-blur-sm hover:bg-white/25"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem'
              }}
            >
              <option value="" disabled className="bg-gray-800 text-white">
                {teams.length > 0 ? "Choose a team..." : "No teams available (Schedule not public yet)"}
              </option>
              <option value="all" className="bg-gray-800 text-white">📋 View All Rounds</option>
              {teams.map((team) => (
                <option key={team} value={team} className="bg-gray-800 text-white">
                  🎯 {team}
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
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                        {round.round}
                      </span>
                      Round {round.round}
                    </h2>
                    <div className="flex items-center text-purple-200 bg-white/10 px-4 py-2 rounded-lg">
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
                          <span className="text-pink-300 font-semibold">{assignment.judge}</span>
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-white font-bold">{assignment.team}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {teams.includes(selectedOption || "") &&
              rounds.map((round, idx) => {
                const teamAssignments = round.assignments.filter(
                  (assignment) => assignment.team === selectedOption
                );
                
                if (teamAssignments.length === 0) return null;
                
                return (
                  <div
                    key={round.round}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                          {round.round}
                        </span>
                        Round {round.round}
                      </h2>
                      <div className="flex items-center text-purple-200 bg-white/10 px-4 py-2 rounded-lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{round.startTime}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {teamAssignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-xl p-4 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                            <span className="text-purple-200 font-medium mr-2">Judge:</span>
                            <span className="text-white font-bold text-lg">{assignment.judge}</span>
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
         teams.includes(selectedOption) &&
         !rounds.some(round => round.assignments.some(a => a.team === selectedOption)) && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-purple-200 text-lg">No judging sessions scheduled for this team.</p>
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