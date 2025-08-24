# Backend Database

バックエンドのデータベース設計と操作について説明します。

## データベース構成

### 使用技術
- **SQLite**: 軽量なリレーショナルデータベース
- **SQLAlchemy**: Python ORM
- **Alembic**: データベースマイグレーション（将来的に導入予定）

### データベースファイル
```
backend/
├── todo.db          # SQLiteデータベースファイル
├── database.py      # データベース接続設定
└── models.py        # データモデル定義
```

## テーブル設計

### todos テーブル
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    tags TEXT  -- JSON形式でタグを保存
);
```

### フィールド詳細

| フィールド | 型 | 制約 | 説明 |
|------------|----|----- |------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 一意識別子 |
| title | VARCHAR(200) | NOT NULL | Todoのタイトル |
| completed | BOOLEAN | DEFAULT FALSE | 完了状態 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新日時 |
| tags | TEXT | NULL | タグ（JSON配列形式） |

## SQLAlchemy モデル

### Todo モデル
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    tags = Column(Text)  # JSON string
```

## データベース接続

### 接続設定
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./todo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

### セッション管理
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## CRUD 操作

### Create (作成)
```python
def create_todo(db: Session, todo: TodoCreate):
    db_todo = Todo(
        title=todo.title,
        tags=json.dumps(todo.tags) if todo.tags else None
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo
```

### Read (読み取り)
```python
def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Todo).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()
```

### Update (更新)
```python
def update_todo(db: Session, todo_id: int, todo: TodoUpdate):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        if todo.title is not None:
            db_todo.title = todo.title
        if todo.completed is not None:
            db_todo.completed = todo.completed
        if todo.tags is not None:
            db_todo.tags = json.dumps(todo.tags)
        db_todo.updated_at = func.now()
        db.commit()
        db.refresh(db_todo)
    return db_todo
```

### Delete (削除)
```python
def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo
```

## クエリ最適化

### インデックス
```sql
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at);
```

### 検索クエリ
```python
def search_todos(db: Session, query: str):
    return db.query(Todo).filter(
        Todo.title.contains(query) | 
        Todo.tags.contains(query)
    ).all()
```

## データベース初期化

### テーブル作成
```python
from .database import engine
from . import models

def create_tables():
    models.Base.metadata.create_all(bind=engine)
```

### 初期データ投入
```python
def seed_database():
    db = SessionLocal()
    try:
        # サンプルデータの作成
        sample_todos = [
            Todo(title="Learn FastAPI", tags='["python", "api"]'),
            Todo(title="Build Todo App", tags='["react", "typescript"]'),
            Todo(title="Write Documentation", tags='["docs"]', completed=True)
        ]
        
        for todo in sample_todos:
            db.add(todo)
        
        db.commit()
    finally:
        db.close()
```

## バックアップとリストア

### バックアップ
```bash
cp todo.db todo_backup_$(date +%Y%m%d_%H%M%S).db
```

### リストア
```bash
cp todo_backup_YYYYMMDD_HHMMSS.db todo.db
```

## セキュリティ考慮事項

### SQLインジェクション対策
- SQLAlchemy ORMによるパラメータ化クエリ
- 入力値のサニタイゼーション

### データ検証
- Pydanticスキーマによる入力検証
- 型チェックとバリデーション

## パフォーマンス監視

### クエリパフォーマンス
```python
import time
import logging

def log_query_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logging.info(f"{func.__name__} took {end_time - start_time:.2f}s")
        return result
    return wrapper
```

データベースの詳細な実装については `backend/database.py` と `backend/models.py` を参照してください。
