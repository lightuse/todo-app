import { useState } from 'react';
import { API_BASE_URL } from './config/api';
import NewTodo from './components/NewTodo';
import Controls from './components/Controls';
import RightPanel from './components/RightPanel';
import TodoList from './components/TodoList';
import ConfirmDialog from './components/ConfirmDialog';
import { useTodos, useEdit, useDemo, useTodoForm, useFilters } from './hooks';
import './styles/App.css';

/**
 * メインのTodoアプリケーションコンポーネント
 * @returns JSX.Element
 * @description Todoアプリケーションのメインコンポーネント。全体のレイアウトと状態管理を担当
 */
function App() {
  // 状態管理 - サーバーサイドタグフィルタリング用
  const [tagQuery, setTagQuery] = useState('');
  
  // カスタムフックを使用
  const todoState = useTodos(tagQuery);
  const filterState = useFilters(todoState.todos); // クライアントサイドフィルタリング
  const editState = useEdit(todoState.todos, todoState.updateTodo);
  const formState = useTodoForm();
  const demoState = useDemo(
    todoState.setLoading,
    todoState.setError,
    todoState.loadTodos
  );

  /**
   * 新しいTodoを作成するハンドラー関数
   * @description フォームの内容から新しいTodoを作成し、フォームをリセット
   */
  const handleCreateTodo = async () => {
    await todoState.createTodo(formState.newTitle, formState.getTagsArray());
    formState.resetForm();
  };

  return (
    <div className="app-root">
      <div className="layout-with-right">
        <div className="layout-main">
          <header className="app-header">
            <h1>TODO</h1>
          </header>

          {/* 1. 検索ボタン（最上部で固定） */}
          <div className="top-search fixed-section">
            <input
              aria-label="検索"
              placeholder="TODOタイトルを検索"
              value={filterState.query}
              onChange={(e) => filterState.setQuery(e.target.value)}
            />
            <input
              aria-label="タグ検索"
              placeholder="タグ：雑務, 仕事, プライベート"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
            />
          </div>

          {/* 2. 追加ボタン（固定で表示） */}
          <div className="add-todo-section fixed-section">
            <NewTodo 
              value={formState.newTitle} 
              onChange={formState.setNewTitle} 
              tagValue={formState.newTags} 
              onTagChange={formState.setNewTags} 
              onCreate={handleCreateTodo} 
            />
          </div>

          {/* 3. フィルタ（固定で表示） */}
          <div className="filter-section fixed-section">
            <Controls 
              filter={filterState.filter} 
              setFilter={filterState.setFilter} 
              activeCount={filterState.activeCount} 
            />
          </div>

        </div>
        <RightPanel>
          <div className="demo-actions">
            <button className="btn primary" onClick={demoState.handleCreateDemo}>
              📝 デモデータ作成
            </button>
            <button className="btn danger" onClick={demoState.handleClearAllTodos}>
              🗑️ 全て削除
            </button>
          </div>
        </RightPanel>
      </div>

      {/* 4. TODOリスト */}
      <main className="todo-list">
        {/* loading-indicator is always in the DOM to avoid layout shifts when toggling */}
        <div className={`loading-indicator ${todoState.loading ? 'visible' : ''}`} aria-hidden={!todoState.loading}>
          <div className="muted">Loading...</div>
        </div>

        {todoState.error && <div className="error">Error: {todoState.error}</div>}

        <TodoList
          todos={filterState.filteredTodos}
          editingId={editState.editingId}
          editingTitle={editState.editingTitle}
          setEditingTitle={editState.setEditingTitle}
          startEdit={editState.startEdit}
          finishEdit={editState.finishEdit}
          onToggle={todoState.updateTodo}
          onDelete={todoState.deleteTodo}
          onTagClick={(tag: string) => setTagQuery(tag)}
        />
      </main>

      <footer className="app-footer muted">API: {API_BASE_URL} • {todoState.todos.length} total</footer>
      
      {/* 確認ダイアログ */}
      <ConfirmDialog
        isOpen={demoState.showDeleteConfirm}
        onClose={demoState.hideDeleteConfirm}
        onConfirm={demoState.confirmDeleteAllTodos}
        title="全て削除の確認"
        message="全てのTODOを削除しますか？この操作は取り消せません。"
        confirmText="削除する"
        cancelText="キャンセル"
        variant="danger"
      />
    </div>
  );
}

export default App;