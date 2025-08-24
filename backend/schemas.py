"""
Pydanticスキーマモジュール。

このモジュールはTodo APIのリクエスト・レスポンススキーマを定義します。
Pydanticを使用してデータ検証とシリアライゼーションを自動化します。
"""

from pydantic import BaseModel, Field
from typing import List

class TodoBase(BaseModel):
    """
    Todoの基本スキーマクラス。
    
    Todo項目の共通フィールドを定義します。
    他のTodoスキーマクラスの基底クラスとして使用されます。
    
    Attributes:
        title (str): Todo項目のタイトル
        completed (bool): Todo項目の完了状態
        tags (list[str]): Todo項目に関連付けられたタグのリスト
    """
    title: str = Field(
        ...,
        description="Todo項目のタイトル",
        min_length=1,
        max_length=200,
        example="プロジェクトの仕様書を作成する"
    )
    completed: bool = Field(
        default=False,
        description="Todo項目の完了状態"
    )
    tags: List[str] = Field(
        default=[],
        description="Todo項目に関連付けられたタグのリスト",
        example=["work", "urgent", "documentation"]
    )

class TodoCreate(TodoBase):
    """
    Todo作成時に使用するスキーマ。
    
    新しいTodo項目を作成する際のリクエストボディのバリデーションに使用されます。
    現在はTodoBaseクラスと同じフィールドを持ちます。
    
    Example:
        >>> todo_data = TodoCreate(
        ...     title="新しいタスク",
        ...     completed=False,
        ...     tags=["personal", "hobby"]
        ... )
    """
    pass  # 現在は基本スキーマと同じフィールドを使用

class Todo(TodoBase):
    """
    APIレスポンス用のTodoスキーマ。
    
    データベースから取得したTodo項目をAPIレスポンスとして
    クライアントに送信する際に使用されます。
    
    Attributes:
        id (int): Todo項目の一意識別子（データベースで自動生成）
    
    Example:
        >>> todo = Todo(
        ...     id=1,
        ...     title="完了したタスク",
        ...     completed=True,
        ...     tags=["done", "project"]
        ... )
    """
    id: int = Field(
        ...,
        description="Todo項目の一意識別子",
        example=1
    )

    class Config:
        """Pydantic設定クラス。"""
        # SQLAlchemyモデルからPydanticモデルに変換することを許可
        from_attributes = True
        
        # JSONスキーマの例を設定
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "APIドキュメントを更新する",
                "completed": False,
                "tags": ["documentation", "api", "urgent"]
            }
        }