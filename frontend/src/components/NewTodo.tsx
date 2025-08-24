import type { ChangeEvent, KeyboardEvent } from 'react';

/**
 * NewTodoコンポーネントのプロパティ型定義
 * @interface Props
 */
type Props = {
  /** 入力フィールドの値 */
  value: string;
  /** 入力値が変更されたときのコールバック関数 */
  onChange: (v: string) => void;
  /** タグ入力フィールドの値（オプション、デフォルト: 空文字） */
  tagValue?: string;
  /** タグ入力値が変更されたときのコールバック関数（オプション） */
  onTagChange?: (v: string) => void;
  /** 新しいTodoを作成するときのコールバック関数 */
  onCreate: () => void;
};

/**
 * 新しいTodoを作成するための入力フォームコンポーネント
 * @param props - NewTodoコンポーネントのプロパティ
 * @returns JSX.Element
 * @description Todoのタイトルとタグを入力して新しいTodoアイテムを作成するフォーム
 */
export default function NewTodo({ value, onChange, tagValue = '', onTagChange = () => {}, onCreate }: Props) {
  return (
    <section className="new-todo">
      <input
        className="new-input"
        placeholder="新しいTODOを追加"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onCreate(); }}
      />
      <input
        className="tag-input"
        placeholder="タグ：雑務, 仕事, プライベート"
        value={tagValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onTagChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onCreate(); }}
      />
      <button className="btn primary" onClick={onCreate}>追加</button>
    </section>
  );
}
