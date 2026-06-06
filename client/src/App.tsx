import { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import type { Task } from './components/TaskCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setTasks(data);
      setIsOfflineMode(false);
      setError(null);
    } catch (err) {
      console.warn('Backend server connection failed. Falling back to local storage sandbox.', err);
      // Fallback to local storage
      const localData = localStorage.getItem('taskflow_tasks');
      if (localData) {
        setTasks(JSON.parse(localData));
      } else {
        // Initial mock tasks for demo
        const mockTasks: Task[] = [
          { _id: '1', title: 'Learn CI/CD basics with GitHub Actions', description: 'Review the ci.yml workflow file structure', completed: true },
          { _id: '2', title: 'Implement Express Backend', description: 'Create server files, models, and integrate MongoDB', completed: false },
          { _id: '3', title: 'Run and verify tests locally', description: 'Verify npm run test is passing on client and server directories', completed: false },
        ];
        setTasks(mockTasks);
        localStorage.setItem('taskflow_tasks', JSON.stringify(mockTasks));
      }
      setIsOfflineMode(true);
      setError('Running in Local Sandbox Mode (Backend Server Offline)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  // Save to local storage when tasks change if in offline mode
  useEffect(() => {
    if (isOfflineMode) {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isOfflineMode]);

  // Add a task
  const addTask = async (title: string, description: string) => {
    const newTaskObj = { title, description, completed: false };
    if (isOfflineMode) {
      const newTask: Task = {
        ...newTaskObj,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks([newTask, ...tasks]);
    } else {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskObj),
        });
        if (!res.ok) throw new Error('Failed to create task');
        const data = await res.json();
        setTasks([data, ...tasks]);
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend server to add task');
      }
    }
  };

  // Toggle a task
  const toggleTask = async (id: string, completed: boolean) => {
    if (isOfflineMode) {
      setTasks(tasks.map((t) => (t._id === id ? { ...t, completed } : t)));
    } else {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed }),
        });
        if (!res.ok) throw new Error('Failed to update task');
        const data = await res.json();
        setTasks(tasks.map((t) => (t._id === id ? data : t)));
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend server to update task');
      }
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (isOfflineMode) {
      setTasks(tasks.filter((t) => t._id !== id));
    } else {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete task');
        setTasks(tasks.filter((t) => t._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend server to delete task');
      }
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1>TaskFlow <span>CI/CD Demo</span></h1>
        </div>
        <div className={`status-badge ${isOfflineMode ? 'offline' : 'online'}`}>
          <span className="dot"></span>
          {isOfflineMode ? 'Local Sandbox' : 'Connected to API'}
        </div>
      </header>

      {error && (
        <div className="alert-banner">
          <p>{error}</p>
          <button onClick={fetchTasks} className="retry-btn">Retry Connection</button>
        </div>
      )}

      <main className="main-content">
        <section className="form-section">
          <h2>Create New Task</h2>
          <TaskForm onAdd={addTask} />
          
          <div className="stats-panel">
            <div className="stat-card">
              <span className="stat-value">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-card completed">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </section>

        <section className="list-section">
          <h2>Your Tasks</h2>
          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Create one above to get started!</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>MERN Stack + GitHub Actions Pipeline Demonstration</p>
      </footer>
    </div>
  );
}

export default App;
