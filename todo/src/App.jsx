import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, task]);
    setTask("");
  };

  // feedback to the teachers: problem with this function is there are two or more tasks with the same string, it will delete them all
  // a good fix for this would be to assign a unique id when creating a task and using that to delete the task
  const deleteTask = (deleted) => {
    const withoutRemoved = tasks.filter((item) => item !== deleted);
    setTasks(withoutRemoved);
  };

  return (
    <div id="container">
      <h3>Todos</h3>
      <form>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
          type="text"
          placeholder="Add new task"
        />
      </form>
      <ul>
        {tasks.map((item) => (
          <li>
            {item}
            <button className="delete-button" onClick={() => deleteTask(item)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
