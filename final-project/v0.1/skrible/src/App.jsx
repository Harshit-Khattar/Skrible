import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MainSite from './pages/MainSite'
import SkribleAI from './pages/SkribleAI'
import SignUpSkrible from './pages/SignUpToSkrible'
import SignInSkrible from './pages/SignInToSkrible'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main-site" element={<MainSite />} />
      <Route path="/skribleai" element={<SkribleAI />} />
      <Route path="/signup" element={<SignUpSkrible />} />
      <Route path="/signin" element={<SignInSkrible />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
