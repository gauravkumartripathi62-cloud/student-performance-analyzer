create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'teacher', 'student');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.app_role not null default 'student',
  is_active boolean not null default true,
  linked_student_profile_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  enrollment_id text not null unique,
  full_name text not null,
  email text,
  phone text,
  level text not null default 'UG',
  dob date,
  program text not null,
  department text,
  current_semester integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint student_profiles_current_semester_check check (current_semester between 1 and 8),
  constraint student_profiles_level_check check (level in ('UG', 'PG'))
);

alter table public.profiles
  add constraint profiles_linked_student_profile_id_fkey
  foreign key (linked_student_profile_id) references public.student_profiles(id) on delete set null;

create table if not exists public.semester_records (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  semester integer not null,
  study_hours numeric(5,2) not null default 0,
  attendance numeric(5,2) not null default 0,
  backlogs integer not null default 0,
  previous_cgpa numeric(4,2) not null default 0,
  sgpa numeric(4,2) not null default 0,
  cgpa numeric(4,2) not null default 0,
  percentage numeric(5,2) not null default 0,
  division text,
  category text,
  rank integer,
  total_credits integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_profile_id, semester),
  constraint semester_records_semester_check check (semester between 1 and 8),
  constraint semester_records_attendance_check check (attendance between 0 and 100),
  constraint semester_records_study_hours_check check (study_hours between 0 and 80),
  constraint semester_records_backlogs_check check (backlogs between 0 and 20)
);

create table if not exists public.subject_results (
  id uuid primary key default gen_random_uuid(),
  semester_record_id uuid not null references public.semester_records(id) on delete cascade,
  position integer not null,
  subject_name text not null,
  credits integer not null default 4,
  assignments numeric(5,2) not null default 0,
  external_marks numeric(5,2) not null default 0,
  total_marks numeric(5,2) not null default 0,
  final_score numeric(5,2) not null default 0,
  grade text,
  grade_points numeric(5,2) not null default 0,
  status_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (semester_record_id, position),
  constraint subject_results_credits_check check (credits between 1 and 10),
  constraint subject_results_assignments_check check (assignments between 0 and 40),
  constraint subject_results_external_check check (external_marks between 0 and 60)
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  imported_by uuid references auth.users(id) on delete set null,
  source_filename text not null,
  row_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_student_profiles_updated_at on public.student_profiles;
create trigger trg_student_profiles_updated_at
before update on public.student_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_semester_records_updated_at on public.semester_records;
create trigger trg_semester_records_updated_at
before update on public.semester_records
for each row
execute function public.set_updated_at();

drop trigger if exists trg_subject_results_updated_at on public.subject_results;
create trigger trg_subject_results_updated_at
before update on public.subject_results
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'student'::public.app_role);
$$;

create or replace function public.current_linked_student_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select linked_student_profile_id from public.profiles where id = auth.uid()),
    (select id from public.student_profiles where auth_user_id = auth.uid())
  );
$$;

create or replace function public.ensure_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_row public.profiles;
begin
  insert into public.profiles (id, email, full_name)
  values (
    auth.uid(),
    auth.jwt() ->> 'email',
    coalesce(auth.jwt() ->> 'full_name', auth.jwt() ->> 'name', split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name)
  returning * into profile_row;

  return profile_row;
end;
$$;

create or replace function public.can_manage_students()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('admin'::public.app_role, 'teacher'::public.app_role);
$$;

create or replace function public.get_accessible_student_records()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with scoped_profiles as (
    select sp.*
    from public.student_profiles sp
    where
      public.current_app_role() in ('admin'::public.app_role, 'teacher'::public.app_role)
      or sp.id = public.current_linked_student_profile_id()
      or sp.auth_user_id = auth.uid()
  ),
  scoped_records as (
    select
      sr.id,
      sr.student_profile_id,
      sr.semester,
      sr.study_hours,
      sr.attendance,
      sr.backlogs,
      sr.previous_cgpa,
      sr.sgpa,
      sr.cgpa,
      sr.percentage,
      sr.division,
      sr.category,
      sr.rank,
      sr.total_credits,
      sp.enrollment_id,
      sp.full_name,
      sp.email,
      sp.phone,
      sp.level,
      sp.dob,
      sp.program,
      sp.department
    from public.semester_records sr
    join scoped_profiles sp on sp.id = sr.student_profile_id
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', sr.id,
        'studentProfileId', sr.student_profile_id,
        'name', sr.full_name,
        'enrollmentId', sr.enrollment_id,
        'email', coalesce(sr.email, ''),
        'phone', coalesce(sr.phone, ''),
        'level', sr.level,
        'dob', coalesce(to_char(sr.dob, 'YYYY-MM-DD'), ''),
        'program', sr.program,
        'department', coalesce(sr.department, ''),
        'semester', sr.semester,
        'studyHours', sr.study_hours,
        'attendance', sr.attendance,
        'backlogs', sr.backlogs,
        'previousCgpa', sr.previous_cgpa,
        'sgpa', sr.sgpa,
        'cgpa', sr.cgpa,
        'percentage', sr.percentage,
        'division', coalesce(sr.division, ''),
        'category', coalesce(sr.category, ''),
        'rank', sr.rank,
        'totalCredits', sr.total_credits,
        'subjects', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'subject', sub.subject_name,
              'credits', sub.credits,
              'assignments', sub.assignments,
              'external', sub.external_marks,
              'total', sub.total_marks,
              'finalScore', sub.final_score,
              'grade', coalesce(sub.grade, ''),
              'points', sub.grade_points,
              'label', coalesce(sub.status_label, '')
            )
            order by sub.position
          )
          from public.subject_results sub
          where sub.semester_record_id = sr.id
        ), '[]'::jsonb)
      )
      order by sr.enrollment_id, sr.semester
    ),
    '[]'::jsonb
  )
  from scoped_records sr;
$$;

create or replace function public.upsert_student_record(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  student_profile_uuid uuid;
  semester_record_uuid uuid;
  subject_item jsonb;
  position_index integer := 0;
  payload_enrollment_id text := trim(coalesce(payload ->> 'enrollmentId', ''));
  payload_student_profile_id uuid := nullif(payload ->> 'studentProfileId', '')::uuid;
  payload_auth_user_id uuid := nullif(payload ->> 'authUserId', '')::uuid;
begin
  if not public.can_manage_students() then
    raise exception 'You are not allowed to modify student records';
  end if;

  if payload_enrollment_id = '' then
    raise exception 'enrollmentId is required';
  end if;

  if payload_student_profile_id is not null then
    select id into student_profile_uuid
    from public.student_profiles
    where id = payload_student_profile_id;
  end if;

  if student_profile_uuid is null then
    insert into public.student_profiles (
      auth_user_id,
      enrollment_id,
      full_name,
      email,
      phone,
      level,
      dob,
      program,
      department,
      current_semester,
      created_by,
      updated_by
    )
    values (
      payload_auth_user_id,
      payload_enrollment_id,
      coalesce(payload ->> 'name', 'Unknown Student'),
      nullif(payload ->> 'email', ''),
      nullif(payload ->> 'phone', ''),
      coalesce(payload ->> 'level', 'UG'),
      nullif(payload ->> 'dob', '')::date,
      coalesce(payload ->> 'program', 'Unassigned Program'),
      nullif(payload ->> 'department', ''),
      greatest(1, least(8, coalesce((payload ->> 'semester')::integer, 1))),
      actor_id,
      actor_id
    )
    on conflict (enrollment_id) do update
    set auth_user_id = coalesce(excluded.auth_user_id, public.student_profiles.auth_user_id),
        full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        level = excluded.level,
        dob = excluded.dob,
        program = excluded.program,
        department = excluded.department,
        current_semester = excluded.current_semester,
        updated_by = actor_id
    returning id into student_profile_uuid;
  else
    update public.student_profiles
    set auth_user_id = coalesce(payload_auth_user_id, auth_user_id),
        enrollment_id = payload_enrollment_id,
        full_name = coalesce(payload ->> 'name', full_name),
        email = coalesce(nullif(payload ->> 'email', ''), email),
        phone = coalesce(nullif(payload ->> 'phone', ''), phone),
        level = coalesce(payload ->> 'level', level),
        dob = coalesce(nullif(payload ->> 'dob', '')::date, dob),
        program = coalesce(payload ->> 'program', program),
        department = coalesce(nullif(payload ->> 'department', ''), department),
        current_semester = greatest(1, least(8, coalesce((payload ->> 'semester')::integer, current_semester))),
        updated_by = actor_id
    where id = student_profile_uuid;
  end if;

  insert into public.semester_records (
    id,
    student_profile_id,
    semester,
    study_hours,
    attendance,
    backlogs,
    previous_cgpa,
    sgpa,
    cgpa,
    percentage,
    division,
    category,
    rank,
    total_credits,
    created_by,
    updated_by
  )
  values (
    nullif(payload ->> 'id', '')::uuid,
    student_profile_uuid,
    greatest(1, least(8, coalesce((payload ->> 'semester')::integer, 1))),
    coalesce((payload ->> 'studyHours')::numeric, 0),
    coalesce((payload ->> 'attendance')::numeric, 0),
    coalesce((payload ->> 'backlogs')::integer, 0),
    coalesce((payload ->> 'previousCgpa')::numeric, 0),
    coalesce((payload ->> 'sgpa')::numeric, 0),
    coalesce((payload ->> 'cgpa')::numeric, 0),
    coalesce((payload ->> 'percentage')::numeric, 0),
    nullif(payload ->> 'division', ''),
    nullif(payload ->> 'category', ''),
    nullif(payload ->> 'rank', '')::integer,
    coalesce((payload ->> 'totalCredits')::integer, 0),
    actor_id,
    actor_id
  )
  on conflict (student_profile_id, semester) do update
  set study_hours = excluded.study_hours,
      attendance = excluded.attendance,
      backlogs = excluded.backlogs,
      previous_cgpa = excluded.previous_cgpa,
      sgpa = excluded.sgpa,
      cgpa = excluded.cgpa,
      percentage = excluded.percentage,
      division = excluded.division,
      category = excluded.category,
      rank = excluded.rank,
      total_credits = excluded.total_credits,
      updated_by = actor_id
  returning id into semester_record_uuid;

  delete from public.subject_results where semester_record_id = semester_record_uuid;

  if jsonb_typeof(payload -> 'subjects') = 'array' then
    for subject_item in select value from jsonb_array_elements(payload -> 'subjects')
    loop
      position_index := position_index + 1;
      insert into public.subject_results (
        semester_record_id,
        position,
        subject_name,
        credits,
        assignments,
        external_marks,
        total_marks,
        final_score,
        grade,
        grade_points,
        status_label
      )
      values (
        semester_record_uuid,
        position_index,
        coalesce(subject_item ->> 'subject', 'Unnamed Subject'),
        coalesce((subject_item ->> 'credits')::integer, 4),
        coalesce((subject_item ->> 'assignments')::numeric, 0),
        coalesce((subject_item ->> 'external')::numeric, 0),
        coalesce((subject_item ->> 'total')::numeric, 0),
        coalesce((subject_item ->> 'finalScore')::numeric, coalesce((subject_item ->> 'total')::numeric, 0)),
        nullif(subject_item ->> 'grade', ''),
        coalesce((subject_item ->> 'points')::numeric, 0),
        nullif(subject_item ->> 'label', '')
      );
    end loop;
  end if;

  if payload_auth_user_id is not null then
    update public.profiles
    set linked_student_profile_id = student_profile_uuid
    where id = payload_auth_user_id;
  end if;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, details)
  values (
    actor_id,
    'upsert',
    'semester_record',
    semester_record_uuid,
    jsonb_build_object('enrollmentId', payload_enrollment_id, 'semester', payload ->> 'semester')
  );

  return semester_record_uuid;
end;
$$;

create or replace function public.delete_student_record(record_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
begin
  if not public.can_manage_students() then
    raise exception 'You are not allowed to delete student records';
  end if;

  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, details)
  values (actor_id, 'delete', 'semester_record', record_id, '{}'::jsonb);

  delete from public.semester_records where id = record_id;
end;
$$;

create or replace function public.import_student_records(payload jsonb, source_filename text default 'students-data.csv')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  imported_count integer := 0;
begin
  if not public.can_manage_students() then
    raise exception 'You are not allowed to import student records';
  end if;

  if jsonb_typeof(payload) <> 'array' then
    raise exception 'payload must be a JSON array';
  end if;

  for item in select value from jsonb_array_elements(payload)
  loop
    perform public.upsert_student_record(item);
    imported_count := imported_count + 1;
  end loop;

  insert into public.import_batches (imported_by, source_filename, row_count)
  values (auth.uid(), coalesce(source_filename, 'students-data.csv'), imported_count);

  return imported_count;
end;
$$;

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.semester_records enable row level security;
alter table public.subject_results enable row level security;
alter table public.import_batches enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
for select
using (id = auth.uid() or public.current_app_role() = 'admin');

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles
for update
using (id = auth.uid() or public.current_app_role() = 'admin')
with check (id = auth.uid() or public.current_app_role() = 'admin');

drop policy if exists student_profiles_read_scoped on public.student_profiles;
create policy student_profiles_read_scoped on public.student_profiles
for select
using (
  public.current_app_role() in ('admin', 'teacher')
  or id = public.current_linked_student_profile_id()
  or auth_user_id = auth.uid()
);

drop policy if exists semester_records_read_scoped on public.semester_records;
create policy semester_records_read_scoped on public.semester_records
for select
using (
  public.current_app_role() in ('admin', 'teacher')
  or student_profile_id = public.current_linked_student_profile_id()
  or exists (
    select 1
    from public.student_profiles sp
    where sp.id = semester_records.student_profile_id
      and sp.auth_user_id = auth.uid()
  )
);

drop policy if exists subject_results_read_scoped on public.subject_results;
create policy subject_results_read_scoped on public.subject_results
for select
using (
  public.current_app_role() in ('admin', 'teacher')
  or exists (
    select 1
    from public.semester_records sr
    join public.student_profiles sp on sp.id = sr.student_profile_id
    where sr.id = subject_results.semester_record_id
      and (
        sp.id = public.current_linked_student_profile_id()
        or sp.auth_user_id = auth.uid()
      )
  )
);

drop policy if exists import_batches_admin_teacher_only on public.import_batches;
create policy import_batches_admin_teacher_only on public.import_batches
for select
using (public.current_app_role() in ('admin', 'teacher'));

drop policy if exists audit_logs_admin_only on public.audit_logs;
create policy audit_logs_admin_only on public.audit_logs
for select
using (public.current_app_role() = 'admin');

grant usage on schema public to anon, authenticated, service_role;
grant select, update on public.profiles to authenticated;
grant select on public.student_profiles, public.semester_records, public.subject_results to authenticated;
grant select on public.import_batches to authenticated;
grant execute on function public.ensure_profile() to authenticated;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.current_linked_student_profile_id() to authenticated;
grant execute on function public.can_manage_students() to authenticated;
grant execute on function public.get_accessible_student_records() to authenticated;
grant execute on function public.upsert_student_record(jsonb) to authenticated;
grant execute on function public.delete_student_record(uuid) to authenticated;
grant execute on function public.import_student_records(jsonb, text) to authenticated;
