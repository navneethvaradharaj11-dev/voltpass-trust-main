
CREATE POLICY "profiles_admin_read" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_read" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
