CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rate_limits_scope_ip_created ON public.rate_limits(scope, ip, created_at DESC);
GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny public read of rate_limits" ON public.rate_limits FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "Deny public insert of rate_limits" ON public.rate_limits FOR INSERT TO anon, authenticated WITH CHECK (false);