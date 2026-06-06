import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import type { Task } from './TaskCard';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    _id: 'task-1',
    title: 'Test task title',
    description: 'Test task description',
    completed: false,
  };

  it('renders task details correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Test task title')).toBeInTheDocument();
    expect(screen.getByText('Test task description')).toBeInTheDocument();
  });

  it('calls onToggle handler when checked', () => {
    const handleToggle = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onToggle={handleToggle}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByLabelText('Toggle status for Test task title');
    fireEvent.click(checkbox);
    
    expect(handleToggle).toHaveBeenCalledWith('task-1', true);
  });

  it('calls onDelete handler when delete button clicked', () => {
    const handleDelete = vi.fn();
    render(
      <TaskCard
        task={mockTask}
        onToggle={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByLabelText('Delete task Test task title');
    fireEvent.click(deleteBtn);
    
    expect(handleDelete).toHaveBeenCalledWith('task-1');
  });
});
