import { useAuth } from '../contexts/AuthContext';

export default function WelcomeScreen({ onStart, onLogin }) {
  const { user, profile, logout, isFamily } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 screen-enter">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-7xl mb-4" aria-hidden="true">🤝</div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gris-900 leading-tight">
            Guía Mayor
          </h1>
          <p className="text-xl text-gris-500 leading-relaxed">
            Tu asistente digital para trámites en línea
          </p>
        </div>

        {user ? (
          <div className="card space-y-4">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full" />
              ) : (
                <div className="w-14 h-14 bg-azul-100 rounded-full flex items-center justify-center text-2xl">
                  {isFamily ? '👨‍👩‍👦' : '👤'}
                </div>
              )}
              <div className="text-left">
                <p className="text-lg font-bold text-gris-800">{profile?.full_name || 'Usuario'}</p>
                <p className="text-sm text-gris-400">{isFamily ? 'Familiar / Tutor' : 'Conectado'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={onStart} className="btn-primary w-full text-xl py-5">
                {isFamily ? '👨‍👩‍👦 Ver dashboard' : '💬 Continuar con el asistente'}
              </button>
              <button onClick={logout} className="btn-secondary w-full text-base">
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="card space-y-4 text-left">
              <h2 className="text-xl font-bold text-gris-800">¿Qué puedo hacer?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5" aria-hidden="true">💬</span>
                  <span className="text-lg text-gris-600">Hablar con un asistente que te guía paso a paso</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5" aria-hidden="true">🏦</span>
                  <span className="text-lg text-gris-600">Trámites bancarios, de salud y pensiones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5" aria-hidden="true">👨‍👩‍👦</span>
                  <span className="text-lg text-gris-600">Tu familiar puede ver tu progreso (opcional)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button onClick={onStart} className="btn-primary w-full text-xl py-5">
                💬 Comenzar ahora
              </button>

              <button onClick={onLogin} className="btn-secondary w-full text-base">
                👨‍👩‍👦 Soy familiar / tutor
              </button>
            </div>

            <p className="text-sm text-gris-400">
              No necesitas cuenta para usar el asistente. Es gratis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
