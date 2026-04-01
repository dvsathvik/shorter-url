import { useState } from 'react'
import axios from 'axios'
import { Search, Activity, Calendar, Clock, AlertCircle } from 'lucide-react'

const API_URL = 'http://localhost:5000/api/url'

const AnalyticsPanel = () => {
  const [shortCode, setShortCode] = useState('')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAnalytics = async (e) => {
    e.preventDefault()
    
    // Strip the domain if the user pasted the entire URL instead of just the code
    let cleanCode = shortCode
    if (shortCode.includes('/')) {
      const parts = shortCode.split('/')
      cleanCode = parts[parts.length - 1]
    }

    if (!cleanCode) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_URL}/analytics/${cleanCode}`)
      setAnalyticsData(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analytics not found for this code.')
      setAnalyticsData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel" style={{maxWidth: '700px'}}>
      
      {/* Search Form */}
      <form onSubmit={fetchAnalytics} style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{flex: 1, position: 'relative'}}>
          <input 
            type="text" 
            placeholder="Paste your short code or full link here..." 
            className="input-field"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{width: 'auto', padding: '0 1.5rem'}} disabled={loading}>
          {loading ? '...' : <Search size={20} />}
        </button>
      </form>

      {error && (
        <div className="error-msg" style={{justifyContent: 'center', marginBottom: '1rem'}}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Analytics Results Display */}
      {analyticsData && (
        <div style={{animation: 'fadeIn 0.5s ease'}}>
          
          <div style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '0.5rem'}}>Link Performance</h3>
            <p style={{color: 'var(--text-muted)', wordBreak: 'break-all', fontSize: '0.9rem'}}>
              Dest: {analyticsData.originalUrl}
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Activity size={24} color="var(--primary)" style={{marginBottom: '0.5rem', display: 'inline-block'}} />
              <div className="stat-value">{analyticsData.clickCount}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
            
            <div className="stat-card">
              <Calendar size={24} color="var(--secondary)" style={{marginBottom: '0.5rem', display: 'inline-block'}} />
              <div className="stat-value" style={{fontSize: '1.5rem', marginTop: '0.5rem'}}>
                {new Date(analyticsData.createdAt).toLocaleDateString()}
              </div>
              <div className="stat-label">Date Created</div>
            </div>
          </div>
          
          {analyticsData.expiresAt && (
             <div className="stat-card" style={{marginTop: '1rem', width: '100%', borderColor: 'rgba(255, 76, 76, 0.2)'}}>
               <Clock size={20} color="var(--error)" style={{marginBottom: '0.5rem', display: 'inline-block'}} />
               <div style={{color: 'var(--text-main)'}}>
                 Expires on: {new Date(analyticsData.expiresAt).toLocaleDateString()}
               </div>
             </div>
          )}
          
        </div>
      )}
    </div>
  )
}

export default AnalyticsPanel
