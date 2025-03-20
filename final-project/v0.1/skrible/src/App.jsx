import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MainSite from './pages/MainSite'
import SkribleAI from './pages/SkribleAI'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main-site" element={<MainSite />} />
      <Route path="/skribleai" element={<SkribleAI />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  )
}

export default App
