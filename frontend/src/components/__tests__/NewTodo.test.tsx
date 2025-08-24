import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import NewTodo from '../NewTodo'

describe('NewTodo', () => {
  const mockProps = {
    value: '',
    onChange: vi.fn(),
    tagValue: '',
    onTagChange: vi.fn(),
    onCreate: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('コンポーネントが正しくレンダリングされる', () => {
    render(<NewTodo {...mockProps} />)
    
    expect(screen.getByPlaceholderText('新しいTODOを追加')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('タグ：雑務, 仕事, プライベート')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('タイトル入力フィールドに値が表示される', () => {
    render(<NewTodo {...mockProps} value="テストタイトル" />)
    
    expect(screen.getByDisplayValue('テストタイトル')).toBeInTheDocument()
  })

  it('タグ入力フィールドに値が表示される', () => {
    render(<NewTodo {...mockProps} tagValue="work,important" />)
    
    expect(screen.getByDisplayValue('work,important')).toBeInTheDocument()
  })

  it('タイトル入力フィールドの変更でonChangeが呼ばれる', async () => {
    render(<NewTodo {...mockProps} />)
    
    const titleInput = screen.getByPlaceholderText('新しいTODOを追加')
    fireEvent.change(titleInput, { target: { value: 'テスト' } })
    
    expect(mockProps.onChange).toHaveBeenCalledWith('テスト')
  })

  it('タグ入力フィールドの変更でonTagChangeが呼ばれる', async () => {
    render(<NewTodo {...mockProps} />)
    
    const tagInput = screen.getByPlaceholderText('タグ：雑務, 仕事, プライベート')
    fireEvent.change(tagInput, { target: { value: 'work' } })
    
    expect(mockProps.onTagChange).toHaveBeenCalledWith('work')
  })

  it('追加ボタンをクリックするとonCreateが呼ばれる', () => {
    render(<NewTodo {...mockProps} />)
    
    const addButton = screen.getByRole('button', { name: '追加' })
    fireEvent.click(addButton)
    
    expect(mockProps.onCreate).toHaveBeenCalled()
  })

  it('タイトル入力フィールドでEnterキーを押すとonCreateが呼ばれる', () => {
    render(<NewTodo {...mockProps} />)
    
    const titleInput = screen.getByPlaceholderText('新しいTODOを追加')
    fireEvent.keyDown(titleInput, { key: 'Enter' })
    
    expect(mockProps.onCreate).toHaveBeenCalled()
  })

  it('タグ入力フィールドでEnterキーを押すとonCreateが呼ばれる', () => {
    render(<NewTodo {...mockProps} />)
    
    const tagInput = screen.getByPlaceholderText('タグ：雑務, 仕事, プライベート')
    fireEvent.keyDown(tagInput, { key: 'Enter' })
    
    expect(mockProps.onCreate).toHaveBeenCalled()
  })

  it('他のキーを押してもonCreateが呼ばれない', () => {
    render(<NewTodo {...mockProps} />)
    
    const titleInput = screen.getByPlaceholderText('新しいTODOを追加')
    fireEvent.keyDown(titleInput, { key: 'Tab' })
    
    expect(mockProps.onCreate).not.toHaveBeenCalled()
  })

  it('onTagChangeが未定義でもエラーにならない', () => {
    const propsWithoutTagChange = {
      ...mockProps,
      onTagChange: undefined
    }
    
    expect(() => {
      render(<NewTodo {...propsWithoutTagChange} />)
    }).not.toThrow()
  })
})
