// src/domain/task.js
class Task {
  constructor(id, title, description, completed = false) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = new Date();
  }

  complete() {
    this.completed = true;
  }

  isValid() {
    return this.title && this.title.length > 0;
  }
}

module.exports = Task;
