import { useState } from 'react';
import Header from './Header';
import { PROCEDURES } from '../data/procedures';

export default function Onboarding({ userName, onComplete, onBack }) {
  const [selected, setSelected] = useState(null);

  const categoryLabels = {
    banco: 'Banca',
    salud: 'Salud',
    pensiones: 'Pensiones',
  };

  return (
    <div className="min-h-screen bg-gris-50 screen-enter">
      <Header
        title="Elige tu trámite"
        showBack={true}
        onBack={onBack}
      />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gris-900">
            ¡Hola, {userName}! 👋
          </h2>
          <p className="text-xl text-gris-500">
            ¿Qué trámite quieres aprender a hacer hoy?
          </p>
        </div>

        <div className="space-y-4" role="radiogroup" aria-label="Selección de trámite">
          {PROCEDURES.map((proc) => (
            <button
              key={proc.id}
              onClick={() => setSelected(proc.id)}
              className={`card-selectable w-full text-left ${
                selected === proc.id ? 'selected' : ''
              }`}
              role="radio"
              aria-checked={selected === proc.id}
              aria-label={`${proc.title}. ${proc.description}. Categoría: ${categoryLabels[proc.category]}. Tiempo estimado: ${proc.estimatedTime}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0" aria-hidden="true">
                  {proc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-azul-600 bg-azul-50 px-2 py-0.5 rounded-full">
                      {categoryLabels[proc.category]}
                    </span>
                    <span className="text-xs text-gris-400">
                      ~{proc.estimatedTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gris-800 mb-1">
                    {proc.title}
                  </h3>
                  <p className="text-base text-gris-500">
                    {proc.description}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full border-3 flex-shrink-0 flex items-center justify-center mt-2 transition-all ${
                  selected === proc.id
                    ? 'border-azul-600 bg-azul-600'
                    : 'border-gris-300 bg-white'
                }`}>
                  {selected === proc.id && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={() => onComplete(selected)}
            disabled={!selected}
            className={`w-full text-xl py-5 rounded-2xl font-semibold transition-all duration-150 cursor-pointer select-none ${
              selected
                ? 'bg-azul-600 hover:bg-azul-700 active:bg-azul-800 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                : 'bg-gris-200 text-gris-400 cursor-not-allowed'
            }`}
            aria-disabled={!selected}
          >
            {selected ? 'Comenzar guía paso a paso' : 'Selecciona un trámite'}
          </button>
        </div>
      </main>
    </div>
  );
}
