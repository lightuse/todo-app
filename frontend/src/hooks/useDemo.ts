import { createDemoData, deleteAllTodosApi } from '../services/todoService';

/**
 * デモデータの作成と全削除機能を提供するカスタムフック
 * @param setLoading - ローディング状態を設定する関数
 * @param setError - エラー状態を設定する関数
 * @param loadTodos - Todoリストを再読み込みする関数
 * @returns デモ関連の操作関数を含むオブジェクト
 */
export function useDemo(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  loadTodos: () => Promise<void>
) {
  /**
   * デモデータを作成する
   * @description 既存のデータを保持したままデモデータを追加し、Todoリストを再読み込み
   */
  async function handleCreateDemo() {
    setLoading(true);
    setError(null);
    try {
      await createDemoData(false); // デモデータを作成（既存データは保持）
      await loadTodos();
    } catch (e: any) {
      setError(e.message || 'Failed to create demo data');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 全てのTodoアイテムを削除する
   * @description ユーザーに確認ダイアログを表示してから全削除を実行
   */
  async function handleClearAllTodos() {
    if (!confirm('全てのTODOを削除しますか？この操作は取り消せません。')) {
      return;
    }
    
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

  return {
    /** デモデータを作成する関数 */
    handleCreateDemo,
    /** 全てのTodoを削除する関数 */
    handleClearAllTodos,
  };
}
