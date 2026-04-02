import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Invalid reset link.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[hsl(222,55%,10%)] via-[hsl(217,33%,17%)] to-[hsl(222,55%,10%)] flex items-center justify-center p-4">
      <div className="glass-heavy rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-xl font-bold text-foreground text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="New password"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm">
            {submitting ? '...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
