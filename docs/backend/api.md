# API Reference

The Todo App backend provides a RESTful API for managing todos.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. This may change in future versions.

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:00:00Z"
}
```

### Todos

#### Get All Todos

**GET** `/todos`

Retrieve all todos.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Learn FastAPI",
    "description": "Study FastAPI documentation",
    "completed": false,
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z"
  }
]
```

#### Create Todo

**POST** `/todos`

Create a new todo.

**Request Body:**
```json
{
  "title": "New Todo",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "New Todo",
  "description": "Optional description",
  "completed": false,
  "created_at": "2025-01-20T10:05:00Z",
  "updated_at": "2025-01-20T10:05:00Z"
}
```

#### Update Todo

**PUT** `/todos/{todo_id}`

Update an existing todo.

**Request Body:**
```json
{
  "title": "Updated Todo",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Todo

**DELETE** `/todos/{todo_id}`

Delete a todo by ID.

**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

## Error Responses

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

**Error Format:**
```json
{
  "detail": "Error message here"
}
```

## Interactive Documentation

Visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.
