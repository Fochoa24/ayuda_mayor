import Header from './Header';

export default function SuccessScreen({ result, userName, onContinue, onViewFamily }) {
  const isAlone = result.neededHelp === 0;
  const helpPercentage = Math.round(((result.totalSteps - result.neededHelp) / result.totalSteps) * 100);

  const getConfidenceMessage = () => {
    if (isAlone) return { text: '¡Lo hiciste completamente solo/a!', emoji: '🌟', color: 'dorado' };
    if (result.neededHelp <= 2) return { text: '¡Muy bien! Casi no necesitaste ayuda', emoji: '⭐', color: 'verde' };
    return { text: '¡Buen trabajo! Con la práctica irás mejorando', emoji: '💪', color: 'azul' };
  };

  const confidence = getConfidenceMessage();

  return (
    <div className="min-h-screen bg-gris-50 screen-enter">
      <Header title="¡Trámite completado!" />

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Celebration */}
        <div className="text-center space-y-4">
          <div className="text-8xl animate-bounce" aria-hidden="true">🎉</div>
          <h1 className="text-4xl font-bold text-gris-900">
            ¡Listo, {userName}!
          </h1>
          <p className="text-2xl text-gris-600">
            Completaste: <strong>{result.procedureTitle}</strong>
          </p>
        </div>

        {/* Confidence Card */}
        <div className={`card text-center space-y-4 ${
          confidence.color === 'dorado' ? 'bg-dorado-400/10 border-dorado-400/30' :
          confidence.color === 'verde' ? 'bg-verde-50 border-verde-200' :
          'bg-azul-50 border-azul-200'
        }`}>
          <div className="text-5xl" aria-hidden="true">{confidence.emoji}</div>
          <p className="text-xl font-bold text-gris-800">{confidence.text}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center space-y-2">
            <div className="text-4xl font-bold text-azul-600">{result.stepsCompleted}</div>
            <p className="text-base text-gris-500 font-medium">Pasos completados</p>
          </div>
          <div className="card text-center space-y-2">
            <div className="text-4xl font-bold text-verde-600">{helpPercentage}%</div>
            <p className="text-base text-gris-500 font-medium">Independencia</p>
          </div>
        </div>

        {/* Autonomy Bar */}
        <div className="card space-y-3">
          <h3 className="text-lg font-bold text-gris-700">Tu nivel de autonomía</h3>
          <div className="h-5 bg-gris-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-verde-400 to-verde-600 rounded-full transition-all duration-1000"
              style={{ width: `${helpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gris-500">
            <span>Necesita ayuda</span>
            <span>Totalmente independiente</span>
          </div>
        </div>

        {/* Medal */}
        {isAlone && (
          <div className="card bg-dorado-400/10 border-dorado-400/30 text-center space-y-3">
            <div className="text-6xl" aria-hidden="true">🏅</div>
            <h3 className="text-xl font-bold text-gris-800">¡Medalla de independencia!</h3>
            <p className="text-base text-gris-600">
              Completaste todo el trámite sin pedir ayuda. ¡Sigue así!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={onContinue}
            className="btn-primary w-full text-xl py-5"
          >
            Hacer otro trámite
          </button>
          <button
            onClick={onViewFamily}
            className="btn-secondary w-full text-lg"
          >
            👨‍👩‍👦 Ver vista de familiar
          </button>
        </div>
      </main>
    </div>
  );
}
