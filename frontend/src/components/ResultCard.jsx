import { useState } from 'react'
import { CheckCircle2, Copy, ArrowLeft } from 'lucide-react'

// Component to handle displaying and copying the successful short URL
const ResultCard = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false)

  // We construct the full URL pointing to our backend server, which handles the redirect
  const fullShortUrl = `http://localhost:5000/${result.shortCode}`

  // Function to copy text to user's clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000) // Reset 'copied' state after 3 seconds
  }

  return (
    <div className="result-box">
      <div className="success-badge">
        <CheckCircle2 size={16} /> Successfully Shortened!
      </div>
      
      <p style={{color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Your new link is ready:</p>
      
      {/* Clickable link to test the redirect immediately */}
      <a 
        href={fullShortUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="short-url-link"
      >
        localhost:5000/{result.shortCode}
      </a>

      <button onClick={handleCopy} className="btn-primary" style={{marginTop: '1.5rem'}}>
        {copied ? 'Copied to Clipboard!' : <><Copy size={18} /> Copy Link</>}
      </button>

      <button onClick={onReset} className="btn-secondary">
        <ArrowLeft size={18} /> Shorten Another
      </button>
    </div>
  )
}

export default ResultCard
