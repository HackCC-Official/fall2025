import PanelLayout from "../layout"

export default function JudgesEditorPage() {
  return (
    <JudgeEditor />
  )
}

JudgesEditorPage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>

// src/pages/manage-judges.tsx
import { useState, useEffect } from "react";
import { judgeClient } from "@/api/judge-client";

type RoundRow = { judge: number };
type Judge    = { id: number; judgeId: number; name: string; inUse: boolean };

export function JudgeEditor() {
  const [rounds, setRounds]   = useState<RoundRow[]>([]);
  const [judges, setJudges]   = useState<Judge[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Derived data
  const neededIds   = Array.from(new Set(rounds.map((r) => r.judge))).sort((a,b)=>a-b);
  const totalNeeded = neededIds.length;
  const configured  = judges.filter((j) => j.inUse && j.name.trim().length > 0);
  const leftToAdd   = totalNeeded - configured.length;
  const pctFilled   = totalNeeded ? (configured.length / totalNeeded) * 100 : 0;

  // Fetch both rounds & judges
  async function fetchData() {
    try {
      const [ rRes, jRes ] = await Promise.all([
        judgeClient.get<RoundRow[]>('rounds'),
        judgeClient.get<Judge[]>('judges?inUse=true')
      ]);
      setRounds(rRes.data);
      setJudges(jRes.data);
    } catch (e) {
      console.error(e);
      alert("Unable to load data.");
    }
  }
  useEffect(() => { fetchData() }, []);

  // Add a new judge
  async function handleAdd() {
    if (!newName.trim() || leftToAdd <= 0) return;
    const used  = new Set(configured.map((j) => j.judgeId));
    const next  = neededIds.find((id) => !used.has(id));
    if (!next) return;
    try {
      await judgeClient.post("/judges", {
        judgeId: next,
        name: newName.trim(),
        inUse: true,
      });
      setNewName("");
      fetchData();
    } catch {
      alert("Failed to add judge.");
    }
  }

  // Remove single judge
  async function handleRemove(j: Judge) {
    if (!confirm(`Remove judge "${j.name}"?`)) return;
    try {
      await judgeClient.delete(`/judges/${j.id}`);
      fetchData();
    } catch {
      alert("Failed to remove judge.");
    }
  }

  // Remove all judges
  async function handleRemoveAll() {
    if (!confirm("Remove ALL configured judges?")) return;
    try {
      await Promise.all(
        configured.map((j) =>
          judgeClient.delete(`/judges/${j.id}`)
        )
      );
      fetchData();
    } catch {
      alert("Failed to remove all judges.");
    }
  }

  // Save edited name
  async function handleSave(j: Judge) {
    if (!editingName.trim()) return;
    try {
      await judgeClient.put(`/judges/${j.id}`, {
        name: editingName.trim(),
        inUse: j.inUse,
      });
      setEditingId(null);
      fetchData();
    } catch {
      alert("Failed to update name.");
    }
  }

  return (
    <div className="bg-gray-100 py-10 min-h-screen">
      <div className="space-y-8 mx-auto p-6 max-w-4xl">
        <h1 className="flex justify-between items-center font-bold text-gray-800 text-4xl">
          Manage Judges
          <button
            onClick={handleRemoveAll}
            disabled={configured.length === 0}
            className={`ml-4 px-4 py-2 font-semibold rounded text-white transition ${
              configured.length > 0
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Remove All
          </button>
        </h1>

        {/* Summary & Progress */}
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center space-y-4 sm:space-y-0 bg-white shadow p-5 rounded-lg">
          <div className="space-y-1 text-gray-800">
            <p>Total Needed: <strong>{totalNeeded}</strong></p>
            <p>Configured:   <strong>{configured.length}</strong></p>
            <p>Left to Add:  <strong className="text-blue-600">{leftToAdd}</strong></p>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="bg-gray-200 rounded-full w-full h-3 overflow-hidden">
              <div
                className="bg-green-500 rounded-full h-3 transition-all"
                style={{ width: `${pctFilled}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Judge */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="mb-2 font-medium text-gray-800 text-2xl">Add a New Judge</h2>
          <p className="mb-4 text-gray-600 text-sm">
            Format: <code>FirstName + first letter of LastName</code> (e.g. <strong>JaneD</strong>)
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. JohnD"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            <button
              onClick={handleAdd}
              disabled={leftToAdd <= 0 || !newName.trim()}
              className={`px-6 py-2 font-semibold rounded text-white transition ${
                leftToAdd > 0 && newName.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Add Judge
            </button>
          </div>
        </div>

        {/* Configured Judges */}
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {configured.map((j) => (
            <div
              key={j.id}
              className="bg-white shadow hover:shadow-xl p-5 rounded-lg transition hover:-translate-y-1 transform"
            >
              {editingId === j.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 w-full text-gray-800"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave(j)}
                      className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-800 text-xl">{j.name}</h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Judge ID: <strong>{j.judgeId}</strong>
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(j.id);
                        setEditingName(j.name);
                      }}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(j)}
                      className="flex-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
