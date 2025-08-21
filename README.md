




 pnpm install


 pnpm add vite --save-dev

 
  pnpm run dev

  python3 -m venv venv
source venv/bin/activate

## 🛠️ 開発環境セットアップ

### Python仮想環境

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt
```

uvicorn main:app --host 0.0.0.0 --port 8000