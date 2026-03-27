const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('--- Database Check ---');
  const { data, error } = await supabase.from('progress').select('*').limit(1);
  if (error) {
    console.error('Error fetching progress:', error.message);
  } else {
    console.log('Columns in progress table:', data.length > 0 ? Object.keys(data[0]) : 'No data in table to check columns');
    if (data.length > 0 && data[0].updated_at) {
      console.log('SUCCESS: updated_at column exists.');
    } else if (data.length > 0) {
      console.log('FAILURE: updated_at column is missing or null.');
    }
  }

  // Check for trigger
  const { data: trigger, error: triggerError } = await supabase.rpc('check_trigger_exists', { t_name: 'update_progress_updated_at' });
  if (triggerError) {
    // If RPC doesn't exist, try a raw query if possible, but rpc is safer to try
    console.log('Could not check trigger via RPC. Please ensure you ran the SQL I provided.');
  } else {
    console.log('Trigger update_progress_updated_at exists:', trigger);
  }
}

check();
