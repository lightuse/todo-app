import { useState } from 'react';
import { createDemoData, deleteAllTodosApi } from '../services/todoService';

/**
 * デモデータの作成と全削除機能を提供するカスタムフック
 * @param setLoading - ローディング状態を設定する関数
 * @param setError - エラー状態を設定する関数
 * @param loadTodos - Todoリストを再読み込みする関数
 * @returns デモ関連の操作関数と確認ダイアログの状態を含むオブジェクト
 */
export function useDemo(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  loadTodos: () => Promise<void>
) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * デモデータを作成する
   * @description 既存のデータをクリアしてから新しいデモデータを作成し、Todoリストを再読み込み
   */
  async function handleCreateDemo() {
    setLoading(true);
    setError(null);
    try {
      await createDemoData(true); // デモデータを作成（既存データをクリア）
      await loadTodos();
    } catch (e: any) {
      setError(e.message || 'Failed to create demo data');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 全て削除の確認ダイアログを表示する
   * @description ユーザーに確認ダイアログを表示
   */
  function showDeleteAllConfirmation() {
    setShowDeleteConfirm(true);
  }

  /**
   * 全てのTodoアイテムを削除する
   * @description 確認後に実際の削除処理を実行
   */
  async function confirmDeleteAllTodos() {
    setLoading(true);
    setError(null);
    try {
      await deleteAllTodosApi();
      await loadTodos();
    } catch (e: any) {
      setError(e.message || 'Failed to delete all todos');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 削除確認ダイアログを閉じる
   */
  function hideDeleteConfirm() {
    setShowDeleteConfirm(false);
  }

  return {
    /** デモデータを作成する関数（既存データをクリアしてから作成） */
    handleCreateDemo,
    /** 全て削除の確認ダイアログを表示する関数 */
    handleClearAllTodos: showDeleteAllConfirmation,
    /** 削除確認ダイアログの表示状態 */
    showDeleteConfirm,
    /** 削除確認ダイアログを閉じる関数 */
    hideDeleteConfirm,
    /** 削除を確定する関数 */
    confirmDeleteAllTodos,
  };
}
