# Quick Start

This guide will help you get the Todo app running in under 5 minutes.

## One-Command Setup

For development, you can use these commands:

```bash
# Terminal 1: Backend
cd backend && pip install -r requirements.txt && python main.py

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
```

## First Steps

Once both servers are running:

1. **Open the app**: Navigate to `http://localhost:5173`
2. **Create your first todo**: Click the "Add Todo" button
3. **Explore features**: Try filtering, searching, and marking todos as complete

## API Access

The backend API is available at `http://localhost:8000`:

- **API Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

## Development Tools

### Frontend Development
```bash
# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

### Backend Development
```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Database migration
python database.py
```

## Next Steps

- Read the [Architecture Guide](../frontend/architecture.md)
- Check out the [API Documentation](../backend/api.md)
- Learn about [Testing](../frontend/testing.md)
