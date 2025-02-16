import "./globals.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function JudgesPage() {
  const [rounds, setRounds] = useState<
    { round: number; startTime: string; assignments: { judge: string; team: string }[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // "View All Rounds" or specific judge
  const [judges, setJudges] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5007/rounds")
      .then((response) => {
        console.log("Full response object:", response);
        console.log("Parsed response data:", response.data);

        if (response.data && Array.isArray(response.data)) {
          const validRounds = response.data.map((round: any) => ({
            ...round,
            assignments: JSON.parse(round.assignments), // Parse assignments string into an array
          }));
          setRounds(validRounds);

          // Extract unique judges and sort by numerical order
          const allJudges = validRounds
            .flatMap((round) => round.assignments.map((assignment: any) => assignment.judge))
            .filter((judge, index, self) => self.indexOf(judge) === index) // Remove duplicates
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Loading round information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg text-center">No rounds available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">Judge Assignments</h1>

      {/* Dropdown Menu */}
      <div className="mb-6">
        <label htmlFor="optionSelect" className="block text-lg font-medium text-gray-700 mb-2">
          View Rounds:
        </label>
        <select
          id="optionSelect"
          value={selectedOption || ""}
          onChange={handleOptionChange}
          className="px-4 py-2 border border-gray-300 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">View All Rounds</option>
          {judges.map((judge) => (
            <option key={judge} value={judge}>
              {judge}
            </option>
          ))}
        </select>
      </div>

      {/* Display Content Based on Selection */}
      <div className="space-y-6">
        {selectedOption === "all" &&
          rounds.map((round) => (
            <div
              key={round.round}
              className="bg-white p-4 rounded-md shadow-md border border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Round {round.round} - Start Time: {round.startTime}
              </h2>
              <ul className="list-disc pl-6 text-gray-600">
                {round.assignments.map((assignment, index) => (
                  <li key={index}>
                    <strong>{assignment.judge}</strong> → {assignment.team}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {judges.includes(selectedOption || "") &&
          rounds.map((round) => {
            const judgeAssignments = round.assignments.filter(
              (assignment) => assignment.judge === selectedOption
            );
            return (
              <div
                key={round.round}
                className="bg-white p-4 rounded-md shadow-md border border-gray-200"
              >
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  Round {round.round} - Start Time: {round.startTime}
                </h2>
                {judgeAssignments.length > 0 ? (
                  <ul className="list-disc pl-6 text-gray-600">
                    {judgeAssignments.map((assignment, index) => (
                      <li key={index}>
                        <strong>Team:</strong> {assignment.team}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">This judge is not assigned to any team in this round.</p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
