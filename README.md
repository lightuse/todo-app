
## 環境構築

```bash
# リポジトリの frontend ディレクトリに移動
cd frontend

# 依存関係をインストール
npm install
# または pnpm を使う場合
# pnpm install

# 開発サーバを起動
npm run dev

# 本番ビルド
npm run build
```

Vite のデフォルトは http://localhost:5173 です。

### バックエンド（簡易）

バックエンドは `backend` フォルダにあります。簡易手順：

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

