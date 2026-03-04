import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knezlbcdbalnclbuyuwi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZXpsYmNkYmFsbmNsYnV5dXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MzcwMzUsImV4cCI6MjA4ODIxMzAzNX0.nnD1B1tfWtRJ8rwqGk3xx_RaYjts33XbdS-rlRA3E8M';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
