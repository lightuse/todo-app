import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// APIとフックのモック
vi.mock('../hooks', () => ({
  useTodos: vi.fn(() => ({
    todos: [],
    loading: false,
    error: null,
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    loadTodos: vi.fn()
  })),
  useFilters: vi.fn(() => ({
    filteredTodos: [],
    statusFilter: 'all',
    setStatusFilter: vi.fn()
  })),
  useEdit: vi.fn(() => ({
    editingId: null,
    editingTitle: '',
    setEditingTitle: vi.fn(),
    startEdit: vi.fn(),
    finishEdit: vi.fn()
  })),
  useTodoForm: vi.fn(() => ({
    newTitle: '',
    setNewTitle: vi.fn(),
    tagValue: '',
    setTagValue: vi.fn(),
    getTagsArray: vi.fn(() => []),
    resetForm: vi.fn()
  })),
  useDemo: vi.fn(() => ({
    isDemo: false,
    startDemo: vi.fn()
  }))
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('アプリケーションが正しくレンダリングされる', () => {
    render(<App />)
    
    expect(screen.getByRole('heading', { name: 'TODO' })).toBeInTheDocument()
  })

  it('メインの要素が表示される', () => {
    render(<App />)
    
    // ヘッダーが表示される
    expect(screen.getByRole('heading', { name: 'TODO' })).toBeInTheDocument()
    
    // 新規Todo入力フォームが表示される
    expect(screen.getByPlaceholderText('新しいTODOを追加')).toBeInTheDocument()
    
    // 追加ボタンが表示される
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('空のTodoリストのメッセージが表示される', () => {
    render(<App />)
    
    expect(screen.getByText('No todos')).toBeInTheDocument()
  })

  it('レイアウト構造が正しく表示される', () => {
    const { container } = render(<App />)
    
    expect(container.querySelector('.app-root')).toBeInTheDocument()
    expect(container.querySelector('.layout-with-right')).toBeInTheDocument()
    expect(container.querySelector('.layout-main')).toBeInTheDocument()
  })
})
