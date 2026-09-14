import Header from './Header';

export default function FamilyDashboard({ userData, procedureHistory, onBack }) {
  const totalProcedures = procedureHistory.length;
  const soloProcedures = procedureHistory.filter(p => p.neededHelp === 0).length;
  const avgIndependence = totalProcedures > 0
    ? Math.round(procedureHistory.reduce((sum, p) => sum + ((p.totalSteps - p.neededHelp) / p.totalSteps) * 100, 0) / totalProcedures)
    : 0;

  const getConfidenceBadge = (procedure) => {
    if (procedure.neededHelp === 0) {
      return <span className="inline-flex items-center gap-1 text-sm font-bold text-dorado-500 bg-dorado-400/20 px-3 py-1 rounded-full">🌟 Solo</span>;
    }
    if (procedure.neededHelp <= 2) {
      return <span className="inline-flex items-center gap-1 text-sm font-bold text-verde-600 bg-verde-50 px-3 py-1 rounded-full">⭐ Poca ayuda</span>;
    }
    return <span className="inline-flex items-center gap-1 text-sm font-bold text-naranja-600 bg-naranja-50 px-3 py-1 rounded-full">🤝 Con ayuda</span>;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryEmoji = (procedureId) => {
    if (procedureId.includes('cartola') || procedureId.includes('banco')) return '🏦';
    if (procedureId.includes('hora') || procedureId.includes('medico')) return '🏥';
    if (procedureId.includes('afp') || procedureId.includes('pension')) return '💰';
    return '📋';
  };

  return (
    <div className="min-h-screen bg-gris-50 screen-enter">
      <Header
        title="Vista de familiar"
        showBack={true}
        onBack={onBack}
      />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* User Profile */}
        <div className="card flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-azul-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0">
            👵
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gris-900 truncate">{userData.name} {userData.lastName}</h2>
            <p className="text-lg text-gris-500">{userData.age} años</p>
            <p className="text-sm text-gris-400 mt-1">Vinculada como familiar</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="card text-center space-y-2 py-4">
            <div className="text-3xl font-bold text-azul-600">{totalProcedures}</div>
            <p className="text-sm text-gris-500 font-medium">Trámites</p>
          </div>
          <div className="card text-center space-y-2 py-4">
            <div className="text-3xl font-bold text-verde-600">{soloProcedures}</div>
            <p className="text-sm text-gris-500 font-medium">Sin ayuda</p>
          </div>
          <div className="card text-center space-y-2 py-4">
            <div className="text-3xl font-bold text-gris-800">{avgIndependence}%</div>
            <p className="text-sm text-gris-500 font-medium">Independencia</p>
          </div>
        </div>

        {/* Confidence Level */}
        <div className="card space-y-4">
          <h3 className="text-xl font-bold text-gris-800">Nivel de confianza digital</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gris-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-azul-400 to-azul-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(avgIndependence + 10, 100)}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-azul-600 min-w-[3rem] text-right">
              {avgIndependence > 70 ? 'Alto' : avgIndependence > 40 ? 'Medio' : 'Bajo'}
            </span>
          </div>
          <p className="text-base text-gris-500">
            {avgIndependence > 70
              ? `${userData.name} está ganando mucha independencia digital. ¡Sigue así!`
              : avgIndependence > 40
              ? `${userData.name} está mejorando. Con más práctica, logrará hacer los trámites sola.`
              : `${userData.name} está empezando a aprender. Tu apoyo es muy importante para ella.`
            }
          </p>
        </div>

        {/* Procedure History */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gris-800">Historial de trámites</h3>

          {procedureHistory.length === 0 ? (
            <div className="card text-center py-8 space-y-3">
              <div className="text-5xl" aria-hidden="true">📭</div>
              <p className="text-lg text-gris-500">Aún no ha completado ningún trámite</p>
              <p className="text-base text-gris-400">
                Cuando {userData.name} complete un trámite, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {procedureHistory.map((proc, index) => (
                <div key={index} className="card flex items-center gap-4">
                  <div className="text-3xl flex-shrink-0" aria-hidden="true">
                    {getCategoryEmoji(proc.procedureId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gris-800 truncate">
                      {proc.procedureTitle}
                    </h4>
                    <p className="text-sm text-gris-400">
                      {formatDate(proc.completedAt)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getConfidenceBadge(proc)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips for Family */}
        <div className="card bg-azul-50 border-azul-200 space-y-3">
          <h3 className="text-lg font-bold text-azul-800">💡 Consejos para ti</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-lg text-azul-600 leading-snug shrink-0" aria-hidden="true">•</span>
              <span className="text-base text-azul-700">Pregunta a {userData.name} cómo le fue con el trámite</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg text-azul-600 leading-snug shrink-0" aria-hidden="true">•</span>
              <span className="text-base text-azul-700">Celebra cada trámite que haga sin ayuda</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg text-azul-600 leading-snug shrink-0" aria-hidden="true">•</span>
              <span className="text-base text-azul-700">Si necesita ayuda, esté disponible pero no haga el trámite por ella</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
