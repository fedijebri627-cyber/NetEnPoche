import { createBrowserClient as createSSRClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createSSRClient> | null = null

export function createBrowserClient() {
    if (!browserClient) {
        browserClient = createSSRClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }

    return browserClient
}

