-- ==============================================
-- Guía Mayor - Schema de base de datos
-- Ejecutar en Supabase SQL Editor
-- ==============================================

-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('elderly', 'family')) NOT NULL DEFAULT 'elderly',
  linked_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de trámites completados
CREATE TABLE procedure_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  procedure_id TEXT NOT NULL,
  procedure_title TEXT NOT NULL,
  steps_completed INTEGER NOT NULL,
  needed_help INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de solicitudes de ayuda
CREATE TABLE help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  procedure_id TEXT NOT NULL,
  step_id INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'resolved')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Row Level Security (RLS)
-- ==============================================

-- Profiles: cada usuario ve su propio perfil
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Profiles: el familiar vinculado puede ver el perfil del adulto mayor
CREATE POLICY "Family can view linked elderly profile"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family'
    )
  );

-- Procedure completions: cada usuario ve sus propios trámites
ALTER TABLE procedure_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON procedure_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON procedure_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Family can view linked elderly completions
CREATE POLICY "Family can view linked elderly completions"
  ON procedure_completions FOR SELECT
  USING (
    user_id IN (
      SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family'
    )
  );

-- Help requests: cada usuario ve sus propias solicitudes
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own help requests"
  ON help_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own help requests"
  ON help_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Family can view linked elderly help requests
CREATE POLICY "Family can view linked elderly help requests"
  ON help_requests FOR SELECT
  USING (
    user_id IN (
      SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family'
    )
  );

-- ==============================================
-- Funciones y triggers
-- ==============================================

-- Auto-crear perfil al registrarse con Google Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: crear perfil automáticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- Índices para performance
-- ==============================================

CREATE INDEX idx_profiles_invite_code ON profiles(invite_code);
CREATE INDEX idx_profiles_linked_to ON profiles(linked_to);
CREATE INDEX idx_procedure_completions_user_id ON procedure_completions(user_id);
CREATE INDEX idx_help_requests_user_id ON help_requests(user_id);
