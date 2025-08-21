type Props = {
  filter: 'all' | 'active' | 'completed';
  setFilter: (f: 'all' | 'active' | 'completed') => void;
  activeCount: number;
};

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
