-- Create verification_codes table
create table public.verification_codes (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Add RLS policies
alter table public.verification_codes enable row level security;

-- Allow insert for authenticated and anonymous users (needed for password reset)
create policy "Anyone can insert verification codes"
  on public.verification_codes for insert
  to public
  with check (true);

-- Only allow the user to see their own verification codes
create policy "Users can only see their own verification codes"
  on public.verification_codes for select
  to public
  using (email = current_user);

-- Only allow the user to delete their own verification codes
create policy "Users can only delete their own verification codes"
  on public.verification_codes for delete
  to public
  using (email = current_user);

-- Create index for faster lookups
create index verification_codes_email_code_idx on public.verification_codes(email, code);

-- Create function to clean up expired codes
create or replace function cleanup_expired_verification_codes()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.verification_codes
  where expires_at < now();
end;
$$;
