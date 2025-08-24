# API Documentation

Welcome to the Todo App API Documentation! This section provides comprehensive documentation for both the frontend TypeScript API and the backend Python API.

## 📖 Documentation Types

### TypeScript API
The frontend TypeScript API documentation is automatically generated using [TypeDoc](https://typedoc.org/) from the source code comments and type definitions.

**[📱 TypeScript API Documentation](typescript/)**

Coverage includes:
- **Types & Interfaces**: Todo data structures and type definitions
- **Services**: API communication services and HTTP client functions
- **Hooks**: React custom hooks for state management
- **Components**: React component prop interfaces
- **Utilities**: Helper functions and constants

### Python API  
The backend Python API documentation is generated using [Sphinx](https://www.sphinx-doc.org/) from docstrings in the FastAPI application code.

**[🐍 Python API Documentation (Sphinx)](python/)**

Coverage includes:
- **Models**: SQLAlchemy database models with detailed attribute documentation
- **Schemas**: Pydantic validation schemas with field descriptions and examples
- **API Endpoints**: FastAPI route handlers with parameter and response documentation
- **Database**: Connection utilities and session management
- **Type Annotations**: Complete type information for all functions and classes

## 🚀 Quick Start

### Frontend API Usage

```typescript
import { fetchTodos, createTodoApi } from './services/todoService';
import type { Todo, TodoCreate } from './types/todo';

// Fetch all todos
const todos = await fetchTodos();

// Create a new todo
const newTodo: TodoCreate = {
  title: "Learn TypeScript",
  completed: false,
  tags: ["learning"]
};
const created = await createTodoApi(newTodo);
```

### Backend API Usage

```python
from models import Todo
from schemas import TodoCreate
from database import get_db

# Create a new todo
todo_data = TodoCreate(title="Learn Python", completed=False)
db_todo = Todo(**todo_data.dict())
db.add(db_todo)
db.commit()
```

## 🔗 Interactive Documentation

For the backend API, you can also access the interactive Swagger UI documentation at:

**[🌐 Interactive API Docs](http://localhost:8000/docs)** (when running locally)

## 📚 Additional Resources

- [Frontend Architecture Guide](../frontend/architecture.md)
- [Backend API Reference](../backend/api.md)
- [Development Setup](../development/setup.md)

---

*This documentation is automatically updated with each deployment. Last generated: {{ git.date }}*
