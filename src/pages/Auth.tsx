import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[hsl(222,55%,10%)] via-[hsl(217,33%,17%)] to-[hsl(222,55%,10%)] flex items-center justify-center">
        <div className="text-foreground/50 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error instanceof Error ? result.error.message : 'OAuth error');
      return;
    }
    if (result.redirected) return;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(222,55%,10%)] via-[hsl(217,33%,17%)] to-[hsl(222,55%,10%)] flex items-center justify-center p-4">
      <div className="glass-heavy rounded-2xl p-8 w-full max-w-md space-y-6 animate-window-open">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">🖥️ WebOS DeskFlow</h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Sign in to your workspace' : 'Create your workspace'}
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-sm font-medium transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-sm font-medium transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? '...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
