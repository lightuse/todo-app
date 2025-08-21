import type { ChangeEvent, KeyboardEvent } from 'react';
import type { Todo } from '../types/todo';

type Props = {
  todo: Todo;
  editingId: number | null;
  editingTitle: string;
  setEditingTitle: (v: string) => void;
  startEdit: (t: Todo) => void;
  finishEdit: () => void;
  onToggle: (t: Todo) => void;
  onDelete: (id: number) => void;
  onTagClick?: (tag: string) => void;
};

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
