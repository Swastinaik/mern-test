const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');

// Mock Task model
jest.mock('../models/Task');

describe('Task API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1', description: 'Desc 1', completed: false },
        { _id: '2', title: 'Task 2', description: 'Desc 2', completed: true },
      ];

      // Mock Task.find().sort() chain
      const mockSort = jest.fn().mockResolvedValue(mockTasks);
      Task.find.mockReturnValue({
        sort: mockSort
      });

      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockTasks);
      expect(Task.find).toHaveBeenCalledTimes(1);
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const mockTaskInput = { title: 'New Task', description: 'New Desc' };
      const mockTaskSaved = { _id: '123', ...mockTaskInput, completed: false };

      // Mock save implementation
      Task.prototype.save = jest.fn().mockResolvedValue(mockTaskSaved);

      const res = await request(app)
        .post('/api/tasks')
        .send(mockTaskInput);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockTaskSaved);
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Title is required');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should toggle task completion', async () => {
      const mockTask = {
        _id: '123',
        title: 'Task Title',
        completed: false,
        save: jest.fn().mockResolvedValue({
          _id: '123',
          title: 'Task Title',
          completed: true
        })
      };

      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .patch('/api/tasks/123')
        .send({ completed: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.completed).toEqual(true);
      expect(mockTask.save).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if task not found', async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/tasks/invalid-id')
        .send({ completed: true });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const mockTask = { _id: '123', title: 'Task to Delete' };
      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndDelete.mockResolvedValue(mockTask);

      const res = await request(app).delete('/api/tasks/123');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Task deleted successfully');
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });
});
