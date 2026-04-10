// Edge Function: invite-user
// Invita a un nuevo usuario por email usando la Admin API de Supabase.
// Requiere service role key — NUNCA exponer en el frontend.
// El caller debe ser admin (verificado via JWT + profiles table).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ROLES = ['admin', 'encargado', 'trabajador'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, apikey, x-client-info',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

Deno.serve(async (req: Request) => {
  // Responder al preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405);
  }

  // Leer JWT del caller
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'No autorizado' }, 401);
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
    return json({ error: 'Token inválido' }, 401);
  }

  // Verificar que el caller es admin en la tabla profiles
  const { data: callerProfile, error: profileError } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', callerData.user.id)
    .single();

  if (profileError || !callerProfile || callerProfile.role !== 'admin') {
    return json({ error: 'Sin permisos para invitar usuarios' }, 403);
  }

  // Parsear body
  let email: string, name: string, role: string;
  try {
    const body = await req.json();
    email = body.email;
    name = body.name;
    role = body.role ?? 'trabajador';
  } catch {
    return json({ error: 'Body inválido' }, 400);
  }

  if (!email || !name) {
    return json({ error: 'email y name son requeridos' }, 400);
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return json({ error: 'Rol inválido' }, 400);
  }

  // Enviar invitación
  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      data: { name, role },
      redirectTo: 'https://app.trailerburger.mx/auth/callback',
    }
  );

  if (inviteError) {
    return json({ error: inviteError.message }, 400);
  }

  // Crear perfil con service role — el trigger puede fallar silenciosamente
  await adminClient
    .from('profiles')
    .upsert({ id: inviteData.user.id, name, role }, { onConflict: 'id' });

  return json({ success: true });
});
