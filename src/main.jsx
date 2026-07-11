import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { LanguageProvider } from './i18n'
import AuthProvider from './auth/AuthProvider'
import { SundayAnalyticsProvider } from './lib/sunday-analyzer'
import { ClickSpark } from '@/components/reactbits'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SundayAnalyticsProvider siteKey="sa_e65b4412338d559454807a3c2fd2b362">
      <LanguageProvider>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            {/* React Bits ClickSpark — crimson spark burst on every click,
                site-wide. Spans the document so the effect reaches every page. */}
            <ClickSpark
              className="min-h-screen"
              sparkColor="#fb3645"
              sparkCount={10}
              sparkRadius={18}
              sparkSize={11}
              duration={450}
            >
              <App />
            </ClickSpark>
          </MotionConfig>
        </AuthProvider>
      </LanguageProvider>
    </SundayAnalyticsProvider>
  </StrictMode>
)
