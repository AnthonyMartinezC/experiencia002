// src/ports/taskRepository.js
class TaskRepository {
  async save(task) {
    throw new Error('Método no implementado');
  }

  async findById(id) {
    throw new Error('Método no implementado');
  }

  async findAll() {
    throw new Error('Método no implementado');
  }
}

module.exports = TaskRepository;
