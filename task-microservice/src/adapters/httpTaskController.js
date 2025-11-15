// src/adapters/httpTaskController.js
class HttpTaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  async handleCreateTask(req, res) {
    try {
      const { title, description } = req.body;
      const task = await this.taskService.createTask(title, description);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async handleGetAllTasks(req, res) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleCompleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await this.taskService.completeTask(id);
      res.status(200).json(task);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = HttpTaskController;
