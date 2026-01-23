
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple .env parser
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const url = env['VITE_SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY']; // Use service role for admin tasks

if (!url || !key) {
    console.error('Missing URL or Key');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    console.log('Testing connection to:', url);

    // Test Voters Table
    const { data: voters, error: votersError } = await supabase.from('voters').select('*').limit(5);
    if (votersError) {
        console.error('❌ Error fetching voters:', votersError.message);
    } else {
        console.log('✅ Voters table accessible. Count:', voters.length);
    }

    // Test Demands Table
    const { data: demands, error: demandsError } = await supabase.from('demands').select('*').limit(5);
    if (demandsError) {
        console.error('❌ Error fetching demands:', demandsError.message);
    } else {
        console.log('✅ Demands table accessible. Count:', demands.length);
    }

    // Test Visits Table
    const { data: visits, error: visitsError } = await supabase.from('demand_visits').select('*').limit(5);
    if (visitsError) {
        console.error('❌ Error fetching visits:', visitsError.message);
    } else {
        console.log('✅ Demand Visits table accessible. Count:', visits.length);
    }
}

testConnection();
