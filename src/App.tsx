import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  type Task = {
    text: string;
    completed: boolean;
    dueAt: string;
    priority: "low" | "medium" | "high";
  };

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [dueIn, setDueIn] = useState("1");
  const [tick, setTick] = useState(0);
  const [dueUnit, setDueUnit] = useState("days");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    const savedDone = localStorage.getItem("doneTasks");
    console.log(
      "Loading local storage of active tasks" +
        saved +
        " and done tasks " +
        doneTasks
    );
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    if (savedDone) {
      setDoneTasks(JSON.parse(savedDone));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
    }
    console.log("Saved to localStorage:", tasks);
  }, [tasks, loaded, doneTasks]);

  return (
    <div style={{ padding: "20px" }}>
      {/* title and inputs  */}
      <h2>My To-Do Lists</h2>
      <input
        type="text"
        placeholder="Type something..."
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
        }}
      />
      <label style={{ marginLeft: "10px" }}>
        Due in:
        <input
          type="number"
          value={dueIn}
          onChange={(e) => setDueIn(e.target.value)}
          style={{
            marginLeft: "5px",
            width: "60px",
            padding: "4px",
            fontSize: "14px",
          }}
        />
        <select
          value={dueUnit}
          onChange={(e) => setDueUnit(e.target.value)}
          style={{
            marginLeft: "5px",
            padding: "4px",
            fontSize: "14px",
          }}
        >
          <option value="seconds">sec</option>
          <option value="hours">hr</option>
          <option value="days">day</option>
        </select>
      </label>
      <label style={{ marginLeft: "10px" }}>
        Priority:
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
          style={{ marginLeft: "5px", padding: "4px", fontSize: "14px" }}
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </label>

      {/* Add button */}
      <button
        onClick={(e) => {
          if (task.trim() === "" || isNaN(Number(dueIn)) || Number(dueIn) <= 0)
            return;
          const unitMultipliers: Record<string, number> = {
            seconds: 1,
            hours: 3600,
            days: 86400,
          };
          const seconds =
            Number(dueIn) * unitMultipliers[dueUnit.toLowerCase()];
          const dueAt = new Date(Date.now() + seconds * 1000).toISOString();
          setTasks((prev) => [...prev, newTasks]);
          const newTasks = {
            text: task,
            completed: false,
            dueAt,
            priority,
          };
        }}
      >
        Add
      </button>

      {/* The list here  */}
      <h3>Active Tasks</h3>
      <ul>
        {tasks.map((task_, i) => {
          const isOverdue = new Date(task_.dueAt).getTime() < Date.now();
          const timeLeftMs = new Date(task_.dueAt).getTime() - Date.now();
          let timeLeftStr = "";

          if (!isOverdue) {
            const totalSec = Math.floor(timeLeftMs / 1000);
            const hr = Math.floor(totalSec / 3600);
            const min = Math.floor((totalSec % 3600) / 60);
            const sec = totalSec % 60;

            if (hr > 0) {
              timeLeftStr = `${hr} hr${hr !== 1 ? "s" : ""} ${min} min`;
            } else if (min > 0) {
              timeLeftStr = `${min} min ${sec} sec`;
            } else {
              timeLeftStr = `${sec} sec`;
            }
          }

          return (
            <li
              key={i}
              style={{
                marginBottom: "10px",
                backgroundColor: isOverdue ? "#ffcccc" : "white",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              <div>{task_.text}</div>
              {!isOverdue && (
                <div style={{ color: "#888", fontSize: ".8em" }}>
                  {timeLeftStr}
                </div>
              )}
              {isOverdue && (
                <div style={{ color: "red", fontSize: "0.8em" }}>
                  ⚠️ Due Now!
                </div>
              )}
              <div style={{ fontSize: ".8em", marginTop: "4px" }}>
                Priority:{" "}
                <span
                  style={{
                    color:
                      task_.priority === "high"
                        ? "red"
                        : task_.priority === "medium"
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {task_.priority}
                </span>
              </div>
              <button
                onClick={() => {
                  const completedTask = {
                    ...task_,
                    completed: true,
                    completedAt: new Date().toISOString(),
                  };
                  setTasks((prev) => prev.filter((_, index) => index !== i));
                  setDoneTasks((prev) => [...prev, completedTask]);
                }}
                style={{ marginLeft: "10px" }}
              >
                ✔️
              </button>
              <button
                onClick={() => {
                  const updated = [...tasks];
                  updated.splice(i, 1);
                  setTasks(updated);
                }}
                style={{ marginLeft: "5px" }}
              >
                ❌
              </button>
            </li>
          );
        })}
      </ul>
      <h3 style={{ marginTop: "30px" }}>✅ Done</h3>
      <ul>
        {doneTasks.map((task, index) => (
          <li
            key={index}
            style={{ color: "gray", textDecoration: "line-through" }}
          >
            <div>{task.text}</div>
            <button
              onClick={() => {
                const taskToUndo = doneTasks[index];
                setDoneTasks((prev) => prev.filter((_, i) => i !== index));
                setTasks((prev) => [
                  ...prev,
                  { ...taskToUndo, completed: false },
                ]);
              }}
            >
              🔄 Undo
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
