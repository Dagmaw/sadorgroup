import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  login,
  signup,
  oauthLogin,
  requestPasswordRecovery,
  getSettings,
  AuthError,
  MissingIdentityError,
  type AuthProvider,
} from '@netlify/identity'
import {
  Building2,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Github,
} from 'lucide-react'

import { useIdentity } from '@/lib/identity-context'

// export const Route = createFileRoute('/login')({
//   component: LoginPage,
// })
// src/routes/login.tsx

import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'

export const Route = createFileRoute('/login')({
  component: () => {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/login"
          afterSignInUrl="/"   // ✅ NEW: redirect to homepage after login
          afterSignUpUrl="/"   // ✅ NEW: redirect to homepage after signup
        />
      </div>
    )
  },
})


type Mode = 'login' | 'signup' | 'forgot'
type Status = 'idle' | 'pending'

const OAUTH_LABELS: Partial<Record<AuthProvider, string>> = {
  google: 'Google',
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
}

function friendlyError(err: unknown): string {
  if (err instanceof MissingIdentityError) {
    return 'Identity is not enabled yet. Deploy the site and enable Identity to sign in.'
  }
  if (err instanceof AuthError) {
    switch (err.status) {
      case 401:
        return 'Invalid email or password.'
      case 403:
        return 'Signups are currently disabled. Contact an administrator for an invite.'
      case 422:
        return 'Please check your details — the password may be too weak or the email malformed.'
      case 404:
        return 'No account found for that email.'
      default:
        return err.message
    }
  }
  return 'Something went wrong. Please try again.'
}

function LoginPage() {
  const { user, ready } = useIdentity()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('login')
  const [status, setStatus] = useState<Status>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [providers, setProviders] = useState<AuthProvider[]>([])

  // Redirect away once authenticated.
  useEffect(() => {
    if (ready && user) {
      navigate({ to: '/' })
    }
  }, [ready, user, navigate])

  // Discover which external OAuth providers are enabled for this site.
  useEffect(() => {
    getSettings()
      .then((settings) => {
        const enabled = Object.entries(settings.providers ?? {})
          .filter(([, on]) => on)
          .map(([provider]) => provider as AuthProvider)
        setProviders(enabled)
      })
      .catch(() => setProviders([]))
  }, [])

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setNotice('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')
    setStatus('pending')

    try {
      if (mode === 'login') {
        await login(email, password)
        // onAuthChange updates context; the redirect effect handles navigation.
      } else if (mode === 'signup') {
        const created = await signup(email, password, { full_name: name })
        if (created.confirmedAt) {
          setNotice('Account created. Signing you in…')
        } else {
          setNotice(
            `Almost there — we sent a confirmation link to ${email}. Click it to activate your account.`,
          )
          setMode('login')
        }
      } else {
        await requestPasswordRecovery(email)
        setNotice(`Password reset link sent to ${email}.`)
        setMode('login')
      }
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setStatus('idle')
    }
  }

  const pending = status === 'pending'
  const heading =
    mode === 'login'
      ? 'Sign in to the Hub'
      : mode === 'signup'
        ? 'Create your account'
        : 'Reset your password'
  const subheading =
    mode === 'login'
      ? 'Access the Sador Group corporate copilot and resource hub.'
      : mode === 'signup'
        ? 'Join the Sador Group corporate hub.'
        : 'Enter your email and we will send a recovery link.'

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30 selection:text-orange-400 px-4 py-10">
      {/* Ambient background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="p-2.5 bg-orange-600/15 rounded-lg border border-orange-500/20">
            <Building2 className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              SADOR GROUP
              <span className="text-[11px] text-orange-500 font-semibold border border-orange-500/30 px-1.5 py-[1px] rounded ml-1.5 bg-orange-500/5">
                HUB
              </span>
            </h1>
            <p className="text-[11px] font-mono text-neutral-500 mt-1">
              Corporate Copilot Access
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 sm:p-8 backdrop-blur shadow-2xl shadow-black/40">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-100">{heading}</h2>
            <p className="text-sm text-neutral-400 mt-1">{subheading}</p>
          </div>

          {/* Mode tabs */}
          {mode !== 'forgot' && (
            <div className="flex gap-1 p-1 bg-neutral-950/60 border border-neutral-800 rounded-lg mb-6 text-sm font-medium">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  mode === 'login'
                    ? 'bg-orange-600/15 text-orange-400 border border-orange-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  mode === 'signup'
                    ? 'bg-orange-600/15 text-orange-400 border border-orange-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                Create account
              </button>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-300 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2.5 mb-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {notice && (
            <div className="flex items-start gap-2 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-2.5 mb-4">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Field
                icon={<UserIcon className="w-4 h-4" />}
                label="Full name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            )}

            <Field
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@sadorgroup.com"
              autoComplete="email"
              required
            />

            {mode !== 'forgot' && (
              <div>
                <Field
                  icon={<Lock className="w-4 h-4" />}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  required
                />
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="mt-2 text-xs font-medium text-neutral-500 hover:text-orange-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login'
                    ? 'Sign in'
                    : mode === 'signup'
                      ? 'Create account'
                      : 'Send reset link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="mt-4 w-full text-center text-xs font-medium text-neutral-500 hover:text-orange-400 transition-colors"
            >
              Back to sign in
            </button>
          )}

          {/* OAuth */}
          {mode !== 'forgot' && providers.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-600">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => oauthLogin(provider)}
                    className="flex items-center justify-center gap-2 bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {provider === 'github' && <Github className="w-4 h-4" />}
                    Continue with {OAUTH_LABELS[provider] ?? provider}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-600 mt-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secured by Netlify Identity
        </p>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  icon: React.ReactNode
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-neutral-400 mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-neutral-950/60 border border-neutral-800 focus-within:border-orange-500/50 rounded-lg px-3 transition-colors">
        <span className="text-neutral-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="flex-1 bg-transparent border-0 text-sm py-2.5 focus:outline-none text-neutral-100 placeholder-neutral-600"
        />
      </div>
    </label>
  )
}
