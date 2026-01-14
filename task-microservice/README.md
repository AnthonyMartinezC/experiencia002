# Task Microservice - Ejemplo Práctico

Este es un microservicio de ejemplo que demuestra la **arquitectura hexagonal** (puertos y adaptadores) de forma sencilla.

## Arquitectura

```
┌─────────────────────────────────────┐
│         HTTP Request (Adapter)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controller (Port - Entrada)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    TaskService (Domain - Núcleo)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Repository (Port - Salida)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   InMemory Storage (Adapter)        │
└─────────────────────────────────────┘
```

##  Estructura

```
task-microservice/
├── src/
│   ├── domain/          # ❤️ Corazón de la aplicación
│   │   ├── task.js              # Entidad Task
│   │   └── taskService.js       # Lógica de negocio
│   ├── ports/           # 🔌 Interfaces/Contratos
│   │   └── taskRepository.js    # Contrato del repositorio
│   ├── adapters/        # 🔧 Implementaciones
│   │   ├── inMemoryTaskRepository.js  # Base de datos en memoria
│   │   └── httpTaskController.js      # API REST
│   └── server.js        # 🚀 Servidor Express
├── package.json
└── README.md
```

## Instalación y Uso

### 1. Instalar dependencias:
```bash
cd task-microservice
npm install
```

### 2. Ejecutar el microservicio:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Pruebas con cURL

### Crear una tarea:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudiar microservicios","description":"Leer el README completo"}'
```

### Obtener todas las tareas:
```bash
curl http://localhost:3000/tasks
```

### Completar una tarea:
```bash
curl -X PATCH http://localhost:3000/tasks/[ID]/complete
```

## Capas Explicadas

### Domain (Dominio)
- **task.js**: Define qué es una tarea y sus comportamientos básicos
- **taskService.js**: Contiene las reglas de negocio (crear, completar)

### Ports (Puertos)
- **taskRepository.js**: Define el contrato para guardar/obtener tareas
- Sin implementación concreta, solo define qué métodos debe tener

### Adapters (Adaptadores)
- **inMemoryTaskRepository.js**: Implementa el puerto usando un Map en memoria
- **httpTaskController.js**: Expone las funcionalidades vía HTTP/REST

### Server
- **server.js**: Conecta todas las piezas y levanta el servidor

##  Ventajas de esta Arquitectura

1. **Independencia**: El dominio no conoce HTTP ni la base de datos
2. **Testeable**: Puedes probar el dominio sin servidor ni BD
3. **Flexible**: Cambiar de memoria a MongoDB solo requiere crear un nuevo adapter
4. **Limpia**: Responsabilidades bien separadas

##  Próximas Mejoras

- [ ] Agregar MongoDB como adapter de base de datos
- [ ] Implementar GraphQL como nuevo adapter de entrada
- [ ] Agregar validaciones más complejas
- [ ] Implementar tests unitarios
- [ ] Agregar Docker para containerización
