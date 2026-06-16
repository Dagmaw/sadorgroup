import { useEffect } from 'react'
import { handleAuthCallback } from '@netlify/identity'

const AUTH_HASH_PATTERN =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

/**
 * Processes Netlify Identity redirects (email confirmation, password recovery,
 * invites, OAuth) that arrive in the URL hash on page load.
 */
export function CallbackHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (AUTH_HASH_PATTERN.test(window.location.hash)) {
      handleAuthCallback()
    }
  }, [])

  return <>{children}</>
}
