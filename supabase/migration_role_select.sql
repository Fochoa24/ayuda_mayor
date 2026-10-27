-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna role_selected
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_selected BOOLEAN DEFAULT FALSE;

-- 2. Dropear TODAS las políticas de TODAS las tablas que referencian role
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Family can view linked elderly profile" ON profiles;

-- Procedure completions
DROP POLICY IF EXISTS "Users can view own completions" ON procedure_completions;
DROP POLICY IF EXISTS "Users can insert own completions" ON procedure_completions;
DROP POLICY IF EXISTS "Family can view linked elderly completions" ON procedure_completions;

-- Help requests
DROP POLICY IF EXISTS "Users can view own help requests" ON help_requests;
DROP POLICY IF EXISTS "Users can insert own help requests" ON help_requests;
DROP POLICY IF EXISTS "Family can view linked elderly help requests" ON help_requests;

-- 3. Alterar la columna role
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles ALTER COLUMN role TYPE TEXT USING role::text;
ALTER TABLE profiles ALTER COLUMN role DROP NOT NULL;

-- 4. Recrear TODAS las políticas
-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Family can view linked elderly profile"
  ON profiles FOR SELECT USING (
    id IN (SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family')
  );

-- Procedure completions
CREATE POLICY "Users can view own completions"
  ON procedure_completions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON procedure_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family can view linked elderly completions"
  ON procedure_completions FOR SELECT USING (
    user_id IN (SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family')
  );

-- Help requests
CREATE POLICY "Users can view own help requests"
  ON help_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own help requests"
  ON help_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family can view linked elderly help requests"
  ON help_requests FOR SELECT USING (
    user_id IN (SELECT linked_to FROM profiles WHERE id = auth.uid() AND role = 'family')
  );

-- 5. Actualizar trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role_selected)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Reset tu usuario actual
UPDATE profiles SET role = NULL, role_selected = FALSE;
