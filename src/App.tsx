import { Routes, Route } from 'react-router-dom';
import CallbackPage from './pages/callback/callback';
import HomePage from './pages/home/home';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/%2Flogin%2Fcallback" element={<CallbackPage />} />
      </Routes>
  );
}

export default App;
