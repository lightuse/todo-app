import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodoList from '../TodoList'
import type { Todo } from '../../types/todo'

// モックのTodoデータ
const mockTodos: Todo[] = [
  {
    id: 1,
    title: '最初のTodo',
    completed: false,
    tags: ['work']
  },
  {
    id: 2,
    title: '二番目のTodo',
    completed: true,
    tags: ['personal']
  }
]

describe('TodoList', () => {
  const mockProps = {
    editingId: null,
    editingTitle: '',
    setEditingTitle: vi.fn(),
    startEdit: vi.fn(),
    finishEdit: vi.fn(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onTagClick: vi.fn()
  }

  it('Todoがない場合に空のメッセージが表示される', () => {
    render(<TodoList todos={[]} {...mockProps} />)
    
    expect(screen.getByText('No todos')).toBeInTheDocument()
  })

  it('Todoリストが正しくレンダリングされる', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />)
    
    expect(screen.getByText('最初のTodo')).toBeInTheDocument()
    expect(screen.getByText('二番目のTodo')).toBeInTheDocument()
  })

  it('複数のTodoアイテムが表示される', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />)
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('Todoアイテムに正しいpropsが渡される', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />)
    
    // 最初のTodoが未完了であることを確認
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })
})
