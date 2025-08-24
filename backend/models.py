# SQLAlchemyの必要な要素をインポート
from sqlalchemy import Boolean, Column, Integer, String
from database import Base

# Todoデータを表すSQLAlchemyモデルクラス
class Todo(Base):
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
        """タグをリストとして取得するプロパティ"""
        # _tagsが空またはNoneの場合は空のリストを返す
        if not getattr(self, "_tags", None):
            return []
        # カンマで分割してリストにし、空の要素は除外
        return [t for t in self._tags.split(",") if t]

    @tags.setter
    def tags(self, value):
        """タグを設定するセッター（リストまたは文字列を受け付ける）"""
        # リストの場合はカンマ区切りの文字列に変換
        if isinstance(value, list):
            self._tags = ",".join([str(v).strip() for v in value if str(v).strip()])
        # 文字列の場合はそのまま使用
        elif isinstance(value, str):
            self._tags = value
        # その他の場合は空文字列
        else:
            self._tags = ""
