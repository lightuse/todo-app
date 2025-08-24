# Frontend Testing

フロントエンドのテスト戦略と実装について説明します。

## テスト環境

### テストフレームワーク
- **Vitest**: 高速なテストランナー
- **Testing Library**: DOMテストユーティリティ
- **jsdom**: ブラウザ環境シミュレーション

### テスト種類

#### 1. コンポーネントテスト
```typescript
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import TodoItem from '../components/TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    tags: ['test']
  }

  test('renders todo item', () => {
    render(<TodoItem todo={mockTodo} onUpdate={vi.fn()} />)
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })
})
```

#### 2. カスタムフックテスト
```typescript
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../hooks/useTodos'

describe('useTodos', () => {
  test('adds new todo', async () => {
    const { result } = renderHook(() => useTodos())
    
    await act(async () => {
      await result.current.addTodo('New Todo', ['tag1'])
    })
    
    expect(result.current.todos).toHaveLength(1)
  })
})
```

#### 3. 統合テスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App Integration', () => {
  test('creates and displays todo', async () => {
    render(<App />)
    
    const input = screen.getByLabelText('新しいTodo')
    fireEvent.change(input, { target: { value: 'Test Todo' } })
    fireEvent.click(screen.getByText('追加'))
    
    expect(await screen.findByText('Test Todo')).toBeInTheDocument()
  })
})
```

## テスト戦略

### 1. コンポーネント設計テスト
- Props渡しの正確性
- イベントハンドリング
- 条件付きレンダリング
- アクセシビリティ

### 2. 状態管理テスト
- カスタムフックの動作
- 状態変更の副作用
- 非同期処理

### 3. ユーザーインタラクションテスト
- フォーム入力
- ボタンクリック
- キーボード操作

### 4. アクセシビリティテスト
- ARIA属性
- キーボードナビゲーション
- スクリーンリーダー対応

## 実行方法

### 基本コマンド
```bash
# テスト実行
pnpm test

# UIモードでテスト実行
pnpm test:ui

# カバレッジ付きテスト
pnpm test:coverage

# 単発テスト実行
pnpm test:run
```

### テストファイル構成
```
src/
├── __tests__/
│   ├── components/
│   │   ├── App.test.tsx
│   │   ├── TodoList.test.tsx
│   │   └── TodoItem.test.tsx
│   ├── hooks/
│   │   ├── useTodos.test.ts
│   │   └── useFilters.test.ts
│   └── integration/
│       └── app-flow.test.tsx
```

## モックとスタブ

### API モック
```typescript
import { vi } from 'vitest'

vi.mock('../services/todoService', () => ({
  getTodos: vi.fn(() => Promise.resolve([])),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn()
}))
```

### ローカルストレージモック
```typescript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})
```

## カバレッジ目標

- **Statement Coverage**: 90%以上
- **Branch Coverage**: 85%以上
- **Function Coverage**: 90%以上
- **Line Coverage**: 90%以上

## 継続的テスト

### Pre-commit Hook
```bash
# テスト実行
pnpm test:run

# Linter実行
pnpm lint
```

### CI/CD パイプライン
```yaml
- name: Run Tests
  run: pnpm test:run

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## パフォーマンステスト

### レンダリングパフォーマンス
```typescript
import { measureRender } from './test-utils'

test('renders large list efficiently', () => {
  const todos = Array.from({ length: 1000 }, (_, i) => ({
    id: String(i),
    title: `Todo ${i}`,
    completed: false,
    tags: []
  }))

  const duration = measureRender(<TodoList todos={todos} />)
  expect(duration).toBeLessThan(100) // 100ms以内
})
```

テスト実装の詳細は `frontend/TESTING.md` を参照してください。
