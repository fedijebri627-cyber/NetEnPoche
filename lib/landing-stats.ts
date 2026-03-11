import { createClient } from '@supabase/supabase-js';

type LandingStats = {
  monthlyEntriesCount: number | null;
  usersCount: number | null;
};

let adminClient: ReturnType<typeof createClient> | null = null;

function getLandingAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceRoleKey || serviceRoleKey === anonKey) {
    return null;
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

export async function getLandingStats(): Promise<LandingStats> {
  const client = getLandingAdminClient();

  if (!client) {
    return {
      monthlyEntriesCount: null,
      usersCount: null,
    };
  }

  const [entriesResult, usersResult] = await Promise.all([
    client
      .from('monthly_entries')
      .select('*', { count: 'exact', head: true })
      .gt('ca_amount', 0),
    client
      .from('users')
      .select('*', { count: 'exact', head: true }),
  ]);

  return {
    monthlyEntriesCount: entriesResult.count ?? null,
    usersCount: usersResult.count ?? null,
  };
}

