// Edge Function: invite-user
// Invita a un nuevo usuario por email usando la Admin API de Supabase.
// Requiere service role key — NUNCA exponer en el frontend.
// El caller debe ser admin (verificado via JWT + profiles table).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ROLES = ['admin', 'encargado', 'trabajador'];

Deno.serve(async (req: Request) => {
  // Solo POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Leer JWT del caller
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Cliente admin (service role) para operaciones privilegiadas
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verificar que el caller está autenticado
  const jwt = authHeader.replace('Bearer ', '');
  const { data: callerData, error: callerError } = await adminClient.auth.getUser(jwt);
  if (callerError || !callerData.user) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verificar que el caller es admin en la tabla profiles
  const { data: callerProfile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', callerData.user.id)
    .single();

  if (profileError || !callerProfile || callerProfile.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Sin permisos para invitar usuarios' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parsear body
  let email: string, name: string, role: string;
  try {
    const body = await req.json();
    email = body.email;
    name = body.name;
    role = body.role ?? 'trabajador';
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validaciones básicas
  if (!email || !name) {
    return new Response(JSON.stringify({ error: 'email y name son requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return new Response(JSON.stringify({ error: 'Rol inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Enviar invitación
  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { name, role },
    redirectTo: 'https://tbh-inventory-app.vercel.app/auth/callback',
  });

  if (inviteError) {
    return new Response(JSON.stringify({ error: inviteError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
