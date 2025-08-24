// React import not required with new JSX runtime
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

/**
 * TodoListコンポーネントのプロパティ型定義
 * @interface Props
 */
type Props = {
  /** 表示するTodoアイテムの配列 */
  todos: Todo[];
  /** 現在編集中のTodoアイテムのID（編集中でない場合はnull） */
  editingId: number | null;
  /** 編集中のタイトル */
  editingTitle: string;
  /** 編集中のタイトルを設定する関数 */
  setEditingTitle: (v: string) => void;
  /** 編集を開始する関数 */
  startEdit: (t: Todo) => void;
  /** 編集を完了する関数 */
  finishEdit: () => void;
  /** Todoの完了状態を切り替える関数 */
  onToggle: (t: Todo) => void;
  /** Todoを削除する関数 */
  onDelete: (id: number) => void;
  /** タグがクリックされたときの処理関数（オプション） */
  onTagClick?: (tag: string) => void;
};

/**
 * Todoアイテムのリストを表示するコンポーネント
 * @param props - TodoListコンポーネントのプロパティ
 * @returns JSX.Element
 * @description Todoアイテムがない場合は空の状態メッセージを表示し、あります場合はTodoItemコンポーネントのリストを表示
 */
export default function TodoList({ todos, editingId, editingTitle, setEditingTitle, startEdit, finishEdit, onToggle, onDelete, onTagClick }: Props) {
  if (todos.length === 0) return <div className="empty muted">No todos</div>;
  return (
    <ul>
      {todos.map(t => (
        <TodoItem
          key={t.id}
          todo={t}
          editingId={editingId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          startEdit={startEdit}
          finishEdit={finishEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          onTagClick={onTagClick}
        />
      ))}
    </ul>
  );
}
