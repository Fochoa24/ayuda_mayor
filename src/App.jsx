import { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Onboarding from './components/Onboarding';
import GuideStep from './components/GuideStep';
import SuccessScreen from './components/SuccessScreen';
import FamilyDashboard from './components/FamilyDashboard';
import { PROCEDURES, INITIAL_USER_DATA } from './data/procedures';

const SCREENS = {
  WELCOME: 'welcome',
  ONBOARDING: 'onboarding',
  GUIDE: 'guide',
  SUCCESS: 'success',
  FAMILY: 'family',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [selectedProcedureId, setSelectedProcedureId] = useState(null);
  const [procedureHistory, setProcedureHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [userName] = useState(INITIAL_USER_DATA.name);

  const selectedProcedure = PROCEDURES.find(p => p.id === selectedProcedureId);

  const handleStart = useCallback(() => {
    setScreen(SCREENS.ONBOARDING);
  }, []);

  const handleGoToFamily = useCallback(() => {
    setScreen(SCREENS.FAMILY);
  }, []);

  const handleOnboardingComplete = useCallback((procedureId) => {
    setSelectedProcedureId(procedureId);
    setScreen(SCREENS.GUIDE);
  }, []);

  const handleGuideComplete = useCallback((result) => {
    setCurrentResult(result);
    setProcedureHistory(prev => [result, ...prev]);
    setScreen(SCREENS.SUCCESS);
  }, []);

  const handleSuccessContinue = useCallback(() => {
    setSelectedProcedureId(null);
    setCurrentResult(null);
    setScreen(SCREENS.ONBOARDING);
  }, []);

  const handleSuccessViewFamily = useCallback(() => {
    setScreen(SCREENS.FAMILY);
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setScreen(SCREENS.WELCOME);
    setSelectedProcedureId(null);
  }, []);

  const handleBackToOnboarding = useCallback(() => {
    setScreen(SCREENS.ONBOARDING);
    setSelectedProcedureId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gris-50">
      {screen === SCREENS.WELCOME && (
        <WelcomeScreen
          onStart={handleStart}
          onGoToFamily={handleGoToFamily}
        />
      )}

      {screen === SCREENS.ONBOARDING && (
        <Onboarding
          userName={userName}
          onComplete={handleOnboardingComplete}
          onBack={handleBackToWelcome}
        />
      )}

      {screen === SCREENS.GUIDE && selectedProcedure && (
        <GuideStep
          procedure={selectedProcedure}
          onComplete={handleGuideComplete}
          onBack={handleBackToOnboarding}
          userProgress={procedureHistory}
        />
      )}

      {screen === SCREENS.SUCCESS && currentResult && (
        <SuccessScreen
          result={currentResult}
          userName={userName}
          onContinue={handleSuccessContinue}
          onViewFamily={handleSuccessViewFamily}
        />
      )}

      {screen === SCREENS.FAMILY && (
        <FamilyDashboard
          userData={INITIAL_USER_DATA}
          procedureHistory={procedureHistory}
          onBack={handleBackToWelcome}
        />
      )}
    </div>
  );
}
