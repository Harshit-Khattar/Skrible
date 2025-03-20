import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MainSite from './pages/MainSite'
import SkribleAI from './pages/SkribleAI'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main-site" element={<MainSite />} />
      <Route path="/skribleai" element={<SkribleAI />} />
    </Routes>
  )
}

export default App
