import { Routes, Route, Navigate } from 'react-router-dom'
import { CalculatorPage } from '@/pages/CalculatorPage'
import { ConverterPage } from '@/pages/ConverterPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { MainLayout } from '@/layouts/MainLayout'

export function Router() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/converter" element={<ConverterPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}
