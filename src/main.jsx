import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { LanguageProvider } from './i18n'
import AuthProvider from './auth/AuthProvider'
import AppErrorBoundary from '@/components/layout/AppErrorBoundary'
import ClickSparkLayer from '@/components/effects/ClickSparkLayer'

/*
 * The boundary is outermost, above the language provider rather than under it.
 * A provider resolving its own content chunk is one of the things that can
 * throw, and a boundary mounted underneath it never gets the chance to render.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <ClickSparkLayer>
              <App />
            </ClickSparkLayer>
          </MotionConfig>
        </AuthProvider>
      </LanguageProvider>
    </AppErrorBoundary>
  </StrictMode>
)
