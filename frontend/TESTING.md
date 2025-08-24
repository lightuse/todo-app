# Testing Setup Documentation

このプロジェクトではVitestを使用してReactコンポーネントとフックのテストを行います。

## セットアップ

### インストール済みの依存関係
- `vitest`: テストランナー
- `@testing-library/react`: Reactコンポーネントのテスト用ユーティリティ
- `@testing-library/jest-dom`: DOM要素用のマッチャー
- `@testing-library/user-event`: ユーザーインタラクションのシミュレーション
- `jsdom`: ブラウザ環境のシミュレーション

### 設定ファイル
- `vite.config.ts`: Vitestの設定が含まれています
- `src/test/setup.ts`: グローバルなテストセットアップ（Jest DOMのインポート、モックの設定など）
- `tsconfig.app.json`: TypeScript設定にVitest型定義を追加

## テストの実行

```bash
# すべてのテストを実行
pnpm test

# テストを一度だけ実行（CI用）
pnpm test:run

# UIモードでテストを実行
pnpm test:ui

# カバレッジ付きでテストを実行
pnpm test:coverage
```

## テストファイルの構成

### 場所
- コンポーネントのテスト: `src/components/__tests__/`
- フックのテスト: `src/hooks/__tests__/`
- サービスのテスト: `src/services/__tests__/`
- その他のテスト: `src/__tests__/`

### 命名規則
- テストファイル名: `[ファイル名].test.ts(x)`

## 作成済みのテスト

### コンポーネントテスト
1. **TodoItem.test.tsx**
   - Todoアイテムのレンダリング
   - 完了状態の切り替え
   - 編集モード
   - 削除機能
   - タグクリック

2. **TodoList.test.tsx**
   - リストのレンダリング
   - 空の状態
   - 複数アイテムの表示

3. **NewTodo.test.tsx**
   - フォームのレンダリング
   - 入力フィールドの変更
   - 送信機能
   - キーボードイベント

4. **App.test.tsx**
   - アプリケーション全体のレンダリング
   - 基本的なレイアウト要素の存在確認

### フックテスト
1. **useTodos.test.ts**
   - Todo CRUD操作
   - API呼び出し
   - エラーハンドリング
   - ローディング状態

### サービステスト
1. **todoService.test.ts**
   - API呼び出し関数
   - エラーレスポンス処理
   - データ変換

### ユーティリティテスト
1. **utils.test.ts**
   - ヘルパー関数のテスト

## テストのベストプラクティス

### モック
- `fetch` APIは `globalThis.fetch = vi.fn()` でモック化
- `window.confirm` は自動的にモック化（`setup.ts`で設定）

### アサーション
- `@testing-library/jest-dom` のマッチャーを使用
- `toBeInTheDocument()`, `toHaveClass()`, `toBeChecked()` など

### 非同期テスト
- `waitFor` を使用して非同期操作の完了を待機
- `act` でReactの状態更新を適切にラップ

### ユーザーインタラクション
- `fireEvent` または `userEvent` を使用
- `fireEvent.click()`, `fireEvent.change()` など

## カバレッジ
現在のテストカバレッジ:
- 47個のテストが実行され、すべて成功
- 主要なコンポーネント、フック、サービスをカバー

## 今後の拡張
新しいコンポーネントやフックを追加する際は、対応するテストファイルも作成してください。テストファイルは同じディレクトリ構造で `__tests__` フォルダ内に配置します。
