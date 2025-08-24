/**
 * Controlsコンポーネントのプロパティ型定義
 * @interface Props
 */
type Props = {
  /** 現在のフィルター状態 */
  filter: 'all' | 'active' | 'completed';
  /** フィルター状態を変更するコールバック関数 */
  setFilter: (f: 'all' | 'active' | 'completed') => void;
  /** アクティブ（未完了）なTodoアイテムの数 */
  activeCount: number;
};

/**
 * Todoリストのフィルタリングコントロールを提供するコンポーネント
 * @param props - Controlsコンポーネントのプロパティ
 * @returns JSX.Element
 * @description 全て/アクティブ/完了済みのフィルターボタンとアクティブなTodoの数を表示
 */
export default function Controls({ filter, setFilter, activeCount }: Props) {
  return (
    <section className="controls">
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <div className="counts">Active: {activeCount}</div>
  {/* demo action moved to footer */}
      {/* search moved to top of the app layout */}
    </section>
  );
}
