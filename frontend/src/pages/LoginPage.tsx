import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '../services/authClient.js';
import { useToast } from '../hooks/useToast.js';
import { LogIn, KeyRound, Mail, AlertCircle, Github, Shield, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Por favor ingresá un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setAuthError(res.error.message || 'Credenciales inválidas. Verifique email y contraseña.');
        toast.error('Error de autenticación');
      } else {
        toast.success('¡Sesión iniciada con éxito!');
        // If the user is an admin or coming from an admin route, navigate accordingly
        navigate(from === '/' ? '/admin/dashboard' : from, { replace: true });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Error al conectar con el servidor de autenticación');
      toast.error('Error en el inicio de sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const res = await signIn.social({
        provider: 'github',
        callbackURL: window.location.origin + '/admin/dashboard',
      });
      if (res?.error) {
        toast.error(res.error.message || 'GitHub OAuth no configurado en el servidor.');
      } else if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch {
      toast.error('No se pudo iniciar el flujo de GitHub OAuth');
    }
  };

  // Demo Credentials Fast Fill
  const fillAdminCredentials = () => {
    setValue('email', 'admin@grabadoshub.com');
    setValue('password', 'AdminGrabados2026!');
  };

  const fillUserCredentials = () => {
    setValue('email', 'usuario@grabadoshub.com');
    setValue('password', 'UserGrabados2026!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE8E2] p-8 sm:p-10 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#20201E] flex items-center justify-center p-2.5 mx-auto shadow-sm">
            <img src="/logo.svg" alt="GrabadosHub" className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#20201E]">Iniciar Sesión</h1>
          <p className="text-xs text-[#77756F]">
            Accedé a tu cuenta o ingresá al panel administrativo de GrabadosHub
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#77756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="ejemplo@grabadoshub.com"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] placeholder:text-[#77756F] focus:outline-hidden transition-colors ${
                  errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#77756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] placeholder:text-[#77756F] focus:outline-hidden transition-colors ${
                  errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-white text-sm font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Verificando...' : 'Entrar a la plataforma'}</span>
          </button>
        </form>

        {/* GitHub OAuth Divider & Button */}
        <div className="space-y-4 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EAE8E2] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#77756F] uppercase tracking-wider absolute">
              o continuar con
            </span>
          </div>

          <button
            type="button"
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAE8E2] bg-white hover:bg-[#F7F6F3] text-[#20201E] text-xs font-semibold shadow-xs transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Ingresar con GitHub</span>
          </button>
        </div>

        {/* Academic / Testing helper card */}
        <div className="p-3.5 bg-[#F7F6F3] rounded-2xl border border-[#EAE8E2] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#20201E]">
            <Shield className="w-3.5 h-3.5 text-[#A66B50]" />
            <span>Credenciales de Evaluación UAI</span>
          </div>
          <p className="text-[11px] text-[#77756F]">
            Hacé clic en cualquiera de los botones para auto-completar:
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 border border-[#EAE8E2] text-[11px] font-bold text-[#A66B50] rounded-lg transition-colors text-center"
            >
              Cargar Admin
            </button>
            <button
              type="button"
              onClick={fillUserCredentials}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-100 border border-[#EAE8E2] text-[11px] font-bold text-[#20201E] rounded-lg transition-colors text-center"
            >
              Cargar User
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#77756F]">
          ¿No tenés cuenta aún?{' '}
          <Link to="/register" className="font-bold text-[#A66B50] hover:underline">
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
