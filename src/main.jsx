import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { LanguageProvider } from './i18n'
import AuthProvider from './auth/AuthProvider'
import { SundayAnalyticsProvider } from './lib/sunday-analyzer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SundayAnalyticsProvider siteKey="sa_e65b4412338d559454807a3c2fd2b362">
      <LanguageProvider>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </AuthProvider>
      </LanguageProvider>
    </SundayAnalyticsProvider>
  </StrictMode>
)
