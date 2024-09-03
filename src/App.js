import React from 'react';
import MoodTracker from './MoodTracker'; // Ensure this path is correct based on your folder structure
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mood Tracker Application</h1>
      </header>
      <main>
        <MoodTracker />
      </main>
    </div>
  );
};

export default App;
