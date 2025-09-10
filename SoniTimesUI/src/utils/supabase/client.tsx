import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Use the project ID and public anon key from the info file
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);