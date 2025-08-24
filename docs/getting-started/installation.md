# Installation

## Prerequisites

Before installing the Todo app, ensure you have the following software installed:

- **Node.js** (version 18 or higher)
- **Python** (version 3.10 or higher)
- **npm** or **pnpm** package manager

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python -c "from database import create_tables; create_tables()"
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

## Environment Configuration

Create environment files for configuration:

### Backend `.env`
```env
DATABASE_URL=sqlite:///./todo.db
DEBUG=True
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

## Verification

To verify your installation:

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

You should see the Todo app running successfully!
