import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen({ onBack }) {
  const { login, loading } = useAuth();
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await login();
    } catch (_err) {
      setError('No se pudo iniciar sesión. Intenta de nuevo.');
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gris-50 flex flex-col items-center justify-center px-6 py-12 screen-enter">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-azul-600 font-semibold
                     min-h-[48px] justify-center
                     rounded-xl hover:bg-azul-50 active:bg-azul-100
                     transition-colors text-lg cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Volver
        </button>

        <div className="text-center space-y-4">
          <div className="text-6xl mb-2">🤝</div>
          <h1 className="text-3xl font-bold text-gris-900">
            Entrar a Guía Mayor
          </h1>
          <p className="text-lg text-gris-500">
            Usa tu cuenta de Google para comenzar
          </p>
        </div>

        {error && (
          <div className="bg-rojo-50 border border-rojo-500/20 rounded-2xl p-4 text-center">
            <p className="text-base text-rojo-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isSigningIn || loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gris-200
                       hover:border-gris-300 active:border-gris-400
                       text-gris-800 font-semibold
                       min-h-[56px] px-8 py-4
                       rounded-2xl text-lg
                       transition-all duration-150
                       cursor-pointer select-none
                       shadow-sm hover:shadow-md
                       active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Conectando...
              </span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Entrar con Google
              </>
            )}
          </button>

          <p className="text-center text-sm text-gris-400">
            No necesitas contraseña. Es gratis y seguro.
          </p>
        </div>

        <div className="card space-y-3 text-left">
          <h3 className="text-lg font-bold text-gris-700">¿Cómo funciona?</h3>
          <div className="space-y-2 text-base text-gris-500">
            <p>1. Tu familiar te envía un link de invitación</p>
            <p>2. Haces click en el link y entras con Google</p>
            <p>3. Comienzas a aprender trámites paso a paso</p>
          </div>
        </div>
      </div>
    </div>
  );
}
