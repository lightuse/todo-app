# Backend Models

バックエンドのデータモデルとスキーマ定義について説明します。

## データモデル概要

このアプリケーションは以下のデータモデルで構成されています：

### 主要モデル
- **Todo**: Todoアイテムのメインモデル
- **TodoCreate**: Todo作成用のスキーマ
- **TodoUpdate**: Todo更新用のスキーマ
- **TodoResponse**: API レスポンス用のスキーマ

## SQLAlchemy モデル

### Todo モデル (models.py)
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from .database import Base
import json

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    tags = Column(Text)  # JSON string format

    @property
    def tags_list(self):
        """タグをPythonリストとして取得"""
        if self.tags:
            try:
                return json.loads(self.tags)
            except json.JSONDecodeError:
                return []
        return []

    @tags_list.setter
    def tags_list(self, value):
        """タグをJSON文字列として保存"""
        if value:
            self.tags = json.dumps(value)
        else:
            self.tags = None

    def __repr__(self):
        return f"<Todo(id={self.id}, title='{self.title}', completed={self.completed})>"
```

### モデルプロパティ

| プロパティ | 型 | 制約 | 説明 |
|------------|----|----- |------|
| id | int | PRIMARY KEY, AUTO_INCREMENT | 一意識別子 |
| title | str | NOT NULL, MAX_LENGTH=200 | Todoのタイトル |
| completed | bool | NOT NULL, DEFAULT=False | 完了状態 |
| created_at | datetime | NOT NULL, DEFAULT=CURRENT_TIMESTAMP | 作成日時 |
| updated_at | datetime | NOT NULL, DEFAULT=CURRENT_TIMESTAMP, ON_UPDATE=CURRENT_TIMESTAMP | 更新日時 |
| tags | str | NULL | タグ（JSON文字列形式） |

## Pydantic スキーマ

### ベーススキーマ
```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class TodoBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Todoのタイトル")
    completed: bool = Field(default=False, description="完了状態")
    tags: Optional[List[str]] = Field(default=[], description="タグリスト")

    @validator('title')
    def validate_title(cls, v):
        if not v or not v.strip():
            raise ValueError('タイトルは必須です')
        return v.strip()

    @validator('tags')
    def validate_tags(cls, v):
        if v:
            # 空文字や重複を除去
            return list(set(tag.strip() for tag in v if tag.strip()))
        return []
```

### 作成用スキーマ
```python
class TodoCreate(TodoBase):
    """Todo作成用のスキーマ"""
    pass

    class Config:
        schema_extra = {
            "example": {
                "title": "新しいTodoを作成",
                "completed": False,
                "tags": ["work", "urgent"]
            }
        }
```

### 更新用スキーマ
```python
class TodoUpdate(BaseModel):
    """Todo更新用のスキーマ"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    completed: Optional[bool] = None
    tags: Optional[List[str]] = None

    @validator('title')
    def validate_title(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('タイトルが空です')
        return v.strip() if v else v

    @validator('tags')
    def validate_tags(cls, v):
        if v is not None:
            return list(set(tag.strip() for tag in v if tag.strip()))
        return v

    class Config:
        schema_extra = {
            "example": {
                "title": "更新されたタイトル",
                "completed": True,
                "tags": ["work", "completed"]
            }
        }
```

### レスポンス用スキーマ
```python
class TodoResponse(TodoBase):
    """APIレスポンス用のスキーマ"""
    id: int = Field(..., description="一意識別子")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "title": "サンプルTodo",
                "completed": false,
                "tags": ["sample", "demo"],
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
```

## バリデーション

### カスタムバリデーター
```python
from pydantic import validator
import re

class TodoCreate(TodoBase):
    @validator('title')
    def validate_title_format(cls, v):
        # 特殊文字のチェック
        if re.search(r'[<>\"\'&]', v):
            raise ValueError('タイトルに使用できない文字が含まれています')
        return v

    @validator('tags')
    def validate_tag_format(cls, v):
        if v:
            for tag in v:
                if len(tag) > 50:
                    raise ValueError('タグは50文字以内で入力してください')
                if re.search(r'[<>\"\'&]', tag):
                    raise ValueError('タグに使用できない文字が含まれています')
        return v
```

### 入力サニタイゼーション
```python
import html
from typing import List, Optional

def sanitize_string(value: str) -> str:
    """HTML特殊文字をエスケープ"""
    return html.escape(value.strip())

def sanitize_tags(tags: Optional[List[str]]) -> Optional[List[str]]:
    """タグリストのサニタイゼーション"""
    if not tags:
        return None
    return [sanitize_string(tag) for tag in tags if tag.strip()]
```

## モデル変換

### ORMモデルからPydanticスキーマへ
```python
def todo_to_response(db_todo: Todo) -> TodoResponse:
    """SQLAlchemy モデルから Pydantic スキーマへの変換"""
    return TodoResponse(
        id=db_todo.id,
        title=db_todo.title,
        completed=db_todo.completed,
        tags=db_todo.tags_list,
        created_at=db_todo.created_at,
        updated_at=db_todo.updated_at
    )
```

### 一括変換
```python
def todos_to_response_list(db_todos: List[Todo]) -> List[TodoResponse]:
    """複数のTodoを一括変換"""
    return [todo_to_response(todo) for todo in db_todos]
```

## エラーハンドリング

### カスタム例外
```python
class TodoNotFoundError(Exception):
    """Todo が見つからない場合の例外"""
    def __init__(self, todo_id: int):
        self.todo_id = todo_id
        super().__init__(f"Todo with id {todo_id} not found")

class TodoValidationError(Exception):
    """Todo バリデーションエラー"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
```

### バリデーションエラーレスポンス
```python
from pydantic import ValidationError
from fastapi import HTTPException, status

def handle_validation_error(error: ValidationError):
    """Pydantic バリデーションエラーの処理"""
    errors = []
    for err in error.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in err["loc"]),
            "message": err["msg"],
            "type": err["type"]
        })
    
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={"message": "入力値にエラーがあります", "errors": errors}
    )
```

## テストデータ

### ファクトリー関数
```python
from datetime import datetime
from typing import Optional

def create_test_todo(
    title: str = "Test Todo",
    completed: bool = False,
    tags: Optional[List[str]] = None
) -> Todo:
    """テスト用のTodoインスタンスを作成"""
    return Todo(
        title=title,
        completed=completed,
        tags=json.dumps(tags) if tags else None,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
```

### サンプルデータ
```python
SAMPLE_TODOS = [
    {"title": "Learn FastAPI", "tags": ["python", "api"]},
    {"title": "Build Todo App", "tags": ["react", "typescript"]},
    {"title": "Write Tests", "tags": ["testing", "quality"], "completed": True},
    {"title": "Deploy Application", "tags": ["deployment", "devops"]},
]
```

モデルとスキーマの詳細な実装については以下のファイルを参照してください：
- `backend/models.py`: SQLAlchemy モデル定義
- `backend/schemas.py`: Pydantic スキーマ定義
