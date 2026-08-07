import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PagePartenaires from './PagePartenaires'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PagePartenaires />
  </StrictMode>,
)
