import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTodos } from '../useTodos'

// fetch をモック化
globalThis.fetch = vi.fn()

describe('useTodos', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useTodos(''))
    
    expect(result.current.todos).toEqual([])
    expect(result.current.loading).toBe(true) // useEffectでloadTodosが呼ばれるため
    expect(result.current.error).toBeNull()
  })

  it('Todoリストが正常に読み込まれる', async () => {
    const mockTodos = [
      { id: 1, title: 'テストTodo1', completed: false, tags: ['work'] },
      { id: 2, title: 'テストTodo2', completed: true, tags: ['personal'] }
    ]

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.todos).toEqual(mockTodos)
    expect(result.current.error).toBeNull()
  })

  it('タグクエリが指定された場合に正しいURLでAPIが呼ばれる', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    renderHook(() => useTodos('work'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos?tag=work')
      )
    })
  })

  it('APIエラーが正しく処理される', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toContain('HTTP 500')
    expect(result.current.todos).toEqual([])
  })

  it('新しいTodoが正常に作成される', async () => {
    // 初期読み込み
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    // 作成API
    const newTodo = { id: 1, title: '新しいTodo', completed: false, tags: ['work'] }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => newTodo,
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.createTodo('新しいTodo', ['work'])
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '新しいTodo',
          completed: false,
          tags: ['work']
        })
      })
    )
  })

  it('空のタイトルでTodoが作成されない', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.createTodo('', ['work'])
    })

    // 初期読み込み以外でfetchが呼ばれていないことを確認
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('Todoの更新が正常に実行される', async () => {
    const initialTodos = [
      { id: 1, title: 'テストTodo', completed: false, tags: ['work'] }
    ]

    // 初期読み込み
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => initialTodos,
    } as Response)

    // 更新API
    const updatedTodo = { ...initialTodos[0], completed: true }
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTodo,
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.updateTodo(updatedTodo)
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedTodo.title,
          completed: updatedTodo.completed,
          tags: updatedTodo.tags
        })
      })
    )
  })

  it('Todoの削除が正常に実行される', async () => {
    const initialTodos = [
      { id: 1, title: 'テストTodo', completed: false, tags: ['work'] }
    ]

    // 初期読み込み
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => initialTodos,
    } as Response)

    // 削除API
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
    } as Response)

    const { result } = renderHook(() => useTodos(''))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteTodo(1)
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })
})
