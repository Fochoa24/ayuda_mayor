import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getOrCreateProfile, signInWithGoogle, signOut, linkViaInviteCode } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        getOrCreateProfile(session.user)
          .then(p => { if (mounted) setProfile(p); })
          .catch(err => { console.error('Error loading profile:', err); });
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error getting session:', err);
      if (mounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const p = await getOrCreateProfile(session.user);
            if (mounted) setProfile(p);

            // If URL has invite code and user is elderly, link them
            const params = new URLSearchParams(window.location.search);
            const inviteCode = params.get('invite');
            if (inviteCode && p && !p.linked_to && p.role !== 'family') {
              try {
                const updated = await linkViaInviteCode(inviteCode, p.id);
                if (mounted) setProfile(updated);
                window.history.replaceState({}, '', window.location.pathname);
              } catch (err) {
                console.error('Error linking via invite:', err);
              }
            }
          } catch (err) {
            console.error('Error in onAuthStateChange:', err);
          }
        } else {
          if (mounted) setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await getOrCreateProfile(user);
      setProfile(p);
      return p;
    }
  };

  const isFamily = profile?.role === 'family';
  const isElderly = profile?.role === 'elderly';
  const isLinked = !!profile?.linked_to;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        refreshProfile,
        isFamily,
        isElderly,
        isLinked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
