import type { ChangeEvent, KeyboardEvent } from 'react';
import type { Todo } from '../types/todo';

/**
 * TodoItemコンポーネントのプロパティ型定義
 * @interface Props
 */
type Props = {
  /** 表示するTodoアイテム */
  todo: Todo;
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
 * 個別のTodoアイテムを表示するコンポーネント
 * @param props - TodoItemコンポーネントのプロパティ
 * @returns JSX.Element
 * @description Todoの表示、編集、完了状態の切り替え、削除機能を提供
 */
export default function TodoItem({ todo, editingId, editingTitle, setEditingTitle, startEdit, finishEdit, onToggle, onDelete, onTagClick }: Props) {
  const isEditing = editingId === todo.id;
  return (
    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="checkbox-wrap">
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle({ ...todo, completed: !todo.completed })} />
        <span className="checkmark" />
      </label>

      <div className="todo-body" onDoubleClick={() => startEdit(todo)}>
        {isEditing ? (
          <input
            className="edit-input"
            value={editingTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') finishEdit(); if (e.key === 'Escape') { /* parent will cancel */ } }}
            autoFocus
          />
        ) : (
          <div>
            <span className="title">{todo.title}</span>
            <div className="tags">
              {(todo.tags || []).map((tag, i) => (
                <button key={i} className="tag" onClick={() => { if (onTagClick) onTagClick(tag); }}>{tag}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn small" onClick={() => startEdit(todo)}>編集</button>
        <button className="btn danger small" onClick={() => { if (confirm('Delete this todo?')) onDelete(todo.id); }}>削除</button>
      </div>
    </li>
  );
}
