import { useState, useMemo } from 'react';
import type { Todo } from '../types/todo';

/**
 * Todoリストのフィルタリング機能を提供するカスタムフック
 * @param todos - フィルタリング対象のTodoアイテムの配列
 * @returns フィルタリング状態とフィルタリング結果を含むオブジェクト
 */
export function useFilters(todos: Todo[]) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [query, setQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');

  /**
   * フィルターとクエリに基づいてTodoをフィルタリングする
   * @description 完了状態とタイトルの検索クエリでTodoをフィルタリング
   */
  const filteredTodos = useMemo(() => {
    return todos
      .filter((t: Todo) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t: Todo) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return t.title.toLowerCase().includes(q);
      });
  }, [todos, filter, query]);

  /**
   * アクティブ（未完了）なTodoの数を計算する
   * @description 完了していないTodoアイテムの総数
   */
  const activeCount = useMemo(() => {
    return todos.filter((t: Todo) => !t.completed).length;
  }, [todos]);

  return {
    /** 現在のフィルター状態 */
    filter,
    /** フィルター状態を設定する関数 */
    setFilter,
    /** 検索クエリ */
    query,
    /** 検索クエリを設定する関数 */
    setQuery,
    /** タグ検索クエリ */
    tagQuery,
    /** タグ検索クエリを設定する関数 */
    setTagQuery,
    /** フィルタリングされたTodoアイテムの配列 */
    filteredTodos,
    /** アクティブなTodoアイテムの数 */
    activeCount,
  };
}
