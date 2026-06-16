import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'
import { IdentityProvider } from '../lib/identity-context'
import { CallbackHandler } from '../components/CallbackHandler'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Sador Group Copilot & Corporate Hub',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <IdentityProvider>
          <CallbackHandler>{children}</CallbackHandler>
        </IdentityProvider>
        <Scripts />
      </body>
    </html>
  )
}
