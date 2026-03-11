import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Campo obrigatório: nome'); return; }
    if (!email.trim()) { setError('Campo obrigatório: email'); return; }
    if (!password) { setError('Campo obrigatório: senha'); return; }
    if (password.length < 8) { setError('A senha deve ter no mínimo 8 caracteres'); return; }
    if (password !== confirmPassword) { setError('As senhas não conferem'); return; }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] card-surface p-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-gradient-primary mb-4">Conta criada! 🎉</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Enviamos um link de confirmação para <strong className="text-foreground">{email}</strong>. Verifique seu email para ativar sua conta.
          </p>
          <Link
            to="/login"
            className="inline-flex h-10 px-6 items-center rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="w-full max-w-[400px] card-surface p-8 relative z-10" style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 40px hsl(var(--primary) / 0.08)',
      }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gradient-primary">StudyOS</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-input border border-border text-foreground text-sm font-body glow-focus transition-colors placeholder:text-muted-foreground"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-input border border-border text-foreground text-sm font-body glow-focus transition-colors placeholder:text-muted-foreground"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-lg bg-input border border-border text-foreground text-sm font-body glow-focus transition-colors placeholder:text-muted-foreground"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-heading font-medium text-foreground mb-1.5">Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-input border border-border text-foreground text-sm font-body glow-focus transition-colors placeholder:text-muted-foreground"
              placeholder="Repita a senha"
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Criar conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
