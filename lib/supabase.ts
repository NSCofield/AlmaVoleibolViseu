import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://phveujcphuvpjrxsyjhx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M9aw6ZomvyT7Q1NYDuuXWA_6aprsByi';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
