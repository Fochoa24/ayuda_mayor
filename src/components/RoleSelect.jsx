import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { selectRole } from '../lib/supabase';

export default function RoleSelect({ onDone }) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role) => {
    setLoading(true);
    try {
      await selectRole(profile.id, role);
      await refreshProfile();
      onDone();
    } catch (err) {
      console.error('Error selecting role:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gris-50 flex flex-col items-center justify-center px-6 py-12 screen-enter">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="text-5xl">👋</div>
          <h1 className="text-3xl font-bold text-gris-900">
            ¡Hola, {profile?.full_name?.split(' ')[0] || 'amigo'}!
          </h1>
          <p className="text-lg text-gris-500">
            ¿Cómo vas a usar Guía Mayor?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelect('elderly')}
            disabled={loading}
            className="card w-full text-left hover:border-azul-400 active:border-azul-600
                       transition-colors cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-azul-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                👵
              </div>
              <div>
                <h3 className="text-xl font-bold text-gris-800">Soy persona mayor</h3>
                <p className="text-base text-gris-500">
                  Quiero aprender a hacer trámites en línea con ayuda paso a paso
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('family')}
            disabled={loading}
            className="card w-full text-left hover:border-verde-400 active:border-verde-600
                       transition-colors cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-verde-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                👨‍👩‍👦
              </div>
              <div>
                <h3 className="text-xl font-bold text-gris-800">Soy familiar / tutor</h3>
                <p className="text-base text-gris-500">
                  Quiero invitar a mi familiar y ver su progreso
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
