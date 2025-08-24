/**
 * @fileoverview Todo App Frontend API Documentation
 * @description TypeScript APIドキュメントのエントリーポイント
 * 
 * ## Overview
 * 
 * Todo Appフロントエンドは以下の主要モジュールで構成されています：
 * 
 * - **Types**: TypeScript型定義
 * - **Services**: API通信サービス
 * - **Hooks**: React カスタムフック
 * - **Components**: React UIコンポーネント
 * - **Utils**: ユーティリティ関数
 * 
 * ## Usage Example
 * 
 * ```typescript
 * import { fetchTodos, createTodoApi } from './services/todoService';
 * import type { Todo, TodoCreate } from './types/todo';
 * 
 * // Todoリストの取得
 * const todos = await fetchTodos();
 * 
 * // 新しいTodoの作成
 * const newTodo: TodoCreate = {
 *   title: "Learn TypeScript",
 *   completed: false,
 *   tags: ["learning", "typescript"]
 * };
 * const createdTodo = await createTodoApi(newTodo);
 * ```
 * 
 * @version 1.0.0
 * @author Todo App Team
 */

// Re-export all public APIs
export * from './types';
export * from './services';
export * from './hooks';
export * from './config/api';

/**
 * アプリケーションの設定情報
 */
export const APP_CONFIG = {
  /** アプリケーション名 */
  name: 'Todo App',
  /** バージョン */
  version: '1.0.0',
  /** 説明 */
  description: 'A modern todo application built with React and TypeScript',
} as const;

/**
 * アプリケーションで使用される定数
 */
export const CONSTANTS = {
  /** デフォルトのページサイズ */
  DEFAULT_PAGE_SIZE: 20,
  /** 最大タイトル長 */
  MAX_TITLE_LENGTH: 100,
  /** サポートされているタグの最大数 */
  MAX_TAGS: 10,
} as const;
