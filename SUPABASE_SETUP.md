## Supabase Setup

1. Open your Supabase project SQL Editor.
2. Run [`supabase/migrations/20260405_initial_schema.sql`](/C:/Users/Lenovo/OneDrive/Documents/FIFA%2023/supabase/migrations/20260405_initial_schema.sql).
3. In `Authentication > URL Configuration`, set:
   - Site URL: your app URL or local host URL
   - Redirect URLs: include the exact app URL you use in browser
4. In `Authentication > Providers > Google`, enable Google and add the same redirect URL.
5. Create at least one auth user for each role, then update `public.profiles.role` for those users to `admin`, `teacher`, or `student`.
6. For student accounts, also set `profiles.linked_student_profile_id` after the student profile exists, or set `student_profiles.auth_user_id`.

### Seed Users

Use the helper script at [`scripts/supabase_admin_seed.py`](/C:/Users/Lenovo/OneDrive/Documents/FIFA%2023/scripts/supabase_admin_seed.py) to create initial auth users with the service role key from your own machine.

### Security Note

The frontend uses only the public anon key. The service role key is intentionally not stored in the app files.
