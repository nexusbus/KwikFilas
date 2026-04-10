import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://obhispzgjmcupjacuhck.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGlzcHpnam1jdXBqYWN1aGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTE3MjIsImV4cCI6MjA5MDk4NzcyMn0.gEBLLzO7rjIBE-azcxajyRnAAc6jsfJRNn9MH682y6A'
);

async function checkSchema() {
  // We can try to get one row to see columns, or use a select * on an empty table?
  // Supabase doesn't have a direct "describe table" for anon key usually, but we can try:
  const { data, error } = await supabase.from('history').select('*').limit(1);
  console.log("History columns sample result:", data);
  if (error) console.log("Error fetching history:", error);
  
  if (data) {
      // Even if empty, let's try to find any existing rows across all history
      const { data: allH } = await supabase.from('history').select('*').limit(1);
      console.log("Found any history row?", allH);
  }
}

checkSchema();
