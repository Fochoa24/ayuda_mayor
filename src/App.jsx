import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ChatScreen from './components/ChatScreen';
import FamilyDashboard from './components/FamilyDashboard';
import FamilyInvite from './components/FamilyInvite';
import RoleSelect from './components/RoleSelect';
import { getLinkedElderlyCompletions, getLinkedElderlyProfile } from './lib/supabase';

const SCREENS = {
  WELCOME: 'welcome',
  AUTH: 'auth',
  CHAT: 'chat',
  FAMILY: 'family',
  FAMILY_INVITE: 'family_invite',
  LOADING: 'loading',
};

export default function App() {
  const { user, profile, loading: authLoading, isFamily } = useAuth();
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [procedureHistory, setProcedureHistory] = useState([]);
  const [elderlyProfile, setElderlyProfile] = useState(null);

  const loadFamilyData = useCallback(async () => {
    try {
      const [completions, elderly] = await Promise.all([
        getLinkedElderlyCompletions(user.id),
        getLinkedElderlyProfile(user.id),
      ]);
      setProcedureHistory(completions);
      setElderlyProfile(elderly);
    } catch (err) {
      console.error('Error loading family data:', err);
    } finally {
      setScreen(SCREENS.FAMILY);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setScreen(SCREENS.WELCOME);
      return;
    }

    if (profile && !profile.role_selected) {
      setScreen(SCREENS.LOADING);
      return;
    }

    if (isFamily) {
      loadFamilyData();
    } else {
      setScreen(SCREENS.CHAT);
    }
  }, [user, profile, authLoading, isFamily, loadFamilyData]);

  const handleStartChat = useCallback(() => {
    if (user && profile?.role_selected && isFamily) {
      loadFamilyData();
    } else {
      setScreen(SCREENS.CHAT);
    }
  }, [user, profile, isFamily, loadFamilyData]);

  const handleLogin = useCallback(() => {
    setScreen(SCREENS.AUTH);
  }, []);

  const handleChatBack = useCallback(() => {
    setScreen(SCREENS.WELCOME);
  }, []);

  const handleGoToFamily = useCallback(() => {
    setScreen(SCREENS.FAMILY);
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setScreen(SCREENS.WELCOME);
  }, []);

  const handleGoToInvite = useCallback(() => {
    setScreen(SCREENS.FAMILY_INVITE);
  }, []);

  const handleInviteDone = useCallback(() => {
    if (isFamily) {
      loadFamilyData();
    } else {
      setScreen(SCREENS.CHAT);
    }
  }, [isFamily, loadFamilyData]);

  if (authLoading || screen === SCREENS.LOADING) {
    return (
      <div className="min-h-screen bg-gris-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-pulse">🤝</div>
          <p className="text-xl text-gris-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-50">
      {screen === SCREENS.WELCOME && (
        <WelcomeScreen
          onStart={handleStartChat}
          onLogin={handleLogin}
        />
      )}

      {screen === SCREENS.AUTH && (
        <AuthScreen onBack={() => setScreen(SCREENS.WELCOME)} />
      )}

      {screen === SCREENS.CHAT && (
        <ChatScreen onBack={handleChatBack} />
      )}

      {screen === SCREENS.FAMILY && (
        <FamilyDashboard
          userData={elderlyProfile ? {
            name: elderlyProfile.full_name?.split(' ')[0] || 'Familiar',
            lastName: elderlyProfile.full_name?.split(' ').slice(1).join(' ') || '',
            age: elderlyProfile.age || '--',
          } : {
            name: 'Familiar',
            lastName: '',
            age: '--',
          }}
          procedureHistory={procedureHistory}
          onBack={handleBackToWelcome}
          onInvite={handleGoToInvite}
          isLinked={!!elderlyProfile}
        />
      )}

      {screen === SCREENS.FAMILY_INVITE && (
        <FamilyInvite onDone={handleInviteDone} />
      )}
    </div>
  );
}
