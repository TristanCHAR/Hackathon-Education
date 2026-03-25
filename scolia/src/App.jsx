// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home          from './pages/Home'
import HomeworkChat  from './pages/HomeworkChat'
import WellbeingChat from './pages/WellbeingChat'
import TeacherView   from './pages/TeacherView'

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/homework" element={<HomeworkChat />} />
      <Route path="/feelings" element={<WellbeingChat />} />
      <Route path="/teacher"  element={<TeacherView />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  )
}
