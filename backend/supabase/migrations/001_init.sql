create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient', 'doctor', 'admin')),
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  specialization text not null,
  availability jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  dob date,
  gender text,
  blood_group text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete restrict,
  scheduled_at timestamptz not null,
  mode text not null check (mode in ('online', 'offline')),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  uploaded_by uuid not null references public.users(id) on delete cascade,
  file_url text not null,
  file_path text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null check (type in ('booking', 'pharmacy', 'message', 'system')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on public.users(role);
create index if not exists idx_doctors_specialization on public.doctors(specialization);
create index if not exists idx_appointments_doctor_scheduled on public.appointments(doctor_id, scheduled_at);
create index if not exists idx_appointments_patient_scheduled on public.appointments(patient_id, scheduled_at);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_medical_records_patient on public.medical_records(patient_id, created_at desc);
create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);

alter table public.users enable row level security;
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.notifications enable row level security;

drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users for select using (auth.uid() = id);

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users for update using (auth.uid() = id);

drop policy if exists doctors_public_read on public.doctors;
create policy doctors_public_read on public.doctors for select using (true);

drop policy if exists patients_self_read on public.patients;
create policy patients_self_read on public.patients for select using (auth.uid() = user_id);

drop policy if exists appointments_participant_read on public.appointments;
create policy appointments_participant_read on public.appointments for select using (
  exists(select 1 from public.patients p where p.id = patient_id and p.user_id = auth.uid())
  or exists(select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid())
);

drop policy if exists appointments_patient_insert on public.appointments;
create policy appointments_patient_insert on public.appointments for insert with check (
  exists(select 1 from public.patients p where p.id = patient_id and p.user_id = auth.uid())
);

drop policy if exists notifications_self_read on public.notifications;
create policy notifications_self_read on public.notifications for select using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('medical-records', 'medical-records', false)
on conflict (id) do nothing;
