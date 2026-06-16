import { createServerFn } from '@tanstack/react-start'
import { getUser, type User } from '@netlify/identity'

export type { User as IdentityUser }

/**
 * Reads the current Netlify Identity user on the server by validating the
 * `nf_jwt` cookie. Returns null when there is no authenticated session.
 */
export const getServerUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getUser()
    // Cast through `any`: the Identity `User` carries `Record<string, unknown>`
    // metadata that TanStack's strict server-fn serializer cannot statically verify.
    return (user ?? null) as any
  },
)
