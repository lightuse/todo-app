# Pydanticモデルを定義してAPIのリクエスト・レスポンスのスキーマを管理
from pydantic import BaseModel

# Todoの基本スキーマクラス（共通フィールドを定義）
class TodoBase(BaseModel):
    title: str                      # Todoのタイトル（必須）
    completed: bool = False         # 完了状態（デフォルト: False）
    tags: list[str] = []           # タグのリスト（デフォルト: 空のリスト）

# Todo作成時に使用するスキーマ（TodoBaseを継承）
class TodoCreate(TodoBase):
    pass  # 現在は基本スキーマと同じフィールドを使用

# APIレスポンス用のTodoスキーマ（データベースから取得したデータ用）
class Todo(TodoBase):
    id: int  # TodoのID（データベースで自動生成される）

    class Config:
        # SQLAlchemyモデルからPydanticモデルに変換することを許可
        from_attributes = True