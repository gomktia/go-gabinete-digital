
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

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const users = [
    { email: 'vereador@teste.com', password: '123456', role: 'vereador', name: 'Vereador Demo' },
    { email: 'assessor@teste.com', password: '123456', role: 'assessor', name: 'Assessor Demo' },
    { email: 'admin@teste.com', password: '123456', role: 'admin', name: 'Admin Demo' }
];

async function seedUsers() {
    console.log('Starting user seeding...');

    for (const user of users) {
        console.log(`Processing ${user.email}...`);

        // 1. Check if user exists
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
            console.error('Error listing users:', listError);
            continue;
        }

        let userId = existingUsers.users.find(u => u.email === user.email)?.id;

        if (!userId) {
            // Create user
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: user.password,
                email_confirm: true,
                user_metadata: { full_name: user.name }
            });

            if (error) {
                console.error(`Error creating ${user.email}:`, error.message);
                continue;
            }
            userId = data.user.id;
            console.log(`Created user ${user.email}`);

            // Wait a bit for the trigger to run
            await new Promise(r => setTimeout(r, 2000));
        } else {
            console.log(`User ${user.email} already exists.`);
            // If user exists, we might need to reset password or ensure profile exists
            // but for now assume if exists, it's fine or we update profile below
        }

        // 2. Update Profile Role (since the trigger defaults to 'vereador')
        if (user.role !== 'vereador') {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: user.role })
                .eq('id', userId);

            if (updateError) {
                console.error(`Error updating role for ${user.email}:`, updateError.message);
            } else {
                console.log(`Updated role for ${user.email} to ${user.role}`);
            }
        }
    }

    console.log('Seeding complete.');
}

seedUsers();
