CREATE TABLE public.admin_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_email text,
  action text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_activity TO service_role;
GRANT SELECT ON public.admin_activity TO authenticated;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view activity" ON public.admin_activity FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX admin_activity_created_idx ON public.admin_activity (created_at DESC);