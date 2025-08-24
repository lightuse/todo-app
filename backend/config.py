"""
Configuration settings for Todo App backend.

This module centralizes all configuration settings and environment variables
used throughout the application.
"""

import os
from dotenv import load_dotenv

# .envファイルから環境変数を読み込み
load_dotenv()

class Settings:
    """Application settings class."""
    
    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./todo.db")
    
    # デバッグモード設定
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes", "on")
    
    # CORS設定
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",  # React app
        "http://localhost:5173",  # Vite dev server
        "https://todo-app-client-5tvd.onrender.com",  # Production
    ]
    
    # サーバー設定
    HOST: str = os.getenv("HOST", "localhost")
    PORT: int = int(os.getenv("PORT", "8000"))

# グローバル設定インスタンス
settings = Settings()
