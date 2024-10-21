import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PDFSplitter from './PdfSplitter.jsx'
import './index.css'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PDFSplitter />
  </StrictMode>,
)