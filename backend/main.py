# 必要なライブラリをインポート
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware # CORSをインポート

# 自作モジュールをインポート
import models, schemas, database

# データベーステーブルを作成
models.Base.metadata.create_all(bind=database.engine)

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI()

# CORSミドルウェアの設定
# フロントエンドからのリクエストを許可するオリジン一覧
origins = [
    "http://localhost:3000", # Reactアプリのアドレス
    "http://localhost:5173", # Vite dev server (frontend)
    "https://todo-app-client-5tvd.onrender.com", # 本番環境のアドレス
]

# CORSミドルウェアをアプリケーションに追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # 許可するオリジン
    allow_credentials=True,       # 認証情報を含むリクエストを許可
    allow_methods=["*"],         # 全てのHTTPメソッドを許可
    allow_headers=["*"],         # 全てのHTTPヘッダーを許可
)

# データベース依存性注入用の関数
# リクエストごとにデータベースセッションを作成し、レスポンス後にクローズする
def get_db():
    db = database.SessionLocal()
    try:
        yield db  # セッションを返す
    finally:
        db.close()  # セッションをクローズ

# Todo一覧を取得するAPIエンドポイント
# パラメータ: skip=スキップ件数, limit=取得件数上限, tag=タグフィルタ
@app.get("/api/todos", response_model=List[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100, tag: str | None = None, db: Session = Depends(get_db)):
    # ベースクエリを作成
    q = db.query(models.Todo)
    
    # タグフィルタが指定された場合は、そのタグを含むTodoのみに絞り込む
    if tag:
        # tagsフィールドからLIKE検索（カンマ区切りの文字列内を検索）
        like = f"%{tag}%"
        q = q.filter(models.Todo._tags.like(like))
    
    # ページネーションを適用してTodoリストを取得
    todos = q.offset(skip).limit(limit).all()
    return todos

# 新しいTodoを作成するAPIエンドポイント
@app.post("/api/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    # リクエストデータからTodoモデルのインスタンスを作成
    db_todo = models.Todo(title=todo.title, completed=todo.completed)
    
    # タグが提供されている場合は設定
    if hasattr(todo, 'tags'):
        db_todo.tags = todo.tags
    
    # データベースに新しいTodoを追加
    db.add(db_todo)
    db.commit()          # 変更をコミット
    db.refresh(db_todo)  # 作成されたデータを再取得（IDなど）
    return db_todo

# 既存のTodoを更新するAPIエンドポイント
@app.put("/api/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    # 指定されたIDのTodoを検索
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    
    # Todoが見つからない場合は404エラーを返す
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Todoの内容を更新
    db_todo.title = todo.title
    db_todo.completed = todo.completed
    
    # タグが提供されている場合は更新
    if hasattr(todo, 'tags'):
        db_todo.tags = todo.tags
    
    # 変更をデータベースに保存
    db.commit()
    db.refresh(db_todo)  # 更新されたデータを再取得
    return db_todo

# 指定されたTodoを削除するAPIエンドポイント
@app.delete("/api/todos/{todo_id}", response_model=schemas.Todo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    # 指定されたIDのTodoを検索
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    
    # Todoが見つからない場合は404エラーを返す
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Todoをデータベースから削除
    db.delete(db_todo)
    db.commit()  # 削除をコミット
    return db_todo  # 削除されたTodoを返す


# 全てのTodoを削除するAPIエンドポイント
@app.delete("/api/todos", response_model=dict)
def delete_all_todos(db: Session = Depends(get_db)):
    """全てのTodoを削除する"""
    # 削除前のTodo件数を取得
    count = db.query(models.Todo).count()
    
    # 全てのTodoを削除
    db.query(models.Todo).delete()
    db.commit()  # 削除をコミット
    
    # 削除結果を返す
    return {"message": f"Deleted {count} todos", "count": count}


# デモデータを作成するAPIエンドポイント
@app.post("/api/demo", response_model=List[schemas.Todo])
def create_demo_data(clear: bool = False, db: Session = Depends(get_db)):
    """デモ用のTodoデータを作成する。clearがTrueの場合は既存のTodoを全て削除してから作成する"""
    
    # clearフラグがTrueの場合は既存のTodoを全て削除
    if clear:
        db.query(models.Todo).delete()
        db.commit()

    # デモ用のサンプルTodoデータ
    samples = [
        {"title": "Buy groceries", "completed": False, "tags": ["shopping", "errands"]},
        {"title": "Read a chapter", "completed": False, "tags": ["reading"]},
        {"title": "Walk the dog", "completed": True, "tags": ["pets", "health"]},
        {"title": "Call Alice", "completed": False, "tags": ["calls"]},
        {"title": "Setup project", "completed": False, "tags": ["work", "setup"]},
    ]

    # サンプルデータからTodoを作成
    created = []
    for s in samples:
        t = models.Todo(title=s["title"], completed=s["completed"])
        t.tags = s.get("tags", [])  # タグを設定（なければ空のリスト）
        db.add(t)
        created.append(t)

    # 全ての変更をコミット
    db.commit()
    
    # 作成されたTodoデータを更新（IDなどを取得するため）
    for t in created:
        db.refresh(t)

    return created  # 作成されたTodoリストを返す