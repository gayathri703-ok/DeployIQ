import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import { authAPI } from '../../api/axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch {
      // show success anyway to avoid enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg noise flex items-center justify-center p-6">
      <div className="grid-bg" />
      <div className="relative z-10 w-full max-w-[380px] page-in">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-display font-extrabold text-sm shadow-accent">IQ</div>
          <span className="font-display font-bold text-xl text-text">DeployIQ</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green/10 border border-green/25 flex items-center justify-center text-3xl mx-auto mb-5">✉️</div>
            <h2 className="font-display font-bold text-2xl text-text mb-2">Check your email</h2>
            <p className="text-sm text-dim mb-6">We sent a reset link to <strong className="text-text">{email}</strong>. Check your inbox (and spam).</p>
            <Link to="/login" className="text-accent text-sm hover:underline">← Back to login</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-3xl text-text mb-1">Reset password.</h1>
            <p className="text-sm text-dim mb-8">Enter your email and we'll send a reset link.</p>
            <form onSubmit={handle} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <Button type="submit" loading={loading} className="w-full" size="lg">Send Reset Link</Button>
            </form>
            <p className="text-center text-sm text-dim mt-6">
              <Link to="/login" className="text-accent hover:underline">← Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}