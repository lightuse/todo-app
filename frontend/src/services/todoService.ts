import { API_BASE_URL } from '../config/api';
import type { Todo, TodoCreate } from '../types/todo';

const ENDPOINT = `${API_BASE_URL}/api/todos`;

export async function fetchTodos(tag?: string): Promise<Todo[]> {
  const url = tag ? `${ENDPOINT}?tag=${encodeURIComponent(tag)}` : ENDPOINT;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetchTodos HTTP ${res.status}`);
  return res.json();
}

export async function createTodoApi(payload: TodoCreate): Promise<Todo> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`createTodoApi HTTP ${res.status}`);
  return res.json();
}

export async function updateTodoApi(id: number, payload: TodoCreate): Promise<Todo> {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`updateTodoApi HTTP ${res.status}`);
  return res.json();
}

export async function deleteTodoApi(id: number): Promise<void> {
  const res = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`deleteTodoApi HTTP ${res.status}`);
}

export async function createDemoData(clear: boolean = false): Promise<Todo[]> {
  const url = `${API_BASE_URL}/api/demo${clear ? '?clear=true' : ''}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`createDemoData HTTP ${res.status}`);
  return res.json();
}
