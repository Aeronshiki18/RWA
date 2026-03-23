import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Web3Provider } from './components/Web3Provider'
import '@coinbase/onchainkit/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>,
)

