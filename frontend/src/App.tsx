import { useEffect, useState } from 'react';
import { API_BASE_URL } from './config/api';
import NewTodo from './components/NewTodo';
import Controls from './components/Controls';
import RightPanel from './components/RightPanel';
import { createDemoData } from './services/todoService';
import TodoList from './components/TodoList';
import './styles/App.css';
import type { Todo } from './types/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    loadTodos();
  }, [tagQuery]);

  async function loadTodos() {
    setLoading(true);
    setError(null);
    try {
  const url = tagQuery ? `${API_BASE_URL}/api/todos?tag=${encodeURIComponent(tagQuery)}` : `${API_BASE_URL}/api/todos`;
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

  async function createTodo() {
    const title = newTitle.trim();
    if (!title) return;
  const tags = newTags.split(',').map((s: string) => s.trim()).filter(Boolean);
  const optimistic: Todo = { id: Date.now(), title, completed: false, tags };
    setTodos((prev: Todo[]) => [optimistic, ...prev]);
    setNewTitle('');
  setNewTags('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false, tags }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === optimistic.id ? saved : t)));
    } catch (e: any) {
      setError(e.message || 'Failed to create todo');
      setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== optimistic.id));
    }
  }

  async function updateTodo(todo: Todo) {
    const original = todos.find((t: Todo) => t.id === todo.id);
    setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === todo.id ? todo : t)));
  try {
      const res = await fetch(`${API_BASE_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: todo.title, completed: todo.completed, tags: todo.tags ?? [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = await res.json();
      setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === saved.id ? saved : t)));
    } catch (e: any) {
      setError(e.message || 'Failed to update todo');
      if (original) setTodos((prev: Todo[]) => prev.map((t: Todo) => (t.id === original.id ? original : t)));
    }
  }

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

  async function handleCreateDemo() {
    setLoading(true);
    setError(null);
    try {
      await createDemoData(true);
      await loadTodos();
    } catch (e: any) {
      setError(e.message || 'Failed to create demo data');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditingTitle(t.title);
  }

  async function finishEdit() {
    if (editingId == null) return;
    const title = editingTitle.trim();
    if (!title) {
      setEditingId(null);
      setEditingTitle('');
      return;
    }
  const existing = todos.find((t: Todo) => t.id === editingId)!;
  await updateTodo({ id: editingId, title, completed: existing.completed, tags: existing.tags ?? [] });
    setEditingId(null);
    setEditingTitle('');
  }

  const filtered = todos
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

  const activeCount = todos.filter((t: Todo) => !t.completed).length;

  return (
    <div className="app-root">
      <div className="layout-with-right">
        <div className="layout-main">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="top-search">
        <input
          aria-label="検索"
          placeholder="TODOタイトルを検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          aria-label="タグ検索"
          placeholder="雑務, 仕事, プライベート"
          value={tagQuery}
          onChange={(e) => setTagQuery(e.target.value)}
        />
      </div>

      <NewTodo value={newTitle} onChange={setNewTitle} tagValue={newTags} onTagChange={setNewTags} onCreate={createTodo} />

        </div>
        <RightPanel>
          <Controls filter={filter} setFilter={setFilter} activeCount={activeCount} />
          <div className="demo-actions">
            <button className="btn" onClick={handleCreateDemo}>Create demo data (clear existing)</button>
          </div>
        </RightPanel>
      </div>

  <main className="todo-list">
        {/* loading-indicator is always in the DOM to avoid layout shifts when toggling */}
        <div className={`loading-indicator ${loading ? 'visible' : ''}`} aria-hidden={!loading}>
          <div className="muted">Loading...</div>
        </div>

        {error && <div className="error">Error: {error}</div>}

        <TodoList
          todos={filtered}
          editingId={editingId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          startEdit={startEdit}
          finishEdit={finishEdit}
          onToggle={t => updateTodo(t)}
          onDelete={id => deleteTodo(id)}
          onTagClick={(tag: string) => setTagQuery(tag)}
        />
      </main>

  <footer className="app-footer muted">API: {API_BASE_URL} • {todos.length} total</footer>
    </div>
  );
}

export default App;