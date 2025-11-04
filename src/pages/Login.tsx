import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const Login = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log('Tentando login com Google');
      await signInWithGoogle();
      toast({
        title: 'Redirecionando...',
        description: 'Você será redirecionado para fazer login com o Google.',
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: 'Campo obrigatório',
        description: 'Digite seu email para recuperar a senha.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setShowResetDialog(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: 'Erro ao enviar email',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter no mínimo 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isSignUp) {
        console.log('Criando nova conta');
        const result = await signUpWithEmail(email, password);
        
        // Verificar se precisa confirmar email ou se já foi logado
        if (result?.user?.identities && result.user.identities.length === 0) {
          toast({
            title: 'Email já cadastrado!',
            description: 'Este email já está em uso. Tente fazer login.',
            variant: 'destructive',
          });
          setIsSignUp(false);
        } else if (result?.session) {
          // Login automático após criar conta
          toast({
            title: 'Conta criada e login realizado!',
            description: 'Bem-vindo ao Torqueo!',
          });
          // Usuário já foi logado automaticamente pelo signUpWithEmail
        } else {
          // Precisa confirmar email
          toast({
            title: 'Confirme seu email',
            description: 'Enviamos um link de confirmação para seu email. Após confirmar, você poderá fazer login.',
          });
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        console.log('Fazendo login');
        await signInWithEmail(email, password);
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo ao Torqueo.',
        });
      }
    } catch (error: any) {
      console.error('Erro:', error);
      let errorMessage = error.message || 'Verifique suas credenciais.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Confirme seu email antes de fazer login.';
      }
      
      toast({
        title: isSignUp ? 'Erro ao criar conta' : 'Erro ao fazer login',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <img 
              src="/logo-escuro.png" 
              alt="Torqueo Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-foreground">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo ao Torqueo'}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sistema profissional de orçamentos para oficinas mecânicas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Formulário Email/Senha */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-11"
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          {/* Botão Google */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 text-gray-900 text-base font-medium"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </>
            )}
          </Button>

          {/* Toggle entre Login/Cadastro e Esqueci Senha */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
              }}
              disabled={loading}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
            
            {!isSignUp && (
              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    disabled={loading}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recuperar Senha</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email cadastrado</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={resetLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enviaremos um link para redefinir sua senha
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full"
                    >
                      {resetLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Enviar Email de Recuperação'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </p>
            <p className="text-xs text-muted-foreground text-center font-medium">
              🔒 Seus dados estão protegidos e criptografados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};