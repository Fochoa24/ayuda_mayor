import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveHelpRequest } from '../lib/supabase';
import Header from './Header';
import ProgressBar from './ProgressBar';

export default function GuideStep({ procedure, onComplete, onBack }) {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepHelpNeeded, setStepHelpNeeded] = useState({});
  const [showTip, setShowTip] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const steps = procedure.steps;
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      setShowTip(false);
    }
  }, [totalSteps]);

  const handleNext = () => {
    if (isLastStep) {
      const helpNeededCount = Object.values(stepHelpNeeded).filter(Boolean).length;
      onComplete({
        procedureId: procedure.id,
        procedureTitle: procedure.title,
        stepsCompleted: totalSteps,
        neededHelp: helpNeededCount,
        totalSteps,
        completedAt: new Date().toISOString(),
      });
    } else {
      goToStep(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleAskHelp = async () => {
    setStepHelpNeeded(prev => ({ ...prev, [currentStep.id]: true }));
    setShowHelpModal(true);

    // Save help request to Supabase
    if (user) {
      try {
        await saveHelpRequest(user.id, procedure.id, currentStep.id);
      } catch (err) {
        console.error('Error saving help request:', err);
      }
    }
  };

  const getMockVisual = (action) => {
    const visuals = {
      open_browser: (
        <div className="bg-gris-100 rounded-2xl p-6 text-center space-y-3">
          <div className="text-6xl">🌐</div>
          <p className="text-lg text-gris-600 font-medium">Busca el ícono de Internet</p>
          <div className="flex justify-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-3xl">🌐</div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-3xl">🧭</div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-3xl">🌊</div>
          </div>
        </div>
      ),
      type_url: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <span className="text-xl text-gris-400">🔒</span>
            <div className="flex-1 h-10 bg-gris-50 rounded-lg flex items-center px-4">
              <span className="text-lg text-gris-400 animate-pulse">https://</span>
              <span className="text-lg text-gris-800 font-medium ml-1">{procedure.id === 'cartola-bancaria' ? 'bancoestado.cl' : procedure.id === 'hora-medica' ? 'hospitaldigital.cl' : 'afphabitat.cl'}</span>
            </div>
          </div>
        </div>
      ),
      tap_section: (
        <div className="bg-gris-100 rounded-2xl p-4 sm:p-6 text-center space-y-3">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-wrap justify-center gap-2">
            <div className="px-3 sm:px-4 py-2 bg-azul-100 text-azul-700 rounded-lg font-bold text-base sm:text-lg">🏠 Inicio</div>
            <div className="px-3 sm:px-4 py-2 bg-azul-600 text-white rounded-lg font-bold text-base sm:text-lg">👤 Personas</div>
            <div className="px-3 sm:px-4 py-2 bg-gris-100 text-gris-500 rounded-lg font-bold text-base sm:text-lg">🏢 Empresas</div>
          </div>
        </div>
      ),
      enter_rut: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            <label className="text-sm font-medium text-gris-600">RUT</label>
            <div className="h-12 bg-gris-50 rounded-lg border-2 border-gris-200 flex items-center px-4">
              <span className="text-xl text-gris-800 font-mono tracking-wider">12.345.678</span>
              <span className="text-xl text-gris-800 font-bold">-9</span>
            </div>
          </div>
        </div>
      ),
      enter_password: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            <label className="text-sm font-medium text-gris-600">Contraseña</label>
            <div className="h-12 bg-gris-50 rounded-lg border-2 border-gris-200 flex items-center px-4">
              <span className="text-xl tracking-[0.5em] text-gris-800">••••••</span>
            </div>
          </div>
          <p className="text-sm text-gris-400 text-center">🔒 Tu contraseña está segura</p>
        </div>
      ),
      find_statement: (
        <div className="bg-gris-100 rounded-2xl p-6 text-center space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-4xl mb-2">📊</div>
            <div className="px-6 py-3 bg-azul-100 text-azul-700 rounded-xl font-bold text-lg">Cartola / Movimientos</div>
          </div>
        </div>
      ),
      view_statement: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-center mb-4">
              <p className="text-sm text-gris-500">Saldo disponible</p>
              <p className="text-3xl font-bold text-verde-600">$245.680</p>
            </div>
            <div className="space-y-2 text-left">
              <div className="flex justify-between py-2 border-b border-gris-100">
                <span className="text-base text-gris-600">Supermercado</span>
                <span className="text-base font-medium text-rojo-500">-$23.400</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gris-100">
                <span className="text-base text-gris-600">Farmacia</span>
                <span className="text-base font-medium text-rojo-500">-$8.900</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-base text-gris-600">Pensión</span>
                <span className="text-base font-medium text-verde-600">+$350.000</span>
              </div>
            </div>
          </div>
        </div>
      ),
      tap_schedule: (
        <div className="bg-gris-100 rounded-2xl p-6 text-center space-y-3">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-5xl mb-3">📅</div>
            <div className="px-8 py-4 bg-verde-500 text-white rounded-xl font-bold text-xl">Agendar hora</div>
          </div>
        </div>
      ),
      select_type: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="px-4 py-3 bg-azul-100 text-azul-700 rounded-xl font-bold text-lg text-center">Consulta general</div>
            <div className="px-4 py-3 bg-gris-50 text-gris-600 rounded-xl font-bold text-lg text-center border border-gris-200">Control médico</div>
            <div className="px-4 py-3 bg-gris-50 text-gris-600 rounded-xl font-bold text-lg text-center border border-gris-200">Especialidad</div>
          </div>
        </div>
      ),
      select_date: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-center font-bold text-gris-700 mb-3">Septiembre 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Lu','Ma','Mi','Ju','Vi','Sa','Do'].map(d => (
                <div key={d} className="text-gris-400 font-medium py-1">{d}</div>
              ))}
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(d => (
                <div key={d} className={`py-2 rounded-lg font-medium ${
                  d === 15 ? 'bg-verde-500 text-white font-bold' :
                  d < 15 ? 'text-gris-300' : 'text-gris-600'
                }`}>{d}</div>
              ))}
            </div>
          </div>
        </div>
      ),
      confirm_data: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between py-2 border-b border-gris-100">
              <span className="text-base text-gris-500">Nombre</span>
              <span className="text-base font-medium text-gris-800">María González</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gris-100">
              <span className="text-base text-gris-500">RUT</span>
              <span className="text-base font-medium text-gris-800">12.345.678-9</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-base text-gris-500">Teléfono</span>
              <span className="text-base font-medium text-gris-800">+56 9 1234 5678</span>
            </div>
          </div>
        </div>
      ),
      confirmation: (
        <div className="bg-verde-50 rounded-2xl p-6 text-center space-y-3 border-2 border-verde-200">
          <div className="text-6xl">✅</div>
          <p className="text-xl font-bold text-verde-700">¡Hora confirmada!</p>
          <p className="text-lg text-verde-600">15 de Septiembre, 10:00 AM</p>
        </div>
      ),
      tap_affiliates: (
        <div className="bg-gris-100 rounded-2xl p-4 sm:p-6 text-center space-y-3">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-wrap justify-center gap-2">
            <div className="px-4 py-3 bg-azul-600 text-white rounded-xl font-bold text-base sm:text-lg">👤 Afiliados</div>
            <div className="px-4 py-3 bg-gris-100 text-gris-500 rounded-xl font-bold text-base sm:text-lg">🏢 Empresas</div>
          </div>
        </div>
      ),
      enter_credentials: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gris-600">RUT</label>
              <div className="h-12 bg-gris-50 rounded-lg border-2 border-gris-200 flex items-center px-4">
                <span className="text-lg text-gris-800 font-mono">12.345.678-9</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gris-600">Contraseña</label>
              <div className="h-12 bg-gris-50 rounded-lg border-2 border-gris-200 flex items-center px-4">
                <span className="text-lg tracking-[0.5em]">••••••</span>
              </div>
            </div>
          </div>
        </div>
      ),
      view_balance: (
        <div className="bg-gris-100 rounded-2xl p-6 space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-sm text-gris-500 mb-1">Saldo cuenta obligatoria</p>
            <p className="text-3xl font-bold text-verde-600 mb-4">$12.456.789</p>
            <p className="text-sm text-gris-500 mb-1">Saldo cuenta voluntaria</p>
            <p className="text-2xl font-bold text-azul-600">$3.234.567</p>
          </div>
        </div>
      ),
      view_info: (
        <div className="bg-verde-50 rounded-2xl p-6 text-center space-y-3 border-2 border-verde-200">
          <div className="text-6xl">✅</div>
          <p className="text-xl font-bold text-verde-700">Información consultada</p>
          <p className="text-lg text-verde-600">Puedes revisar tu saldo y movimientos</p>
        </div>
      ),
    };
    return visuals[action] || (
      <div className="bg-gris-100 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-3">📱</div>
        <p className="text-lg text-gris-600">Pantalla simulada</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gris-50 flex flex-col screen-enter">
      <Header
        title={procedure.title}
        showBack={true}
        onBack={currentStepIndex === 0 ? onBack : handleBack}
      />

      <ProgressBar current={currentStepIndex + 1} total={totalSteps} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col">
        <div className="flex-1 space-y-6">
          {/* Step Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="step-indicator bg-azul-600 text-white flex-shrink-0">
                {currentStepIndex + 1}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gris-900 flex-1 min-w-0">
                {currentStep.title}
              </h2>
            </div>
          </div>

          {/* Main Instruction */}
          <div className="card bg-azul-50 border-azul-200">
            <p className="text-xl leading-relaxed text-gris-800 font-medium">
              {currentStep.instruction}
            </p>
          </div>

          {/* Mock Visual */}
          <div className="screen-enter" key={currentStep.id}>
            {getMockVisual(currentStep.mockAction)}
          </div>

          {/* Tip Toggle */}
          <div>
            <button
              onClick={() => setShowTip(!showTip)}
              className="w-full flex items-center justify-between p-4 bg-naranja-50 rounded-2xl border border-naranja-200 cursor-pointer hover:bg-naranja-100 transition-colors"
              aria-expanded={showTip}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">💡</span>
                <span className="text-lg font-semibold text-naranja-600">
                  Consejo útil
                </span>
              </div>
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-naranja-600 transition-transform duration-200 ${showTip ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showTip && (
              <div className="mt-2 p-4 bg-white rounded-2xl border border-naranja-100 shadow-sm screen-enter">
                <p className="text-lg text-gris-700 leading-relaxed">
                  {currentStep.tip}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step Navigation */}
        <div className="pt-6 pb-8 space-y-3">
          <button
            onClick={handleNext}
            className={`w-full text-xl py-5 rounded-2xl font-semibold transition-all duration-150 cursor-pointer select-none ${
              isLastStep
                ? 'bg-verde-600 hover:bg-verde-700 active:bg-verde-700 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                : 'bg-azul-600 hover:bg-azul-700 active:bg-azul-800 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
            }`}
          >
            {isLastStep ? '✅ Terminar trámite' : 'Siguiente paso →'}
          </button>

          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 btn-secondary py-4"
              >
                ← Anterior
              </button>
            )}
            <button
              onClick={handleAskHelp}
              className="flex-1 bg-naranja-500 hover:bg-naranja-600 active:bg-naranja-600
                         text-white font-semibold py-4 px-6 rounded-2xl text-lg
                         transition-all duration-150 cursor-pointer select-none
                         active:scale-[0.98] flex items-center justify-center gap-2"
            >
              🆘 Pedir ayuda
            </button>
          </div>
        </div>
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="Solicitar ayuda">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 screen-enter shadow-2xl">
            <div className="text-center space-y-3">
              <div className="text-5xl">👨‍👩‍👦</div>
              <h3 className="text-2xl font-bold text-gris-900">¿Necesitas ayuda?</h3>
              <p className="text-lg text-gris-500">
                Tu familiar ha sido notificado. Mientras tanto, ¿quieres repetir este paso?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setShowHelpModal(false); setShowTip(true); }}
                className="btn-primary w-full text-lg"
              >
                🔄 Repetir este paso
              </button>
              <button
                onClick={() => setShowHelpModal(false)}
                className="btn-secondary w-full text-lg"
              >
                Continuar sin ayuda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
