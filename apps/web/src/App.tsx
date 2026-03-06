import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: добавить страницы */}
        <Route path="/" element={<div>NewsMap — начни с создания Layout</div>} />
      </Routes>
    </BrowserRouter>
  );
}
