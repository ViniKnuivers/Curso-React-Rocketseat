import { Route, Routes } from 'react-router-dom';

import { DefaultLayout } from './layouts/DefaultLayouts';
import { History } from './pages/History/Index';
import { Home } from './pages/Home/Index';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}
