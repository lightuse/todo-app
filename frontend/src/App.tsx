import { useEffect, useState } from 'react';
import { 
  API_BASE_URL
} from './config/api';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/todos`)
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