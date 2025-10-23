// src/pages/manage-judges.tsx
import { useState, useEffect } from "react";
import axios from "axios";

type RoundRow = { judge: number };
type Judge    = { id: number; judgeId: number; name: string; inUse: boolean };

export default function ManageJudges() {
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
        axios.get<RoundRow[]>("http://localhost:5000/rounds"),
        axios.get<Judge[]   >("http://localhost:5000/judges?inUse=true"),
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
      await axios.post("http://localhost:5000/judges", {
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
      await axios.delete(`http://localhost:5000/judges/${j.id}`);
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
          axios.delete(`http://localhost:5000/judges/${j.id}`)
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
      await axios.put(`http://localhost:5000/judges/${j.id}`, {
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 flex justify-between items-center">
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
        <div className="bg-white p-5 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-1 text-gray-800">
            <p>Total Needed: <strong>{totalNeeded}</strong></p>
            <p>Configured:   <strong>{configured.length}</strong></p>
            <p>Left to Add:  <strong className="text-blue-600">{leftToAdd}</strong></p>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-green-500 transition-all"
                style={{ width: `${pctFilled}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Judge */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Add a New Judge</h2>
          <p className="text-sm text-gray-600 mb-4">
            Format: <code>FirstName + first letter of LastName</code> (e.g. <strong>JaneD</strong>)
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. JohnD"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {configured.map((j) => (
            <div
              key={j.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-xl transform hover:-translate-y-1 transition"
            >
              {editingId === j.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave(j)}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800">{j.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Judge ID: <strong>{j.judgeId}</strong>
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(j.id);
                        setEditingName(j.name);
                      }}
                      className="flex-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(j)}
                      className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
