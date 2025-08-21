````markdown
# アプリ概要

このリポジトリはシンプルな Todo アプリケーションです。フロントエンドは Vite + React + TypeScript、バックエンドは FastAPI と SQLite を使用しており、ローカルで素早く動作を確認できるように構成

## アプリの機能

- タスクの作成、編集、削除
- タスクを完了/未完了に切り替え
- タスク一覧の表示（作成日時、状態）
- フロントエンドからの REST API による操作（FastAPI）
- ローカル永続化（SQLite：`backend/todo.db`）

## 主な技術スタック

- フロントエンド: Vite, React, TypeScript
- バックエンド: FastAPI, Uvicorn
- データベース: SQLite

## 主な機能

- TODO の作成・編集・削除
- 完了状態の切り替え
- ローカル永続化（SQLite）

下の「環境構築」セクションでローカル起動手順を説明しています。

## 環境構築

```bash
# リポジトリの frontend ディレクトリに移動
cd frontend

# 依存関係をインストール
pnpm install

# 開発サーバを起動
pnpm run dev

# 本番ビルド
pnpm run build
```

Vite のデフォルトは http://localhost:5173 です。

### バックエンド（簡易）

バックエンドは `backend` フォルダにあります。ローカルで起動する簡易手順を、WSL/Linux/macOS と Windows (PowerShell/CMD) 両方で示します。

#### WSL / Linux / macOS

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# uvicorn を venv の python 経由で起動することを推奨します（環境の python を確実に使える）
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```


補足:

- `--host 0.0.0.0` を指定すると WSL 上からホストマシンやネットワークからアクセス可能になります。ローカルのみで使う場合は `--host 127.0.0.1` で問題ありません。
- FastAPI の自動生成ドキュメントは起動後に http://localhost:8000/docs にアクセスして確認できます。
- データベースファイル `todo.db` は `backend` に含まれています。存在しない場合はアプリ起動時に自動作成される想定です（特別なマイグレーションはありません）。
