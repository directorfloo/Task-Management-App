import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import {
  useGetTasksQuery,
  useLazySearchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleCompleteMutation,
  useDeleteTaskMutation,
} from "../api/task.jsx";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const WEIGHT = { LOW: 1, MEDIUM: 2, HIGH: 3 };

function PriorityMark({ priority }) {
  const level = WEIGHT[priority] || 1;
  return (
    <span className="priority-mark" title={priority} aria-label={`Priority: ${priority}`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`priority-bar ${n <= level ? "filled" : ""}`} />
      ))}
    </span>
  );
}

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isNew, setIsNew] = useState(false);
  const [formError, setFormError] = useState("");

  // The list endpoint (TaskResponse) has no `completed` field — the backend only
  // reveals completion state via the toggle-complete response. We track any
  // toggles made this session locally and overlay them on the list.
  const [completedOverrides, setCompletedOverrides] = useState({});

  const { data: allTasks, refetch } = useGetTasksQuery();
  const [triggerSearch, { data: searchResults }] = useLazySearchTasksQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const [toggleComplete] = useToggleCompleteMutation();
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    if (search.trim()) {
      triggerSearch(search.trim());
    }
  }, [search, triggerSearch]);

  const rawTasks = search.trim() ? searchResults : allTasks;
  const tasks = Array.isArray(rawTasks) ? rawTasks : [];

  useEffect(() => {
    if (selected) {
      const fresh = tasks.find((t) => t.taskId === selected.taskId);
      if (fresh) setSelected(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks, searchResults]);

  const openTask = (task) => {
    setSelected(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "MEDIUM");
    setIsNew(false);
    setFormError("");
  };

  const newTask = () => {
    setSelected(null);
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setIsNew(true);
    setFormError("");
  };

  const saveTask = async () => {
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    setFormError("");

    try {
      if (isNew) {
        await createTask({ title: title.trim(), description, priority }).unwrap();
        setIsNew(false);
      } else if (selected) {
        await updateTask({
          taskId: selected.taskId,
          title: title.trim(),
          description,
          priority,
        }).unwrap();
      }
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || "Could not save this task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const result = await toggleComplete({ taskId: task.taskId, title: task.title }).unwrap();
      setCompletedOverrides((prev) => ({ ...prev, [task.taskId]: result.completed }));
    } catch {
      // silently ignore — refetch will resync on next list load
    }
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    setSelected(null);
    setIsNew(false);
    setTitle("");
    setDescription("");
    refetch();
  };

  return (
    <div className="page">
      <Header />
      <div className="notes-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">All Tasks</span>
            <button onClick={newTask} className="new-btn" aria-label="New task">
              +
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />
          <div className="notes-list">
            {tasks.map((task) => {
              const done = completedOverrides[task.taskId];
              return (
                <div
                  key={task.taskId}
                  onClick={() => openTask(task)}
                  className={`note-item ${selected?.taskId === task.taskId ? "active" : ""} ${
                    done ? "task-done" : ""
                  }`}
                >
                  <div className="note-item-top">
                    <div className="note-item-title">{task.title}</div>
                    <PriorityMark priority={task.priority} />
                  </div>
                  <div className="note-item-preview">
                    {(task.description || "No description").slice(0, 70)}
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && (
              <p className="empty-list">
                {search.trim() ? "No tasks match your search." : "No tasks yet."}
              </p>
            )}
          </div>
        </aside>

        <main className="editor">
          {selected || isNew ? (
            <>
              <div className="editor-header">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="title-input"
                />
                <div className="editor-actions">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="priority-select"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button onClick={saveTask} className="save-btn" disabled={creating || updating}>
                    {creating || updating ? "Saving…" : "Save"}
                  </button>
                  {selected && (
                    <>
                      <button onClick={() => handleToggle(selected)} className="toggle-btn">
                        {completedOverrides[selected.taskId] ? "Mark incomplete" : "Mark complete"}
                      </button>
                      <button
                        onClick={() => handleDelete(selected.taskId)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              {formError && <div className="form-error">{formError}</div>}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this task…"
                className="content-area"
              />
            </>
          ) : (
            <div className="empty-editor">
              <p>Select a task or create a new one</p>
              <button onClick={newTask} className="new-btn-lg">
                + New Task
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
