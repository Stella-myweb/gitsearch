import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Category } from '@/pages/Category'
import { RepositoryPage } from '@/pages/Repository'
import { About } from '@/pages/About'
import { Roadmap } from '@/pages/Roadmap'
import { useUIStore } from '@/store/uiStore'

export default function App() {
  const theme = useUIStore(s => s.theme)

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/repository/:name" element={<RepositoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
