
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePassword() {
    console.log('Updating password for vereador@teste.com...');

    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return console.error(listError);

    const user = users.users.find(u => u.email === 'vereador@teste.com');
    if (user) {
        const { error } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: '123456', email_confirm: true }
        );
        if (error) console.error('Error updating password:', error);
        else console.log('Password updated successfully.');
    } else {
        console.log('User not found.');
    }
}

updatePassword();
