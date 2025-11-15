// src/adapters/inMemoryTaskRepository.js
const TaskRepository = require('../ports/taskRepository');

class InMemoryTaskRepository extends TaskRepository {
  constructor() {
    super();
    this.tasks = new Map();
  }

  async save(task) {
    this.tasks.set(task.id, task);
    return task;
  }

  async findById(id) {
    return this.tasks.get(id) || null;
  }

  async findAll() {
    return Array.from(this.tasks.values());
  }
}

module.exports = InMemoryTaskRepository;
