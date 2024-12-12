import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./App.css";

// Task interface for TypeScript
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Load tasks from local storage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return; // Prevent adding empty tasks
    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const startEditingTask = (id: number, text: string) => {
    setEditingTaskId(id);
    setEditingText(text);
  };

  const saveEditingTask = (id: number) => {
    if (editingText.trim() === "") return; // Prevent saving empty task text
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: editingText } : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="filters">
        <button
          className={classNames({ active: filter === "all" })}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={classNames({ active: filter === "completed" })}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={classNames({ active: filter === "incomplete" })}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={classNames({ completed: task.completed })}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEditingTask(task.id)}>Save</button>
                <button onClick={cancelEditingTask}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task.text}</span>
                <button onClick={() => startEditingTask(task.id, task.text)}>
                  Edit
                </button>
              </>
            )}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
