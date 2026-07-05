// ─────────────────────────────────────────────────────────────
// pages/auth/Login.jsx
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { Button, Input, Divider } from '../../components/ui';

export default function Login() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handle = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.ok) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-bg noise flex">
      <div className="grid-bg" />

      {/* ── Left: Form ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] page-in">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-display font-extrabold text-sm shadow-accent">
              IQ
            </div>
            <span className="font-display font-bold text-xl text-text">DeployIQ</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl text-text mb-1">Welcome back.</h1>
          <p className="text-sm text-dim mb-8">Your deployments are waiting.</p>

          <form onSubmit={handle} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-display font-semibold text-dim uppercase tracking-widest">Password</span>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign in to DeployIQ
            </Button>
          </form>

          <Divider label="or continue with" />

          <button className="w-full flex items-center justify-center gap-2.5 bg-surface2 border border-border hover:border-border2 text-text text-sm py-3 rounded-xl transition-all font-display font-medium">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <p className="text-center text-sm text-dim mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Create one free</Link>
          </p>
        </div>
      </div>

      {/* ── Right: Decorative ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-16 bg-surface border-l border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/6 via-transparent to-cyan/6" />
        {/* scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-scan" />
        </div>
        <div className="relative z-10 space-y-4 w-full max-w-sm">
          {/* Live deploy card */}
          <div className="bg-bg border border-border2 rounded-2xl p-5 shadow-card">
            <div className="text-[10px] text-muted font-mono uppercase tracking-wider mb-3">Latest Deployment</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green dot-glow" />
              <div className="flex-1">
                <div className="text-sm font-display font-semibold text-text">dashboard-ui</div>
                <div className="text-xs text-dim font-mono">main@cc29d01 · 2m ago</div>
              </div>
              <span className="text-[10px] font-mono bg-green/10 text-green px-2 py-0.5 rounded-lg border border-green/25">LIVE</span>
            </div>
            <div className="h-1.5 bg-surface3 rounded-full overflow-hidden mb-2">
              <div className="h-full w-11/12 bg-gradient-to-r from-accent to-green rounded-full" />
            </div>
            <div className="flex justify-between text-[11px] text-dim">
              <span>Build: 38s</span><span>Uptime: 99.9%</span>
            </div>
          </div>

          {/* Mini terminal */}
          <div className="bg-bg border border-border2 rounded-2xl overflow-hidden shadow-card">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-surface">
              <div className="w-2.5 h-2.5 rounded-full bg-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green/60" />
              <span className="ml-2 text-[11px] text-muted font-mono">build log</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <div className="text-green">✓ npm install (347 pkgs)</div>
              <div className="text-dim">→ Building Docker image…</div>
              <div className="text-green">✓ Image built (18.2s)</div>
              <div className="text-cyan">🎉 LIVE → localhost:4001</div>
              <div className="text-muted term-cursor" />
            </div>
          </div>

          {/* AI chip */}
          <div className="bg-gradient-to-r from-accent/10 to-cyan/10 border border-accent/25 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm text-text">
              <span className="text-accent">✦</span>
              <span className="font-display font-medium">AI Analyzer:</span>
              <span className="text-dim">No issues found today.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}