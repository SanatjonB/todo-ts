import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  type Task = {
    text: string;
    completed: boolean;
  };

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

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
      <button
        onClick={(e) => {
          if (task.trim() === "") return;
          const newTasks = { text: task, completed: false };
          setTasks((prev) => [...prev, newTasks]);
        }}
      >
        Add
      </button>

      {/* The list here  */}
      <h3>Active Tasks</h3>
      <ul>
        {tasks.map((task_, i) => (
          <li
            key={i}
            style={{
              textDecoration: task_.completed ? "line-through" : "none",
              marginBottom: "10px",
            }}
          >
            {task_.text}
            <button
              onClick={() => {
                const completedTask = { ...tasks[i], completed: true };
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
        ))}
      </ul>
      <h3 style={{ marginTop: "30px" }}>✅ Done</h3>
      <ul>
        {doneTasks.map((task, index) => (
          <li
            key={index}
            style={{ color: "gray", textDecoration: "line-through" }}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
