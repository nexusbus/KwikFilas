
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://obhispzgjmcupjacuhck.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGlzcHpnam1jdXBqYWN1aGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTE3MjIsImV4cCI6MjA5MDk4NzcyMn0.gEBLLzO7rjIBE-azcxajyRnAAc6jsfJRNn9MH682y6A';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('establishments')
    .select('admin_email, admin_password')
    .eq('role', 'super')
    .single();
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Credentials:', data);
  }
}

check();
