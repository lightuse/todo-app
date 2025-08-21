from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware # CORSをインポート

import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORSミドルウェアの設定
origins = [
    "http://localhost:3000", # Reactアプリのアドレス
    "http://localhost:5173", # Vite dev server (frontend)
    "https://todo-app-client-5tvd.onrender.com", # 本番環境のアドレス
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/todos", response_model=List[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100, tag: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.Todo)
    if tag:
        # filter todos where tags contain the tag string (comma-separated)
        like = f"%{tag}%"
        q = q.filter(models.Todo._tags.like(like))
    todos = q.offset(skip).limit(limit).all()
    return todos

@app.post("/api/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = models.Todo(title=todo.title, completed=todo.completed)
    # set tags if provided
    if hasattr(todo, 'tags'):
        db_todo.tags = todo.tags
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/api/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    if hasattr(todo, 'tags'):
        db_todo.tags = todo.tags
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/api/todos/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return db_todo


@app.post("/api/demo", response_model=List[schemas.Todo])
def create_demo_data(clear: bool = False, db: Session = Depends(get_db)):
    """Create demo todos. If `clear` is true, delete existing todos first."""
    if clear:
        # remove all existing todos
        db.query(models.Todo).delete()
        db.commit()

    samples = [
        {"title": "Buy groceries", "completed": False, "tags": ["shopping", "errands"]},
        {"title": "Read a chapter", "completed": False, "tags": ["reading"]},
        {"title": "Walk the dog", "completed": True, "tags": ["pets", "health"]},
        {"title": "Call Alice", "completed": False, "tags": ["calls"]},
        {"title": "Setup project", "completed": False, "tags": ["work", "setup"]},
    ]

    created = []
    for s in samples:
        t = models.Todo(title=s["title"], completed=s["completed"])
        t.tags = s.get("tags", [])
        db.add(t)
        created.append(t)

    db.commit()
    for t in created:
        db.refresh(t)

    return created