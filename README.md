# Arquitectura de Microservicios - Guía Sencilla

## ¿Qué es?

Imagina que en lugar de tener un solo programa gigante (como un castillo enorme), divides tu aplicación en **pequeños programas independientes** (como casitas). Cada casita hace una cosa específica muy bien.

**Ejemplo simple:**
- Una casita se encarga de los usuarios (login, registro)
- Otra casita maneja las compras
- Otra casita procesa los pagos
- Otra casita envía correos

Cada una trabaja sola, pero se comunican entre ellas cuando lo necesitan.

---

## ¿Para qué sirve?

### Ventajas:
1. **Más fácil de arreglar** - Si una casita se rompe, las demás siguen funcionando
2. **Equipos independientes** - Diferentes grupos pueden trabajar en diferentes casitas
3. **Escalabilidad** - Si muchas personas compran, solo necesitas hacer más grande la casita de compras
4. **Tecnologías diferentes** - Una casita puede usar Python, otra Node.js, otra Java

### Desventajas:
1. Más complejo de empezar
2. Necesitas coordinar las casitas
3. Más difícil de probar todo junto

---

## Proyectos Exitosos que Usan Microservicios

### Empresas Grandes:
- **Netflix** - Cada función (reproducir video, recomendaciones, perfiles) es un microservicio
- **Uber** - Pasajeros, conductores, mapas, pagos son servicios separados
- **Amazon** - Carrito, pagos, inventario, envíos son microservicios
- **Spotify** - Música, playlists, usuarios, artistas funcionan independientemente

### Empresas Pequeñas/Medianas:
- **E-commerce básico** - Catálogo, carrito, pagos
- **App de delivery** - Restaurantes, pedidos, repartidores
- **Sistema escolar** - Estudiantes, calificaciones, asistencia
- **Blog/CMS** - Artículos, comentarios, usuarios

---

## ¿Cómo se Implementa?

### Pasos básicos:

1. **Identificar servicios** - ¿Qué hace tu app? Divide por responsabilidades
2. **Crear cada servicio** - Pequeños programas independientes
3. **Comunicación** - Los servicios hablan entre ellos (HTTP, mensajes)
4. **Base de datos** - Cada servicio puede tener su propia base de datos
5. **Despliegue** - Cada servicio vive en su propio contenedor/servidor

### Tecnologías comunes:
- **Contenedores**: Docker
- **Orquestación**: Kubernetes
- **Comunicación**: REST API, gRPC, RabbitMQ, Kafka
- **API Gateway**: NGINX, Kong

---

## Proyecto de Ejemplo: Sistema de Tareas

Vamos a crear un sistema simple de gestión de tareas usando **arquitectura hexagonal** (también llamada "puertos y adaptadores").

### Estructura del Proyecto

```
task-microservice/
├── src/
│   ├── domain/          # Lógica de negocio (núcleo)
│   │   ├── task.js
│   │   └── taskService.js
│   ├── ports/           # Interfaces (contratos)
│   │   ├── taskRepository.js
│   │   └── taskController.js
│   ├── adapters/        # Implementaciones concretas
│   │   ├── inMemoryTaskRepository.js
│   │   └── httpTaskController.js
│   └── server.js        # Punto de entrada
└── package.json
```

###  Código del Ejemplo

#### 1. Domain - La lógica central (task.js)

```javascript
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
```

#### 2. Domain Service - Reglas de negocio (taskService.js)

```javascript
// src/domain/taskService.js
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
```

#### 3. Port - Contrato del repositorio (taskRepository.js)

```javascript
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
```

#### 4. Adapter - Implementación en memoria (inMemoryTaskRepository.js)

```javascript
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
```

#### 5. Adapter - Controlador HTTP (httpTaskController.js)

```javascript
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
```

#### 6. Server - Punto de entrada (server.js)

```javascript
// src/server.js
const express = require('express');
const Task = require('./domain/task');
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Microservicio de tareas corriendo en puerto ${PORT}`);
});
```

#### 7. package.json

```json
{
  "name": "task-microservice",
  "version": "1.0.0",
  "description": "Microservicio de tareas con arquitectura hexagonal",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

##  Cómo Usar el Ejemplo

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Ejecutar el microservicio:
```bash
npm start
```

### 3. Probar con curl o Postman:

**Crear una tarea:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Hacer la tarea","description":"Matemáticas página 42"}'
```

**Ver todas las tareas:**
```bash
curl http://localhost:3000/tasks
```

**Completar una tarea:**
```bash
curl -X PATCH http://localhost:3000/tasks/[ID]/complete
```

---

##  ¿Por qué Arquitectura Hexagonal?

La arquitectura hexagonal separa tu aplicación en capas:

1. **Domain (Centro)** - Tu lógica de negocio, lo más importante
2. **Ports (Interfaces)** - Contratos que definen cómo entrar y salir
3. **Adapters (Externos)** - Implementaciones concretas (HTTP, base de datos, etc.)

**Beneficios:**
- Fácil de probar (cambias una implementación sin tocar el centro)
- Independiente de frameworks
- Puedes cambiar la base de datos sin cambiar la lógica
- Puedes cambiar de HTTP a GraphQL fácilmente

---

##  Próximos Pasos

1. Agrega más microservicios (usuarios, notificaciones)
2. Implementa comunicación entre servicios
3. Usa Docker para contenedorizar
4. Agrega una base de datos real (MongoDB, PostgreSQL)
5. Implementa un API Gateway

---

##  Conclusión

Los microservicios son como un equipo de fútbol: cada jugador tiene su posición y responsabilidad, pero todos trabajan juntos para ganar el partido. Empieza simple, aprende, y crece tu aplicación paso a paso.
