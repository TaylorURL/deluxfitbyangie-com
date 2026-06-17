-- =============================================================================
-- 0002_storage.sql — private bucket for coaching message attachments
-- -----------------------------------------------------------------------------
-- The portal Messages tab lets a client attach a file to a message. Files are
-- uploaded to the `message-attachments` bucket under a `<user_id>/...` prefix.
-- RLS keeps each client scoped to their own folder; the coach (service role)
-- bypasses RLS.
--
-- Idempotent: safe to re-run.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('message-attachments', 'message-attachments', false)
on conflict (id) do nothing;

-- A client may read/write only objects under their own user-id prefix.
drop policy if exists "message attachments — own folder read" on storage.objects;
create policy "message attachments — own folder read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'message-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "message attachments — own folder write" on storage.objects;
create policy "message attachments — own folder write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'message-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
