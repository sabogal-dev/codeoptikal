import { BrowserRouter, Route, Routes } from 'react-router'
import { LoginPage } from '@/features/login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
