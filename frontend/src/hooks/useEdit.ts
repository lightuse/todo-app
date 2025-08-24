import { useState } from 'react';
import type { Todo } from '../types/todo';

/**
 * Todoアイテムのインライン編集機能を提供するカスタムフック
 * @param todos - Todoアイテムの配列
 * @param updateTodo - Todoを更新する関数
 * @returns 編集状態と操作関数を含むオブジェクト
 */
export function useEdit(todos: Todo[], updateTodo: (todo: Todo) => Promise<void>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  /**
   * 指定されたTodoの編集を開始する
   * @param todo - 編集を開始するTodoアイテム
   * @description 編集モードに入り、現在のタイトルを編集フィールドに設定
   */
  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  /**
   * 編集を完了し、変更を保存する
   * @description タイトルが空でない場合のみ更新を実行し、編集モードを終了
   */
  async function finishEdit() {
    if (editingId == null) return;
    
    const title = editingTitle.trim();
    if (!title) {
      setEditingId(null);
      setEditingTitle('');
      return;
    }
    
    const existing = todos.find((t: Todo) => t.id === editingId);
    if (!existing) {
      // 編集中にTodoが削除された場合は編集モードを終了
      setEditingId(null);
      setEditingTitle('');
      return;
    }
    
    await updateTodo({ 
      id: editingId, 
      title, 
      completed: existing.completed, 
      tags: existing.tags ?? [] 
    });
    
    setEditingId(null);
    setEditingTitle('');
  }

  /**
   * 編集をキャンセルし、変更を破棄する
   * @description 編集モードを終了し、変更を保存せずに元の状態に戻す
   */
  function cancelEdit() {
    setEditingId(null);
    setEditingTitle('');
  }

  return {
    /** 現在編集中のTodoアイテムのID（編集中でない場合はnull） */
    editingId,
    /** 編集中のタイトル */
    editingTitle,
    /** 編集中のタイトルを設定する関数 */
    setEditingTitle,
    /** 編集を開始する関数 */
    startEdit,
    /** 編集を完了する関数 */
    finishEdit,
    /** 編集をキャンセルする関数 */
    cancelEdit,
  };
}
