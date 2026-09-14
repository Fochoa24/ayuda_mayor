export default function WelcomeScreen({ onStart, onGoToFamily }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 screen-enter">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-7xl mb-4" aria-hidden="true">🤝</div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gris-900 leading-tight">
            Guía Mayor
          </h1>
          <p className="text-xl text-gris-500 leading-relaxed">
            Tu asistente para trámites en línea, paso a paso
          </p>
        </div>

        <div className="card space-y-4 text-left">
          <h2 className="text-xl font-bold text-gris-800">¿Qué puedo hacer?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-0.5" aria-hidden="true">✅</span>
              <span className="text-lg text-gris-600">Aprender a hacer trámites bancarios</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-0.5" aria-hidden="true">✅</span>
              <span className="text-lg text-gris-600">Sacar horas médicas online</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl mt-0.5" aria-hidden="true">✅</span>
              <span className="text-lg text-gris-600">Consultar información de pensiones</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={onStart}
            className="btn-primary w-full text-xl py-5"
          >
            Comenzar
          </button>

          <button
            onClick={onGoToFamily}
            className="btn-secondary w-full text-lg"
          >
            👨‍👩‍👦 Entrar como familiar
          </button>
        </div>

        <p className="text-sm text-gris-400">
          No necesitas contraseña. Es gratis y seguro.
        </p>
      </div>
    </div>
  );
}
