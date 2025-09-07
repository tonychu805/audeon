import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Test basic connection
async function test() {
  try {
    console.log('Testing connection...');
    
    // Try to check what tables are available
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.log('Error checking tables:', error);
    } else {
      console.log('Available tables:', data);
    }
    
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

test();