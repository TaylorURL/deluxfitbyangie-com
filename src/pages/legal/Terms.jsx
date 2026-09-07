import LegalPage from './LegalPage'

/** The terms of service route. `LegalPage` renders whichever document it is given. */
export default function Terms() {
  return <LegalPage document="terms" />
}
