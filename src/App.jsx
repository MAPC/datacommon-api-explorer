import React, { useState } from 'react'
import './App.css'
import ApiExplorer from './components/ApiExplorer'
import RExamples from './components/RExamples'
import PythonExamples from './components/PythonExamples'

function App() {
  const [activeTab, setActiveTab] = useState('explorer')

  return (
    <div className="App">
      <header className="app-header">
        <h1>DataCommon API Explorer</h1>
        <p>Explore and learn how to use the DataCommon API</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          API Explorer
        </button>
        <button
          className={`tab-button ${activeTab === 'r-examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('r-examples')}
        >
          R Examples
        </button>
        <button
          className={`tab-button ${activeTab === 'python-examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('python-examples')}
        >
          Python Examples
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'explorer' && <ApiExplorer />}
        {activeTab === 'r-examples' && <RExamples />}
        {activeTab === 'python-examples' && <PythonExamples />}
      </main>
    </div>
  )
}

export default App
