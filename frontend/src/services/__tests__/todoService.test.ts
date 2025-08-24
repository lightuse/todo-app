import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTodos, createTodoApi, updateTodoApi, deleteTodoApi } from '../todoService'
import type { Todo, TodoCreate } from '../../types/todo'

// fetchをモック化
globalThis.fetch = vi.fn()

describe('todoService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('fetchTodos', () => {
    it('タグなしでTodoリストを取得する', async () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'テストTodo1', completed: false, tags: ['work'] },
        { id: 2, title: 'テストTodo2', completed: true, tags: ['personal'] }
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      const result = await fetchTodos()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos')
      )
      expect(result).toEqual(mockTodos)
    })

    it('タグ付きでTodoリストを取得する', async () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'ワークTodo', completed: false, tags: ['work'] }
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      } as Response)

      const result = await fetchTodos('work')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos?tag=work')
      )
      expect(result).toEqual(mockTodos)
    })

    it('APIエラーでエラーをスローする', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchTodos()).rejects.toThrow('fetchTodos HTTP 404')
    })
  })

  describe('createTodoApi', () => {
    it('新しいTodoを作成する', async () => {
      const payload: TodoCreate = {
        title: '新しいTodo',
        completed: false,
        tags: ['work', 'important']
      }

      const mockResponse: Todo = {
        id: 1,
        ...payload
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await createTodoApi(payload)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('作成時のAPIエラーでエラーをスローする', async () => {
      const payload: TodoCreate = {
        title: 'エラーTodo',
        completed: false,
        tags: []
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(createTodoApi(payload)).rejects.toThrow('createTodoApi HTTP 400')
    })
  })

  describe('updateTodoApi', () => {
    it('Todoを更新する', async () => {
      const payload: TodoCreate = {
        title: '更新されたTodo',
        completed: true,
        tags: ['updated']
      }

      const mockResponse: Todo = {
        id: 1,
        ...payload
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await updateTodoApi(1, payload)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('更新時のAPIエラーでエラーをスローする', async () => {
      const payload: TodoCreate = {
        title: 'エラーTodo',
        completed: false,
        tags: []
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(updateTodoApi(1, payload)).rejects.toThrow('updateTodoApi HTTP 500')
    })
  })

  describe('deleteTodoApi', () => {
    it('Todoを削除する', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      await deleteTodoApi(1)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })

    it('削除時のAPIエラーでエラーをスローする', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(deleteTodoApi(1)).rejects.toThrow('deleteTodoApi HTTP 404')
    })
  })
})
