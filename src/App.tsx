import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  type Task = {
    text: string;
    completed: boolean;
    dueAt: string;
  };

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [dueIn, setDueIn] = useState("20");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // force re-render every second
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
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
        Due in (seconds):{" "}
        <input
          type="number"
          placeholder="e.g. 30"
          value={dueIn}
          onChange={(e) => setDueIn(e.target.value)}
          style={{
            marginLeft: "5px",
            width: "80px",
            padding: "4px",
            fontSize: "14px",
          }}
        />
      </label>
      <button
        onClick={(e) => {
          if (task.trim() === "" || isNaN(Number(dueIn)) || Number(dueIn) <= 0)
            return;
          const newTasks = {
            text: task,
            completed: false,
            dueAt: new Date(Date.now() + Number(dueIn) * 1000).toISOString(),
          };
          setTasks((prev) => [...prev, newTasks]);
        }}
      >
        Add
      </button>

      {/* The list here  */}
      <h3>Active Tasks</h3>
      <ul>
        {tasks.map((task_, i) => {
          const isOverdue = new Date(task_.dueAt).getTime() < Date.now();

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
              {isOverdue && (
                <div style={{ color: "red", fontSize: "0.8em" }}>
                  ⚠️ Due Now!
                </div>
              )}
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
