-- Make intent explicit: deny SELECT/UPDATE/DELETE on contact_messages to anon/authenticated.
-- Only service_role (used by server functions via supabaseAdmin) can read these submissions.

CREATE POLICY "Deny public read of contact messages"
ON public.contact_messages
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Deny public update of contact messages"
ON public.contact_messages
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny public delete of contact messages"
ON public.contact_messages
FOR DELETE
TO anon, authenticated
USING (false);
