import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './features/home/pages/HomePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
