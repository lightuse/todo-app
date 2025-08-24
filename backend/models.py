# SQLAlchemyの必要な要素をインポート
from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Todo(Base):
    """
    Todo項目を表すSQLAlchemyモデルクラス。
    
    このクラスはデータベース内のtodosテーブルに対応し、
    Todo項目の基本的な属性（タイトル、完了状態、タグ）を管理します。
    
    Attributes:
        id (int): Todo項目の一意識別子（主キー）
        title (str): Todo項目のタイトル
        completed (bool): Todo項目の完了状態
        tags (list[str]): Todo項目に関連付けられたタグのリスト
    
    Example:
        >>> todo = Todo(title="Learn Python", completed=False)
        >>> todo.tags = ["programming", "python", "learning"]
        >>> print(todo.title)
        Learn Python
    """
    # データベーステーブル名を指定
    __tablename__ = "todos"

    # 各カラムの定義
    id = Column(Integer, primary_key=True, index=True)  # 主キー、自動インクリメント、インデックス付き
    title = Column(String, index=True)                   # Todoのタイトル、検索用インデックス付き
    completed = Column(Boolean, default=False)           # 完了フラグ、デフォルトはFalse
    
    # タグをカンマ区切り文字列としてデータベースに保存
    # プロパティとしてリストとして公開する
    _tags = Column("tags", String, default="")

    @property
    def tags(self):
        """
        タグをリストとして取得するプロパティ。
        
        データベースに保存されているカンマ区切りの文字列を
        Pythonのリストに変換して返します。
        
        Returns:
            list[str]: タグの文字列リスト。タグがない場合は空のリスト。
            
        Example:
            >>> todo = Todo(title="Test")
            >>> todo._tags = "python,fastapi,web"
            >>> print(todo.tags)
            ['python', 'fastapi', 'web']
        """
        # _tagsが空またはNoneの場合は空のリストを返す
        if not getattr(self, "_tags", None):
            return []
        # カンマで分割してリストにし、空の要素は除外
        return [t for t in self._tags.split(",") if t]

    @tags.setter
    def tags(self, value):
        """
        タグを設定するセッター。
        
        リストまたは文字列を受け取り、データベース保存用の
        カンマ区切り文字列に変換して内部的に保存します。
        
        Args:
            value (list[str] | str | None): 設定するタグ。
                - list: 文字列のリスト
                - str: カンマ区切りの文字列
                - None: 空文字列として扱う
        
        Example:
            >>> todo = Todo(title="Test")
            >>> todo.tags = ["python", "web", "api"]
            >>> print(todo._tags)
            python,web,api
            
            >>> todo.tags = "react,typescript"
            >>> print(todo.tags)
            ['react', 'typescript']
        """
        # リストの場合はカンマ区切りの文字列に変換
        if isinstance(value, list):
            self._tags = ",".join([str(v).strip() for v in value if str(v).strip()])
        # 文字列の場合はそのまま使用
        elif isinstance(value, str):
            self._tags = value
        # その他の場合は空文字列
        else:
            self._tags = ""
