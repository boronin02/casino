import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './reset.css'
import './index.css'

import { BalanceProvider } from './helpers/BalanceContext.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
  <BalanceProvider>
    <App />
  </BalanceProvider>,
)
