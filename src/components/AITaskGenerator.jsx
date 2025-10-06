import React, { useState } from "react";
import { geminiGenerateTasks, mockGenerateTasks } from "../utils/taskGenerator";

const AITaskGenerator = ({ onTasksGenerated }) => {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await geminiGenerateTasks(goal);
      setTasks(result);
      if (onTasksGenerated) onTasksGenerated(result);
    } catch (err) {
      setError("AI not available. Using mock generator.");
      const fallback = mockGenerateTasks(goal);
      setTasks(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-sm my-4">
      <h3 className="font-semibold text-lg mb-2">🎯 AI Task Generator</h3>

      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal..."
        className="border p-2 w-full rounded mb-3"
      />

      <button
        onClick={handleGenerate}
        disabled={!goal || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Tasks"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-3 list-disc pl-5">
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default AITaskGenerator;
