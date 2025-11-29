export const config = { runtime: 'edge' };

export default async function handler() {
  const body = {
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
    PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || null,
    MP_has_token: Boolean(process.env.MP_ACCESS_TOKEN),
    MP_token_type: process.env.MP_ACCESS_TOKEN
      ? (process.env.MP_ACCESS_TOKEN.startsWith('TEST-') ? 'TEST' : (process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-') ? 'APP_USR' : 'UNKNOWN'))
      : 'NONE',
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
