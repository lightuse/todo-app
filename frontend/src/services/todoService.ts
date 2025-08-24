import { API_BASE_URL } from '../config/api';
import type { Todo, TodoCreate } from '../types/todo';

const ENDPOINT = `${API_BASE_URL}/api/todos`;

/**
 * サーバーからTodoリストを取得する
 * @param tag - フィルタリングするタグ名（オプション）
 * @returns Promise<Todo[]> - Todoアイテムの配列を返すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function fetchTodos(tag?: string): Promise<Todo[]> {
  const url = tag ? `${ENDPOINT}?tag=${encodeURIComponent(tag)}` : ENDPOINT;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetchTodos HTTP ${res.status}`);
  return res.json();
}

/**
 * 新しいTodoアイテムをサーバーに作成する
 * @param payload - 作成するTodoアイテムの情報
 * @returns Promise<Todo> - 作成されたTodoアイテムを返すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function createTodoApi(payload: TodoCreate): Promise<Todo> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`createTodoApi HTTP ${res.status}`);
  return res.json();
}

/**
 * 既存のTodoアイテムをサーバーで更新する
 * @param id - 更新するTodoアイテムのID
 * @param payload - 更新する内容
 * @returns Promise<Todo> - 更新されたTodoアイテムを返すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function updateTodoApi(id: number, payload: TodoCreate): Promise<Todo> {
  const res = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`updateTodoApi HTTP ${res.status}`);
  return res.json();
}

/**
 * サーバーから指定されたTodoアイテムを削除する
 * @param id - 削除するTodoアイテムのID
 * @returns Promise<void> - 削除処理の完了を示すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function deleteTodoApi(id: number): Promise<void> {
  const res = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`deleteTodoApi HTTP ${res.status}`);
}

/**
 * サーバーから全てのTodoアイテムを削除する
 * @returns Promise<{message: string; count: number}> - 削除結果のメッセージと削除数を返すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function deleteAllTodosApi(): Promise<{ message: string; count: number }> {
  const res = await fetch(ENDPOINT, { method: 'DELETE' });
  if (!res.ok) throw new Error(`deleteAllTodosApi HTTP ${res.status}`);
  return res.json();
}

/**
 * デモ用のTodoデータをサーバーに作成する
 * @param clear - 既存のデータをクリアするかどうか（デフォルト: false）
 * @returns Promise<Todo[]> - 作成されたデモTodoアイテムの配列を返すPromise
 * @throws {Error} HTTPリクエストが失敗した場合にエラーをスロー
 */
export async function createDemoData(clear: boolean = false): Promise<Todo[]> {
  const url = `${API_BASE_URL}/api/demo${clear ? '?clear=true' : ''}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`createDemoData HTTP ${res.status}`);
  return res.json();
}
