import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  'https://obhispzgjmcupjacuhck.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGlzcHpnam1jdXBqYWN1aGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTE3MjIsImV4cCI6MjA5MDk4NzcyMn0.gEBLLzO7rjIBE-azcxajyRnAAc6jsfJRNn9MH682y6A'
);

async function test() {
  const { data: ests } = await supabase.from('establishments').select('id, name');
  console.log(`Checking ${ests.length} establishments...`);

  for (const est of ests) {
    const { count: qCount } = await supabase.from('queues').select('id', {count: 'exact', head: true}).eq('est_id', est.id);
    const { count: hCount } = await supabase.from('history').select('id', {count: 'exact', head: true}).eq('est_id', est.id);
    
    if (qCount > 0 || hCount > 0) {
      console.log(`Found data for: ${est.name} (${est.id}) -> Queues: ${qCount}, History: ${hCount}`);
    }
  }
}

test();
