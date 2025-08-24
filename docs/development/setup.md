# Development Setup

This guide covers setting up the development environment for the Todo App.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.10+** - [Download](https://python.org/)
- **Git** - [Download](https://git-scm.com/)

## Clone and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shin/todo-app.git
   cd todo-app
   ```

2. **Backend setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   ```

## Development Commands

### Backend Development

```bash
# Start development server with auto-reload
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html
```

### Frontend Development

```bash
# Start development server
cd frontend
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Build for production
npm run build
```

## Project Structure

```
todo-app/
├── backend/           # FastAPI backend
│   ├── main.py       # Application entry point
│   ├── models.py     # Database models
│   ├── schemas.py    # Pydantic schemas
│   └── database.py   # Database connection
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom hooks
│   │   ├── services/  # API services
│   │   └── types/     # TypeScript types
│   └── public/        # Static assets
├── docs/             # Documentation
└── .github/          # GitHub Actions
```

## Database

The app uses SQLite for simplicity. The database file (`todo.db`) is created automatically.

To reset the database:
```bash
cd backend
rm todo.db
python -c "from database import create_tables; create_tables()"
```

## Environment Variables

### Backend `.env`
```env
DATABASE_URL=sqlite:///./todo.db
CORS_ORIGINS=["http://localhost:5173"]
DEBUG=True
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

## IDE Setup

### VS Code

Recommended extensions:
- Python
- Pylance
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint

### Settings

Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173  
lsof -ti:5173 | xargs kill -9
```

### Python Virtual Environment
```bash
# If venv activation fails
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues
```bash
# Clear npm cache
cd frontend
rm -rf node_modules package-lock.json
npm install
```
