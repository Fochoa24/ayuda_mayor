import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user
export function getCurrentUser() {
  return supabase.auth.getUser();
}

// Get or create profile
export async function getOrCreateProfile(user) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existing) return existing;

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
    })
    .select()
    .single();

  if (error) throw error;
  return newProfile;
}

// Update profile
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Select role (first time)
export async function selectRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, role_selected: true })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Generate invite code for family
export async function generateInviteCode(userId) {
  const code = `GUIA-${Date.now().toString(36).toUpperCase()}`;
  const { data, error } = await supabase
    .from('profiles')
    .update({ invite_code: code })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Link elderly to family via invite code
export async function linkViaInviteCode(inviteCode, elderlyUserId) {
  // Find the family member with this invite code
  const { data: familyProfile, error: findError } = await supabase
    .from('profiles')
    .select('*')
    .eq('invite_code', inviteCode)
    .eq('role', 'family')
    .single();

  if (findError || !familyProfile) {
    throw new Error('Código de invitación no válido');
  }

  // Update the elderly profile to link to family
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({
      linked_to: familyProfile.id,
      role: 'elderly',
    })
    .eq('id', elderlyUserId)
    .select()
    .single();

  if (updateError) throw updateError;
  return updated;
}

// Save procedure completion
export async function saveProcedureCompletion(userId, result) {
  const { data, error } = await supabase
    .from('procedure_completions')
    .insert({
      user_id: userId,
      procedure_id: result.procedureId,
      procedure_title: result.procedureTitle,
      steps_completed: result.stepsCompleted,
      needed_help: result.neededHelp,
      total_steps: result.totalSteps,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get procedure completions for a user
export async function getProcedureCompletions(userId) {
  const { data, error } = await supabase
    .from('procedure_completions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get linked elderly user's completions (for family view)
export async function getLinkedElderlyCompletions(familyUserId) {
  const { data: familyProfile } = await supabase
    .from('profiles')
    .select('linked_to')
    .eq('id', familyUserId)
    .single();

  if (!familyProfile?.linked_to) return [];

  const { data, error } = await supabase
    .from('procedure_completions')
    .select('*')
    .eq('user_id', familyProfile.linked_to)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get linked elderly profile (for family view)
export async function getLinkedElderlyProfile(familyUserId) {
  const { data: familyProfile } = await supabase
    .from('profiles')
    .select('linked_to')
    .eq('id', familyUserId)
    .single();

  if (!familyProfile?.linked_to) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', familyProfile.linked_to)
    .single();

  if (error) return null;
  return data;
}

// Save help request
export async function saveHelpRequest(userId, procedureId, stepId) {
  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      user_id: userId,
      procedure_id: procedureId,
      step_id: stepId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
