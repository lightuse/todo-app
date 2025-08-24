import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import type { Todo } from '../types/todo';

/**
 * Todoアイテムの状態管理とCRUD操作を提供するカスタムフック
 * @param tagQuery - フィルタリングするタグクエリ
 * @returns Todoアイテムの状態と操作関数を含むオブジェクト
 */
export function useTodos(tagQuery: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, [tagQuery]);

  /**
   * サーバーからTodoリストを読み込む
   * @description タグクエリが指定されている場合はフィルタリングされたTodoを取得
   */
  async function loadTodos() {
    setLoading(true);
    setError(null);
    try {
      const url = tagQuery 
        ? `${API_BASE_URL}/api/todos?tag=${encodeURIComponent(tagQuery)}` 
        : `${API_BASE_URL}/api/todos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 新しいTodoアイテムを作成する
   * @param title - Todoアイテムのタイトル
   * @param tags - Todoアイテムに関連付けるタグの配列
   * @description オプティミスティック更新を使用してUIの応答性を向上
   */
  async function createTodo(title: string, tags: string[]) {
    if (!title.trim()) return;
    
    const optimistic: Todo = { 
      id: Date.now(), 
      title: title.trim(), 
      completed: false, 
      tags 
    };
    
    setTodos((prev: Todo[]) => [optimistic, ...prev]);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), completed: false, tags }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === optimistic.id ? saved : t)));
    } catch (e: any) {
      setError(e.message || 'Failed to create todo');
      setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== optimistic.id));
    }
  }

  /**
   * 既存のTodoアイテムを更新する
   * @param todo - 更新するTodoアイテム
   * @description オプティミスティック更新を使用し、失敗時は元の状態に戻す
   */
  async function updateTodo(todo: Todo) {
    const original = todos.find((t: Todo) => t.id === todo.id);
    setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === todo.id ? todo : t)));
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: todo.title, 
          completed: todo.completed, 
          tags: todo.tags ?? [] 
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === saved.id ? saved : t)));
    } catch (e: any) {
      setError(e.message || 'Failed to update todo');
      if (original) setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === original.id ? original : t)));
    }
  }

  /**
   * 指定されたTodoアイテムを削除する
   * @param id - 削除するTodoアイテムのID
   * @description オプティミスティック更新を使用し、失敗時は元の状態に戻す
   */
  async function deleteTodo(id: number) {
    const original = todos;
    setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      setError(e.message || 'Failed to delete todo');
      setTodos(original);
    }
  }

  return {
    /** Todoアイテムの配列 */
    todos,
    /** ローディング状態 */
    loading,
    /** エラーメッセージ（存在する場合） */
    error,
    /** ローディング状態を設定する関数 */
    setLoading,
    /** エラー状態を設定する関数 */
    setError,
    /** Todoリストを再読み込みする関数 */
    loadTodos,
    /** 新しいTodoを作成する関数 */
    createTodo,
    /** Todoを更新する関数 */
    updateTodo,
    /** Todoを削除する関数 */
    deleteTodo,
  };
}
