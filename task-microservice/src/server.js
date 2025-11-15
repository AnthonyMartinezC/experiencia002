// src/server.js
const express = require('express');
const TaskService = require('./domain/taskService');
const InMemoryTaskRepository = require('./adapters/inMemoryTaskRepository');
const HttpTaskController = require('./adapters/httpTaskController');

const app = express();
app.use(express.json());

// Inyección de dependencias
const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new HttpTaskController(taskService);

// Rutas
app.post('/tasks', (req, res) => taskController.handleCreateTask(req, res));
app.get('/tasks', (req, res) => taskController.handleGetAllTasks(req, res));
app.patch('/tasks/:id/complete', (req, res) => taskController.handleCompleteTask(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Microservicio de tareas corriendo en puerto ${PORT}`);
});
