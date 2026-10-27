import { useAuth } from '../contexts/AuthContext';

export default function Header({ title, onBack, showBack = false, rightAction }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gris-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-azul-600 font-semibold
                       min-h-[48px] min-w-[48px] justify-center
                       rounded-xl hover:bg-azul-50 active:bg-azul-100
                       transition-colors text-lg cursor-pointer"
            aria-label="Volver"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-azul-600 rounded-xl flex items-center justify-center text-white text-xl">
              🤝
            </div>
            <span className="text-gris-400 text-sm font-medium">Guía Mayor</span>
          </div>
        )}

        {title && (
          <h1 className="text-base sm:text-xl font-bold text-gris-800 absolute left-1/2 -translate-x-1/2
                         max-w-[45%] sm:max-w-[50%] truncate text-center">
            {title}
          </h1>
        )}

        {rightAction ? (
          <div>{rightAction}</div>
        ) : user && !showBack ? (
          <button
            onClick={logout}
            className="text-sm text-gris-400 hover:text-gris-600 min-h-[48px] min-w-[48px]
                       flex items-center justify-center rounded-xl
                       hover:bg-gris-50 active:bg-gris-100 transition-colors cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        ) : null}
      </div>
    </header>
  );
}
