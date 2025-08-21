// React import not required with new JSX runtime
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

type Props = {
  todos: Todo[];
  editingId: number | null;
  editingTitle: string;
  setEditingTitle: (v: string) => void;
  startEdit: (t: Todo) => void;
  finishEdit: () => void;
  onToggle: (t: Todo) => void;
  onDelete: (id: number) => void;
  onTagClick?: (tag: string) => void;
};

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
