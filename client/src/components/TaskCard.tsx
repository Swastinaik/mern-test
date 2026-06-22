import React from 'react';
// Test 6
export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task._id, !task.completed)}
            aria-label={`Toggle status for ${task.title}`}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-info">
          <h4>{task.title}</h4>
          {task.description && <p>{task.description}</p>}
        </div>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="delete-btn"
        aria-label={`Delete task ${task.title}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};
