
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://upmfljjpskzjljxjirec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbWZsampwc2t6amxqeGppcmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NTc2NzAsImV4cCI6MjAyNjIzMzY3MH0.Ouhq7PL6LuAhvsuZ8Xh4OONg9K_89V1LoaGRpDVxZE4';

export const supabase = createClient(supabaseUrl, supabaseKey);
