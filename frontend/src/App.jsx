import { useState } from 'react'
import ShortenerForm from './components/ShortenerForm'
import AnalyticsPanel from './components/AnalyticsPanel'
import { LinkIcon, BarChart2, Scissors } from 'lucide-react'

// Main Application Component
function App() {
  // State to toggle between the 'Shorten' form and the 'Analytics' panel
  const [activeTab, setActiveTab] = useState('shorten')

  return (
    <>
      {/* Premium Header */}
      <h1 className="gradient-text">
        <Scissors size={40} style={{marginRight: '10px'}}/>
        LinkSpark
      </h1>
      <p className="subtitle">Lightning fast URL shortening and analytics</p>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'shorten' ? 'active' : ''}`}
          onClick={() => setActiveTab('shorten')}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <LinkIcon size={18} /> Shorten URL
          </span>
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <BarChart2 size={18} /> Analytics
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <main>
        {/* Render the appropriate component based on the active tab */}
        {activeTab === 'shorten' ? <ShortenerForm /> : <AnalyticsPanel />}
      </main>
    </>
  )
}

export default App
