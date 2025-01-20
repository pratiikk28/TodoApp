import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./footer";
import jsPDF from "jspdf";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "" || !dueDate) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, dueDate: dueDate, completed: false },
    ]);
    setNewTask("");
    setDueDate("");
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTaskStatus = (task) => {
    const currentDate = new Date();
    const taskDueDate = new Date(task.dueDate);
    if (task.completed) {
      return "Completed";
    } else if (taskDueDate < currentDate) {
      return "Incomplete (Overdue)";
    } else {
      return "Incomplete (Due: " + task.dueDate + ")";
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text("To-Do List", 14, 20);
    tasks.forEach((task, index) => {
      const yPosition = 30 + index * 10;
      doc.text(
        `${task.text} - Due: ${task.dueDate} - ${getTaskStatus(task)}`,
        14,
        yPosition
      );
    });

    doc.save("tasks.pdf");
  };

  // Count completed and incomplete tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const incompleteTasksCount = tasks.filter((task) => !task.completed).length;

  return (
    <>
      <div className="App">
        <div className="todo-app">
          <h1>To-Do App</h1>
          <p>
            Total Tasks: <b>{tasks.length}</b>
          </p>
          <div className="row">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={handleAddTask} className="addbtn">
              Add
            </button>
          </div>
          <div className="filter-btn">
            <button onClick={handleDownloadPDF} className="download-btn">
              Download PDF
            </button>
            <span className="task-counts">
              <b>Completed:</b> {completedTasksCount} | <b>Incomplete:</b>{" "}
              {incompleteTasksCount}
            </span>
          </div>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <div>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                    onClick={() => handleToggleComplete(task.id)}
                  >
                    {task.text}
                  </span>
                  <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                    - {getTaskStatus(task)}
                  </span>
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="btndlt"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
