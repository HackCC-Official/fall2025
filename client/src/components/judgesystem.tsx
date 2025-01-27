import { useState, useEffect } from "react";
import axios from "axios";


export default function EditJudgeBlocks() {
  const [numJudges, setNumJudges] = useState(0);
  const [numTeams, setNumTeams] = useState(0);
  const [schedule, setSchedule] = useState<{ team: string; judges: string[] }[]>([]);
  const [judgeToTeams, setJudgeToTeams] = useState<Record<string, string[]>>({});
  const [rounds, setRounds] = useState<{ round: number; assignments: { judge: string; team: string }[] }[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
 const [startTime, setStartTime] = useState("12:00 AM");
  const [buttonState, setButtonState] = useState("initial");

  function generateSchedule() {
    if (numJudges < 3) {
      alert("Please ensure the number of judges is at least 3 to assign unique judges to each team.");
      return;
    }
    if (numTeams === 0 || numJudges === 0) {
      alert("Please enter valid numbers for judges and teams.");
      return;
    }

    const judges = Array.from({ length: numJudges }, (_, i) => `Judge ${i + 1}`);
    const teams = Array.from({ length: numTeams }, (_, i) => `Team ${i + 1}`);
    const assignments: Record<string, number> = Object.fromEntries(judges.map((judge) => [judge, 0]));
    const judgePairs: Record<string, number> = {};
    const judgeTeamsMap: Record<string, string[]> = Object.fromEntries(judges.map((judge) => [judge, []]));
    const teamJudgesMap: Record<string, string[]> = Object.fromEntries(teams.map((team) => [team, []]));

    function getPairKey(judge1: string, judge2: string): string {
      return [judge1, judge2].sort().join("-");
    }

    const generatedSchedule: { team: string; judges: string[] }[] = teams.map((team) => {
      const assignedJudges: string[] = [];
      const sortedJudges = judges.slice().sort((a, b) => assignments[a] - assignments[b]);

      for (let i = 0; i < 3; i++) {
        const availableJudges = sortedJudges.filter((judge) => !assignedJudges.includes(judge));

        availableJudges.sort((a, b) => {
          const aPairScore = assignedJudges.reduce((sum, assigned) => sum + (judgePairs[getPairKey(a, assigned)] || 0), 0);
          const bPairScore = assignedJudges.reduce((sum, assigned) => sum + (judgePairs[getPairKey(b, assigned)] || 0), 0);
          return aPairScore - bPairScore;
        });

        const judge = availableJudges[0];
        assignedJudges.push(judge);
        assignments[judge]++;

        assignedJudges.forEach((otherJudge) => {
          if (judge !== otherJudge) {
            const pairKey = getPairKey(judge, otherJudge);
            judgePairs[pairKey] = (judgePairs[pairKey] || 0) + 1;
          }
        });

        judgeTeamsMap[judge].push(team);
      }

      teamJudgesMap[team] = assignedJudges;
      return { team, judges: assignedJudges };
    });

    const rounds: { round: number; assignments: { judge: string; team: string }[] }[] = [];
    let remainingTeams = [...teams];

    while (remainingTeams.some((team) => teamJudgesMap[team].length > 0)) {
      const currentRound: { judge: string; team: string }[] = [];
      const usedJudges = new Set<string>();

      remainingTeams.sort((a, b) => teamJudgesMap[b].length - teamJudgesMap[a].length);

      for (const team of remainingTeams) {
        const availableJudges = teamJudgesMap[team].filter((judge) => !usedJudges.has(judge));
        if (availableJudges.length > 0) {
          const judge = availableJudges[0];
          currentRound.push({ judge, team });
          usedJudges.add(judge);
          teamJudgesMap[team] = teamJudgesMap[team].filter((j) => j !== judge);
        }
      }

      remainingTeams = remainingTeams.filter((team) => teamJudgesMap[team].length > 0);
      rounds.push({
        round: rounds.length + 1,
        assignments: currentRound.sort((a, b) => {
          const judgeANumber = parseInt(a.judge.match(/\d+/)?.[0] || "0", 10);
          const judgeBNumber = parseInt(b.judge.match(/\d+/)?.[0] || "0", 10);
          return judgeANumber - judgeBNumber;
        }),
      });
    }

    setSchedule(generatedSchedule);
    setJudgeToTeams(judgeTeamsMap);
    setRounds(rounds);
    setShowSchedule(true);
    setButtonState("goLive");
  }

  function calculateRoundTimes(start : string) {
    const [time, meridiem] = start.split(" ");
    let [hour, minute] = time.split(":").map(Number);
  
    // Adjust hour based on AM/PM
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
  
    const roundDurations = rounds.map((round, index) => {
      const formattedTime = `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${
        hour < 12 ? "AM" : "PM"
      }`;
  
      minute += 10; // Increment by 10 minutes for each round
      if (minute >= 60) {
        minute -= 60;
        hour += 1;
      }
  
      return {
        ...round,
        time: formattedTime,
      };
    });
  
    return roundDurations;
  }
  
  function handleButtonClick() {
    if (buttonState === "goLive") {
      if (confirm("Are you sure?")) {
        // Prepare data for the backend in ResponseRoundDTO format
        const updatedRounds = calculateRoundTimes(startTime); // Get rounds with updated times
        const scheduleData = updatedRounds.map((round) => ({
          round: round.round,
          assignments: JSON.stringify(round.assignments),
          startTime: round.time,
        }));
        // Log the data before saving
        console.log("Data to be sent to the backend:", scheduleData);
  
        // Send the JSON data to the backend
        axios
          .post("http://localhost:5001/rounds", scheduleData)
          .then((response) => {
            console.log("Schedule saved successfully:", response.data);
            setButtonState("makePrivate");
          })
          .catch((error) => {
            console.error("Error saving schedule:", error);
            alert("Failed to save the schedule. Please try again.");
          });
      }
    } else if (buttonState === "makePrivate") {
      if (confirm("Are you sure you want to make the schedule private?")) {
        // Send a nil value (or equivalent empty payload) to the backend
        axios
          .post("http://localhost:5001/rounds", null)
          .then((response) => {
            console.log("Schedule successfully marked as private:", response.data);
  
            // Clear local states
            setSchedule([]);
            setRounds([]);
            setShowSchedule(false);
            setButtonState("initial");
          })
          .catch((error) => {
            console.error("Error making schedule private:", error);
            alert("Failed to make the schedule private. Please try again.");
          });
      }
    }
  }
  


  

  const buttonText =
    buttonState === "goLive"
      ? "Go Live"
      : buttonState === "makePrivate"
      ? "Make Private"
      : "Generate Schedule First";

  const buttonColor =
    buttonState === "goLive"
      ? "bg-green-500 hover:bg-green-600"
      : buttonState === "makePrivate"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-gray-400 cursor-not-allowed";

  const scheduledRounds = calculateRoundTimes(startTime);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto mt-8">
      <div className="flex justify-between mb-6">
        <div className="flex flex-col w-1/3">
          <label htmlFor="numJudges" className="mb-2 text-gray-700 font-medium">
            Num of Judges
          </label>
          <input
            id="numJudges"
            type="number"
            value={numJudges || ""}
            onChange={(e) => setNumJudges(Number(e.target.value) || 0)}
            className="px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter number"
          />
        </div>
        <div className="flex flex-col w-1/3">
          <label htmlFor="numTeams" className="mb-2 text-gray-700 font-medium">
            Num of Teams
          </label>
          <input
            id="numTeams"
            type="number"
            value={numTeams || ""}
            onChange={(e) => setNumTeams(Number(e.target.value) || 0)}
            className="px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter number"
          />
        </div>
        <button
          onClick={generateSchedule}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 self-end"
        >
          Create
        </button>
      </div>

      {showSchedule && (
        <>
          <div className="flex flex-col mb-6">
            <label htmlFor="startTime" className="mb-2 text-gray-700 font-medium">
              Select Start Time
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {Array.from({ length: 48 }, (_, i) => {
                const hour = Math.floor(i / 2) % 12 || 12;
                const minute = i % 2 === 0 ? "00" : "30";
                const period = i < 24 ? "AM" : "PM";
                return (
                  <option key={i} value={`${hour}:${minute} ${period}`}>
                    {`${hour}:${minute} ${period}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Teams and Their Judges</h3>
            <div className="flex flex-row space-x-4 overflow-x-auto">
              {schedule.map((entry, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-md shadow min-w-[200px]">
                  <h4 className="text-md font-bold text-gray-700">{entry.team}</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    {entry.judges.map((judge, judgeIndex) => (
                      <li key={judgeIndex}>{judge}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Judges and Their Teams</h3>
            <div className="flex flex-row space-x-4 overflow-x-auto">
              {Object.entries(judgeToTeams).map(([judge, teams], index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-md shadow min-w-[200px]">
                  <h4 className="text-md font-bold text-gray-700">{judge}</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    {teams.map((team, teamIndex) => (
                      <li key={teamIndex}>{team}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Rounds Schedule</h3>
            <div className="flex space-x-4 overflow-x-auto">
              {scheduledRounds.map((round) => (
                <div
                  key={round.round}
                  className="min-w-[300px] bg-gray-100 p-4 rounded-md shadow-md"
                >
                  <h4 className="text-md font-bold text-gray-700 mb-2">
                    Round {round.round} - {round.time}
                  </h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    {round.assignments.map((assignment, index) => (
                      <li key={index}>
                        {assignment.judge} → {assignment.team}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleButtonClick}
          className={`px-6 py-2 text-white font-medium rounded-md ${buttonColor}`}
          disabled={buttonState === "initial"}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
