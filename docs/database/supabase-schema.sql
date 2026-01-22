-- =====================================================
-- Clan Finance - Schema de Base de Datos
-- Supabase PostgreSQL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE task_frequency AS ENUM ('daily', 'weekly', 'monthly', 'once');
CREATE TYPE transaction_type AS ENUM ('allowance_payout', 'manual_income', 'expense', 'savings_transfer');
CREATE TYPE payout_status AS ENUM ('calculated', 'paid_in_person');
CREATE TYPE payout_type AS ENUM ('monthly_allowance', 'bonus', 'special');

-- =====================================================
-- TABLA: clans
-- =====================================================

CREATE TABLE clans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  monthly_allowance NUMERIC(10, 2) NOT NULL DEFAULT 0,
  min_completion_percent INTEGER NOT NULL DEFAULT 85 CHECK (min_completion_percent >= 0 AND min_completion_percent <= 100),
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para clans
CREATE INDEX idx_clans_admin_id ON clans(admin_id);
CREATE INDEX idx_clans_join_code ON clans(join_code);

-- =====================================================
-- TABLA: profiles
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clan_id UUID REFERENCES clans(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'member',
  selected_theme TEXT NOT NULL DEFAULT 'onePiece',
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_clan_id ON profiles(clan_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =====================================================
-- TABLA: join_requests
-- =====================================================

CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clan_id UUID NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(clan_id, user_id)
);

-- Índices para join_requests
CREATE INDEX idx_join_requests_clan_id ON join_requests(clan_id);
CREATE INDEX idx_join_requests_user_id ON join_requests(user_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);

-- =====================================================
-- TABLA: tasks
-- =====================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clan_id UUID NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reward_value NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (reward_value >= 0),
  frequency task_frequency NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para tasks
CREATE INDEX idx_tasks_clan_id ON tasks(clan_id);
CREATE INDEX idx_tasks_is_active ON tasks(is_active);
CREATE INDEX idx_tasks_frequency ON tasks(frequency);

-- =====================================================
-- TABLA: task_logs
-- =====================================================

CREATE TABLE task_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para task_logs
CREATE INDEX idx_task_logs_task_id ON task_logs(task_id);
CREATE INDEX idx_task_logs_user_id ON task_logs(user_id);
CREATE INDEX idx_task_logs_status ON task_logs(status);
CREATE INDEX idx_task_logs_completed_at ON task_logs(completed_at);

-- =====================================================
-- TABLA: wallets
-- =====================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para wallets
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- =====================================================
-- TABLA: transactions
-- =====================================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para transactions
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- =====================================================
-- TABLA: payouts
-- =====================================================

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  payout_type payout_type NOT NULL DEFAULT 'monthly_allowance',
  description TEXT,
  status payout_status NOT NULL DEFAULT 'calculated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para payouts
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_month_year ON payouts(month, year);

-- =====================================================
-- TRIGGERS: updated_at automático
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clans_updated_at BEFORE UPDATE ON clans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_join_requests_updated_at BEFORE UPDATE ON join_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER: Actualizar balance de wallet automáticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wallets
  SET balance = balance + NEW.amount
  WHERE id = NEW.wallet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_on_transaction AFTER INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();

-- =====================================================
-- TRIGGER: Crear wallet automáticamente al crear profile
-- =====================================================

CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id, balance)
  VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_wallet_on_profile AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_wallet_for_user();

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para generar código de invitación único
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden ver perfiles de su clan"
  ON profiles FOR SELECT
  USING (clan_id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid()
  ));

-- Políticas para clans
CREATE POLICY "Los usuarios pueden ver su clan"
  ON clans FOR SELECT
  USING (id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Solo el admin puede actualizar el clan"
  ON clans FOR UPDATE
  USING (admin_id = auth.uid());

-- Políticas para join_requests
CREATE POLICY "Los usuarios pueden ver sus propias solicitudes"
  ON join_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "El admin puede ver todas las solicitudes de su clan"
  ON join_requests FOR SELECT
  USING (clan_id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "El admin puede actualizar solicitudes de su clan"
  ON join_requests FOR UPDATE
  USING (clan_id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para tasks
CREATE POLICY "Los miembros del clan pueden ver las tareas"
  ON tasks FOR SELECT
  USING (clan_id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Solo el admin puede crear/editar tareas"
  ON tasks FOR ALL
  USING (clan_id IN (
    SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Políticas para task_logs
CREATE POLICY "Los usuarios pueden ver sus propios logs"
  ON task_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "El admin puede ver logs de todos los miembros de su clan"
  ON task_logs FOR SELECT
  USING (
    task_id IN (
      SELECT t.id FROM tasks t
      INNER JOIN profiles p ON p.clan_id = t.clan_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Los usuarios pueden crear sus propios logs"
  ON task_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "El admin puede aprobar/rechazar logs de su clan"
  ON task_logs FOR UPDATE
  USING (
    task_id IN (
      SELECT t.id FROM tasks t
      INNER JOIN profiles p ON p.clan_id = t.clan_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Políticas para wallets
CREATE POLICY "Los usuarios pueden ver su propia wallet"
  ON wallets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "El admin puede ver wallets de todos los miembros de su clan"
  ON wallets FOR SELECT
  USING (
    user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.clan_id IN (
        SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Políticas para transactions
CREATE POLICY "Los usuarios pueden ver sus transacciones"
  ON transactions FOR SELECT
  USING (wallet_id IN (
    SELECT id FROM wallets WHERE user_id = auth.uid()
  ));

CREATE POLICY "El admin puede ver transacciones de todos los miembros de su clan"
  ON transactions FOR SELECT
  USING (
    wallet_id IN (
      SELECT w.id FROM wallets w
      INNER JOIN profiles p ON p.id = w.user_id
      WHERE p.clan_id IN (
        SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Los usuarios pueden crear transacciones en su wallet"
  ON transactions FOR INSERT
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

-- Políticas para payouts
CREATE POLICY "Los usuarios pueden ver sus propios payouts"
  ON payouts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "El admin puede ver payouts de todos los miembros de su clan"
  ON payouts FOR SELECT
  USING (
    user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.clan_id IN (
        SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "El admin puede crear/actualizar payouts de su clan"
  ON payouts FOR ALL
  USING (
    user_id IN (
      SELECT p.id FROM profiles p
      WHERE p.clan_id IN (
        SELECT clan_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );


-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Descomentar para insertar datos de prueba
/*
-- Nota: Necesitas reemplazar los UUIDs con IDs reales de auth.users
INSERT INTO clans (name, admin_id, currency_code, monthly_allowance, join_code)
VALUES ('Familia Nakama', 'uuid-del-admin', 'USD', 50.00, 'ONEPIECE');

INSERT INTO profiles (id, clan_id, display_name, role, selected_theme)
VALUES ('uuid-del-admin', 'uuid-del-clan', 'Luffy', 'admin', 'onePiece');
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- =====================================================
-- POLÍTICAS INSERT ADICIONALES (Onboarding)
-- =====================================================

-- Permitir crear perfil al registrarse
CREATE POLICY "Los usuarios pueden crear su propio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Permitir crear clan
CREATE POLICY "Los usuarios pueden crear un clan"
  ON clans FOR INSERT
  WITH CHECK (admin_id = auth.uid());

-- Permitir buscar clanes por código (público)
CREATE POLICY "Cualquiera puede buscar clanes por código de invitación"
  ON clans FOR SELECT
  USING (true);

-- Permitir crear join_request
CREATE POLICY "Los usuarios pueden solicitar unirse a un clan"
  ON join_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- CONSTRAINTS ADICIONALES
-- =====================================================

-- Evitar balance negativo en wallets
ALTER TABLE wallets ADD CONSTRAINT check_positive_balance 
  CHECK (balance >= 0);
