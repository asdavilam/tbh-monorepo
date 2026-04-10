-- Actualiza el trigger de creación de perfil para leer el rol desde raw_user_meta_data.
-- Necesario para el flujo de invitación por email: el admin envía rol en metadata
-- y el trigger lo persiste correctamente en el perfil.

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'trabajador'::user_role
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
