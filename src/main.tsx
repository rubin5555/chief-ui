import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:20px;color:red;font-size:18px">ERROR: #root element not found</div>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (e) {
    rootEl.innerHTML = `<div style="padding:20px;color:red;font-family:monospace"><h2>Render Error:</h2><pre>${e}</pre></div>`
  }
}
