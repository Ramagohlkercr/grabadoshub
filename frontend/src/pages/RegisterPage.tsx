import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/authClient.js';
import { useToast } from '../hooks/useToast.js';
import { UserPlus, User, Mail, KeyRound, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresá un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setAuthError(res.error.message || 'No se pudo completar el registro.');
        toast.error('Error en el registro');
      } else {
        toast.success('¡Cuenta creada exitosamente! Bienvenido a GrabadosHub.');
        navigate('/');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Error al conectar con el servidor.');
      toast.error('Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE8E2] p-8 sm:p-10 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#20201E] flex items-center justify-center p-2.5 mx-auto shadow-sm">
            <img src="/logo.svg" alt="GrabadosHub" className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#20201E]">Crear Cuenta</h1>
          <p className="text-xs text-[#77756F]">
            Registrate para explorar el catálogo y cotizar productos personalizados
          </p>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#20201E] mb-1.5" htmlFor="name">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#77756F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="Juan Pérez"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F6F3] border rounded-xl text-[#20201E] placeholder:text-[#77756F] focus:outline-hidden transition-colors ${
                  errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#EAE8E2] focus:border-[#A66B50]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

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
                placeholder="juan@ejemplo.com"
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
                autoComplete="new-password"
                {...register('password')}
                placeholder="Mínimo 8 caracteres"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#A66B50] hover:bg-[#8F5940] text-white text-sm font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Registrando...' : 'Crear mi cuenta'}</span>
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#77756F]">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login" className="font-bold text-[#A66B50] hover:underline">
            Iniciá sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
