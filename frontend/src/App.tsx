import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/todos')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>APIデータ</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;