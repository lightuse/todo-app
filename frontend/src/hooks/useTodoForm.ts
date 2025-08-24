import { useState } from 'react';

/**
 * Todoフォームの状態管理を行うカスタムフック
 * @returns Todoフォームの状態と操作関数を含むオブジェクト
 */
export function useTodoForm() {
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');

  /**
   * フォームの値をリセットする
   * @description タイトルとタグの入力フィールドを空にする
   */
  const resetForm = () => {
    setNewTitle('');
    setNewTags('');
  };

  /**
   * タグ文字列を配列に変換する
   * @returns string[] カンマ区切りのタグ文字列を配列に変換し、空白を除去
   * @description 空の要素はフィルタリングされる
   */
  const getTagsArray = () => {
    return newTags.split(',').map((s: string) => s.trim()).filter(Boolean);
  };

  return {
    /** 新しいTodoのタイトル */
    newTitle,
    /** タイトルを設定する関数 */
    setNewTitle,
    /** 新しいTodoのタグ文字列 */
    newTags,
    /** タグ文字列を設定する関数 */
    setNewTags,
    /** フォームをリセットする関数 */
    resetForm,
    /** タグ文字列を配列に変換する関数 */
    getTagsArray,
  };
}
