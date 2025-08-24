"""
Database configuration and connection management for Todo App.

This module sets up SQLAlchemy database connection, session management,
and provides the base class for all database models.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLiteデータベースファイルのURL
# 現在のディレクトリにtodo.dbファイルを作成
SQLALCHEMY_DATABASE_URL = "sqlite:///./todo.db"
"""str: Database URL for SQLite connection."""

# データベースエンジンを作成
# check_same_thread=False: SQLiteでマルチスレッドアクセスを許可
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
"""Engine: SQLAlchemy database engine instance."""

# データベースセッションファクトリを作成
# autocommit=False: 自動コミットを無効化（明示的にコミットが必要）
# autoflush=False: 自動フラッシュを無効化（明示的にフラッシュが必要）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
"""sessionmaker: Database session factory for creating new sessions."""

# SQLAlchemyモデルの基底クラスを作成
# 全てのモデルクラスはこのBaseクラスを継承する
Base = declarative_base()
"""DeclarativeMeta: Base class for all SQLAlchemy models."""