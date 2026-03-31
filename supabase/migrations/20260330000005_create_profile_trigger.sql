-- Trigger que crea automáticamente el perfil cuando se registra un usuario
-- Aplica a cualquier método de creación: app, dashboard de Supabase, SQL, etc.

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
    -- El primer usuario registrado es admin; los demás son trabajadores
    case
      when not exists (select 1 from public.profiles) then 'admin'::user_role
      else 'trabajador'::user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
