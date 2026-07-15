
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'inspector', 'owner', 'buyer');
CREATE TYPE public.battery_chemistry AS ENUM ('NMC', 'LFP', 'NCA', 'LTO', 'LMO');
CREATE TYPE public.lifecycle_status AS ENUM ('first_life', 'inspection', 'second_life_ready', 'commercial_use', 'stationary_storage', 'recycling');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Trigger to auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, display_name, email, organization)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'organization'
  );
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'owner');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Batteries
CREATE TABLE public.batteries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_code TEXT NOT NULL UNIQUE,
  manufacturer TEXT NOT NULL,
  model TEXT,
  manufacturing_date DATE NOT NULL,
  chemistry public.battery_chemistry NOT NULL,
  original_capacity_kwh NUMERIC(10,2) NOT NULL,
  current_capacity_kwh NUMERIC(10,2) NOT NULL,
  charge_cycles INTEGER NOT NULL DEFAULT 0,
  avg_operating_temp_c NUMERIC(5,2) NOT NULL,
  fast_charging_freq_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  voltage_v NUMERIC(6,2) NOT NULL,
  current_a NUMERIC(6,2) NOT NULL,
  fault_count INTEGER NOT NULL DEFAULT 0,
  fault_records TEXT,
  maintenance_notes TEXT,
  inspection_notes TEXT,
  lifecycle_status public.lifecycle_status NOT NULL DEFAULT 'first_life',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trust_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.batteries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batteries TO authenticated;
GRANT ALL ON public.batteries TO service_role;
ALTER TABLE public.batteries ENABLE ROW LEVEL SECURITY;
-- Public read for QR passport scanning
CREATE POLICY "batteries_public_read" ON public.batteries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "batteries_insert_inspector_or_owner" ON public.batteries FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'inspector') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner')
  );
CREATE POLICY "batteries_update_owner_or_staff" ON public.batteries FOR UPDATE TO authenticated
  USING (
    auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'inspector')
  );
CREATE POLICY "batteries_delete_admin" ON public.batteries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Inspections
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id UUID NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  inspector_name TEXT,
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  soh_pct NUMERIC(5,2),
  notes TEXT,
  result TEXT
);
GRANT SELECT ON public.inspections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspections TO authenticated;
GRANT ALL ON public.inspections TO service_role;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inspections_public_read" ON public.inspections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "inspections_write_staff" ON public.inspections FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'inspector') OR public.has_role(auth.uid(),'admin'));

-- Maintenance records
CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id UUID NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  technician TEXT,
  description TEXT NOT NULL
);
GRANT SELECT ON public.maintenance_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_records TO authenticated;
GRANT ALL ON public.maintenance_records TO service_role;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "maintenance_public_read" ON public.maintenance_records FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "maintenance_write_staff" ON public.maintenance_records FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'inspector') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'owner'));

-- Audit logs (admin only)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_read" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "audit_insert_any" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_batteries BEFORE UPDATE ON public.batteries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
