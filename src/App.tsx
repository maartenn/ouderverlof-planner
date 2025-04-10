import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Planner } from './components/Planner';
import { LeaveInfo } from './components/LeaveInfo';
import { ToolGuide } from './components/ToolGuide';
import { Disclaimer } from './components/Disclaimer';

const base = process.env.GITHUB_PAGES ? '/ouderverlof-planner/' : '/';

function App() {
  return (
    <Router basename={base}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Planner />} />
            <Route path="/info" element={<LeaveInfo />} />
            <Route path="/guide" element={<ToolGuide />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
