/**
 * Todoアイテムを表す型定義
 * @interface Todo
 */
export type Todo = {
  /** TodoアイテムのユニークID */
  id: number;
  /** Todoアイテムのタイトル */
  title: string;
  /** Todoアイテムの完了状態 */
  completed: boolean;
  /** Todoアイテムに関連付けられたタグ（オプション） */
  tags?: string[];
};

/**
 * 新しいTodoアイテムを作成する際に使用する型定義
 * @remarks idフィールドを除いたTodo型のサブセット
 */
export type TodoCreate = Omit<Todo, 'id'>;
