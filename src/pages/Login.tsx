import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      if (email === 'admin@volt.com' || email === 'vendedor@volt.com' || email === 'cliente@volt.com') {
        toast.success(`Bienvenido, ${email.split('@')[0]}`);
        if (email === 'admin@volt.com') navigate('/admin');
        else if (email === 'vendedor@volt.com') navigate('/vendedor');
        else navigate('/');
      } else {
        toast.success(isLogin ? '¡Bienvenido de vuelta!' : '¡Cuenta creada exitosamente!');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Zap className="h-10 w-10 text-primary mx-auto mb-3 animate-pulse-neon" />
          <h1 className="font-heading text-2xl font-bold tracking-wider">
            {isLogin ? 'INICIAR' : 'CREAR'} <span className="neon-text">SESIÓN</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-lg p-6 space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading tracking-wider">
            {isLogin ? 'ENTRAR' : 'REGISTRARSE'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="text-center">Cuentas de prueba:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <code className="text-primary bg-secondary px-1.5 py-0.5 rounded">admin@volt.com / admin</code>
              <code className="text-primary bg-secondary px-1.5 py-0.5 rounded">vendedor@volt.com / vendedor</code>
              <code className="text-primary bg-secondary px-1.5 py-0.5 rounded">cliente@volt.com / cliente</code>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
