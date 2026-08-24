import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { RequireAuth } from './components/auth/RequireAuth'
import { HomePage } from './pages/HomePage'
import { GamesPage } from './pages/GamesPage'
import { ProfilePage } from './pages/ProfilePage'
import { PromotionsPage } from './pages/PromotionsPage'
import { RewardsPage } from './pages/RewardsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { WalletPage } from './pages/WalletPage'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
