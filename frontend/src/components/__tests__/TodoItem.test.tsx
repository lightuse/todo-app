import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TodoItem from '../TodoItem'
import type { Todo } from '../../types/todo'

// モックのTodoデータ
const mockTodo: Todo = {
  id: 1,
  title: 'テストTodo',
  completed: false,
  tags: ['work', 'important']
}

const mockTodoCompleted: Todo = {
  ...mockTodo,
  id: 2,
  completed: true
}

describe('TodoItem', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Todoアイテムが正しくレンダリングされる', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    expect(screen.getByText('テストTodo')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('完了済みTodoが正しくレンダリングされる', () => {
    render(<TodoItem todo={mockTodoCompleted} {...mockProps} />)
    
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByText('テストTodo')).toBeInTheDocument()
  })

  it('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    
    expect(mockProps.onToggle).toHaveBeenCalledWith({
      ...mockTodo,
      completed: true
    })
  })

  it('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)
    
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTodo.id)
  })

  it('タイトルをダブルクリックすると編集モードになる', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    const todoBody = screen.getByText('テストTodo').closest('.todo-body')
    fireEvent.doubleClick(todoBody!)
    
    expect(mockProps.startEdit).toHaveBeenCalledWith(mockTodo)
  })

  it('編集モードの時に編集用の入力フィールドが表示される', () => {
    const editingProps = {
      ...mockProps,
      editingId: mockTodo.id,
      editingTitle: '編集中のタイトル'
    }
    
    render(<TodoItem todo={mockTodo} {...editingProps} />)
    
    const input = screen.getByDisplayValue('編集中のタイトル')
    expect(input).toBeInTheDocument()
  })

  it('編集用入力フィールドでEnterキーを押すとfinishEditが呼ばれる', () => {
    const editingProps = {
      ...mockProps,
      editingId: mockTodo.id,
      editingTitle: '編集後のタイトル'
    }
    
    render(<TodoItem todo={mockTodo} {...editingProps} />)
    
    const input = screen.getByDisplayValue('編集後のタイトル')
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(mockProps.finishEdit).toHaveBeenCalled()
  })

  it('タグをクリックするとonTagClickが呼ばれる', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    const workTag = screen.getByText('work')
    fireEvent.click(workTag)
    
    expect(mockProps.onTagClick).toHaveBeenCalledWith('work')
  })

  it('タグが表示される', () => {
    render(<TodoItem todo={mockTodo} {...mockProps} />)
    
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('important')).toBeInTheDocument()
  })

  it('完了済みTodoに適切なクラスが適用される', () => {
    const { container } = render(<TodoItem todo={mockTodoCompleted} {...mockProps} />)
    
    const todoItem = container.querySelector('.todo-item')
    expect(todoItem).toHaveClass('completed')
  })
})
