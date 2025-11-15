// src/domain/taskService.js
const Task = require('./task');

class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(title, description) {
    const task = new Task(
      Date.now().toString(),
      title,
      description
    );

    if (!task.isValid()) {
      throw new Error('La tarea debe tener un título');
    }

    return await this.taskRepository.save(task);
  }

  async getAllTasks() {
    return await this.taskRepository.findAll();
  }

  async completeTask(id) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }
    task.complete();
    return await this.taskRepository.save(task);
  }
}

module.exports = TaskService;
