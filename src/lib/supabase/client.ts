import { createClient } from "@supabase/supabase-js";

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  return browserClient;
}
