import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HomePage } from './features/home/pages/HomePage';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <SpeedInsights />
    </>
  );
}
