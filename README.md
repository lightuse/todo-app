# 📝 Modern Todo Application

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-19.1.1-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

フルスタックなタグベースTodoアプリケーション。モダンなフロントエンド技術とパフォーマンス重視のバックエンドAPIで構築されています。

## 🎯 プロジェクト概要

このプロジェクトは、実用的なTodoアプリケーションを通じて、モダンなフルスタック開発のベストプラクティスを実装したサンプルアプリケーションです。

### 主な特徴

- ✨ **モダンなUI/UX**: React 19 + TypeScript による型安全な開発
- 🏷️ **タグベース管理**: フレキシブルなタグシステムによる分類・フィルタリング
- 🔍 **リアルタイム検索**: タイトル・タグによる高速検索機能
- ♿ **完全アクセシビリティ対応**: ARIA準拠、キーボードナビゲーション対応
- 📱 **レスポンシブデザイン**: モバイル・デスクトップ両対応
- ⚡ **高性能API**: FastAPI による高速なRESTful API
- 🎨 **ダークテーマ**: 洗練されたデザインシステム

## 🛠️ 技術スタック

### フロントエンド
| 技術 | バージョン | 用途 |
|------|------------|------|
| **React** | 19.1.1 | UIライブラリ |
| **TypeScript** | 5.8 | 型安全性 |
| **Vite** | 7.1.3 | ビルドツール・開発サーバー |
| **pnpm** | Latest | パッケージマネージャー |
| **Vitest** | 3.2.4 | テストフレームワーク |
| **ESLint** | 9.33.0 | コード品質管理 |

### バックエンド
| 技術 | 用途 |
|------|------|
| **FastAPI** | 高性能WebAPIフレームワーク |
| **SQLAlchemy** | ORM・データベース操作 |
| **SQLite** | 軽量データベース |
| **Uvicorn** | ASGIサーバー |
| **Pydantic** | データバリデーション |

### 開発ツール
- **VS Code**: 推奨エディタ
- **REST Client**: API テスト
- **WSL2**: Windows開発環境

## 🚀 クイックスタート

### 前提条件
- Node.js 18+ 
- Python 3.10+
- pnpm（推奨）

### 1. リポジトリのクローン
```bash
git clone <your-repo-url>
cd todo-app
```

### 2. バックエンドのセットアップ
```bash
# バックエンドディレクトリへ移動
cd backend

# 仮想環境の作成と有効化
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係のインストール
pip install -r requirements.txt

# サーバーの起動
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. フロントエンドのセットアップ
```bash
# フロントエンドディレクトリへ移動（新しいターミナルで）
cd frontend

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev
```

### 4. アプリケーションにアクセス
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

## 📱 主な機能

### コア機能
- ✅ **Todo管理**: 作成・編集・削除・完了状態切り替え
- 🏷️ **タグシステム**: カンマ区切りタグによる柔軟な分類
- 🔍 **検索・フィルタ**: タイトル・タグ・完了状態による絞り込み
- 📝 **インライン編集**: クリックで即座に編集モード

### UX機能
- ⚡ **オプティミスティック更新**: レスポンシブなUI体験
- 🎯 **デモデータ**: ワンクリックでサンプルデータ生成
- 🧹 **一括操作**: 全削除・一括完了機能
- 💾 **自動保存**: 変更は即座にサーバーに同期

### アクセシビリティ機能
- ♿ **スクリーンリーダー対応**: ARIA属性完備
- ⌨️ **キーボードナビゲーション**: 全機能がキーボードから操作可能
- 🎯 **フォーカス管理**: 明確なフォーカス表示
- 📢 **操作フィードバック**: 状況に応じた音声読み上げ

## 🏗️ プロジェクト構造

```
todo-app/
├── backend/                    # FastAPI バックエンド
│   ├── main.py                # メインAPIアプリケーション
│   ├── models.py              # SQLAlchemy データモデル
│   ├── schemas.py             # Pydantic スキーマ
│   ├── database.py            # データベース設定
│   ├── requirements.txt       # Python依存関係
│   └── README.md              # バックエンド詳細ドキュメント
├── frontend/                  # React フロントエンド
│   ├── src/
│   │   ├── components/        # Reactコンポーネント
│   │   ├── hooks/             # カスタムフック
│   │   ├── services/          # API通信
│   │   ├── types/             # TypeScript型定義
│   │   ├── utils/             # ユーティリティ関数
│   │   └── __tests__/         # テストファイル
│   ├── package.json           # フロントエンド依存関係
│   ├── README.md              # フロントエンド詳細ドキュメント
│   └── TESTING.md             # テスト仕様書
├── client/                    # API テストファイル
├── docs/                      # プロジェクトドキュメント
└── README.md                  # このファイル
```

## 🔧 開発ガイド

### 開発用コマンド

#### フロントエンド
```bash
cd frontend

# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# プレビュー（本番ビルドのプレビュー）
pnpm run preview

# テスト実行
pnpm run test

# テスト（UI モード）
pnpm run test:ui

# テストカバレッジ
pnpm run test:coverage

# Linter
pnpm run lint
```

#### バックエンド
```bash
cd backend

# 開発サーバー（ホットリロード）
python -m uvicorn main:app --reload

# 本番環境での起動
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### API エンドポイント

| Method | Endpoint | 説明 |
|--------|----------|------|
| `GET` | `/api/todos` | Todo一覧取得（タグフィルタリング対応） |
| `POST` | `/api/todos` | 新しいTodo作成 |
| `PUT` | `/api/todos/{id}` | Todo更新 |
| `DELETE` | `/api/todos/{id}` | Todo削除 |
| `DELETE` | `/api/todos` | 全Todo削除 |
| `POST` | `/api/demo` | デモデータ作成 |

### テスト

このプロジェクトでは包括的なテストカバレッジを提供しています：

- **単体テスト**: コンポーネント・フック・サービス
- **統合テスト**: API通信・状態管理
- **アクセシビリティテスト**: ARIA属性・キーボードナビゲーション

詳細は [`frontend/TESTING.md`](./frontend/TESTING.md) を参照してください。

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: ダークブルー系統
- **アクセント**: 明るいブルー・グリーン
- **テキスト**: 高コントラスト（WCAG AA準拠）
- **背景**: ダークテーマベース

### レイアウト原則
- **グリッドシステム**: Flexbox による柔軟なレイアウト
- **レスポンシブ**: モバイルファーストアプローチ
- **スペーシング**: 8pxベースのスペーシングシステム

## ♿ アクセシビリティ

このアプリケーションは Web Content Accessibility Guidelines (WCAG) 2.1 AA レベルに準拠しています：

- **キーボードナビゲーション**: 全機能がキーボードからアクセス可能
- **スクリーンリーダー対応**: ARIA属性による情報提供
- **カラーコントラスト**: 4.5:1以上のコントラスト比
- **フォーカス管理**: 明確なフォーカス表示

詳細は [`docs/modal-accessibility.md`](./docs/modal-accessibility.md) を参照してください。

## 🚀 デプロイメント

### Render（フロントエンド）

### Render（バックエンド）

## 📚 追加リソース

- [フロントエンド詳細ドキュメント](./frontend/README.md)
- [バックエンドAPI仕様](./backend/README.md)
- [テスト仕様書](./frontend/TESTING.md)

## 🎯 技術選択の根拠と哲学

### なぜこの技術スタックを選んだのか

このプロジェクトの技術選択は、**学習効率**、**実用性**、**将来性**の3つの軸で最適化されています。

#### **1. 開発者体験(DX)の最大化**
- **型安全性**: TypeScript + Python型ヒントによる、コンパイル時エラー検出
- **高速開発サーバー**: Viteによる瞬時のホットリロード（< 100ms）
- **自動化**: FastAPIの自動APIドキュメント生成、ESLintによるコード品質維持

#### **2. パフォーマンスとスケーラビリティ**
- **フロントエンド**: React 19の並行機能、pnpmの高速パッケージ管理
- **バックエンド**: FastAPIの非同期処理、SQLAlchemyによる効率的なクエリ
- **軽量性**: 不要な抽象化を避けたシンプルなアーキテクチャ

#### **3. 学習コストとエコシステム**
- **モダンスタンダード**: 業界標準の技術選択による転用可能性
- **充実したドキュメント**: 各技術の豊富なコミュニティサポート
- **段階的複雑化**: シンプルから始めて必要に応じて拡張可能

### 技術選択の比較検討

| 項目 | 採用技術 | 代替案 | 選択理由 |
|------|----------|---------|----------|
| **フロントエンド** | React 19 + TypeScript | Vue.js / Svelte | エコシステムの成熟度、型安全性 |
| **ビルドツール** | Vite | webpack / Parcel | 開発サーバーの高速性 |
| **状態管理** | カスタムフック | Redux / Zustand | 学習コストの低さ、適切な複雑性 |
| **バックエンド** | FastAPI | Django / Express.js | 開発速度、型安全性、性能 |
| **データベース** | SQLite | PostgreSQL / MongoDB | セットアップの簡素化、プロトタイピング効率 |
| **CSS** | カスタムCSS | Tailwind / Styled-components | 軽量性、デザイン制御 |

## 🔬 現在のプロダクトの課題と今後の展望

### **現在直面している主要課題**

#### **1. 技術的負債**
- **アーキテクチャ**: モノリシック構造による保守性の低下
- **データ設計**: タグの非正規化による柔軟性制限
- **セキュリティ**: 認証機構の欠如

#### **2. 運用面の課題**
- **監視・ログ**: エラートラッキングシステムの不備
- **テスト**: 自動テストカバレッジの不足
- **デプロイ**: CI/CDパイプラインの未整備

#### **3. ユーザー体験の制約**
- **オフライン対応**: ネットワーク断絶時の使用不可
- **パフォーマンス**: 大量データでの性能課題
- **カスタマイゼーション**: ユーザー固有の設定不足

### **段階的改善ロードマップ**

#### **Phase 1: 基盤強化（1-2ヶ月）**
```typescript
// エラーハンドリング強化
const useErrorBoundary = () => {
  return (error: Error) => {
    // 統合エラー処理システム
    trackError(error);
    showUserFriendlyMessage(error);
  };
};

// PWA対応
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### **Phase 2: アーキテクチャ改善（3-4ヶ月）**
```python
# バックエンド: レイヤー分離
# services/todo_service.py
class TodoService:
    async def create_todo_with_tags(self, user_id: int, todo_data: TodoCreate):
        async with self.db_session() as session:
            todo = await self.todo_repository.create(todo_data)
            await self.tag_service.associate_tags(todo.id, todo_data.tags)
            return todo
```

#### **Phase 3: エンタープライズ機能（6ヶ月+）**
```typescript
// マルチユーザー対応
interface CollaborativeTodo extends Todo {
  owner: User;
  collaborators: User[];
  permissions: Permission[];
}

// リアルタイム同期
const useRealtimeSync = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      updateTodoState(update);
    };
  }, []);
};
```

### **期待される改善効果**

| 指標 | 現在 | 目標（6ヶ月後） |
|------|------|-----------------|
| **開発速度** | 機能追加: 2-3日 | 機能追加: 半日 |
| **バグ発生率** | 手動テスト依存 | 自動テスト: 90%+カバレッジ |
| **ユーザー満足度** | 基本機能のみ | PWA + リアルタイム同期 |
| **セキュリティ** | 認証なし | エンタープライズレベル |
| **性能** | 小規模データのみ | 10,000+ アイテム対応 |

### **技術的な学びと知見**

#### **成功要因**
1. **段階的複雑化**: シンプルから始めて必要に応じて機能拡張
2. **型安全性の重視**: 開発時エラーの早期検出による品質向上
3. **開発者体験**: ツールチェーンの最適化による生産性向上

#### **改善すべき点**
1. **テスト駆動開発**: より早期のテスト導入が必要
2. **アーキテクチャ設計**: 初期設計での拡張性考慮不足
3. **ユーザーフィードバック**: 実ユーザーからの早期フィードバック収集

---
