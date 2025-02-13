
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldgyssrtdddceisxkonm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZ3lzc3J0ZGRkY2Vpc3hrb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MDAxNTUsImV4cCI6MjA1NDk3NjE1NX0.F0Tf3_3ZPxmrszI-TwG1Xei_PLvr-3EgFnOxD_QOoe4';

export const supabase = createClient(supabaseUrl, supabaseKey);
