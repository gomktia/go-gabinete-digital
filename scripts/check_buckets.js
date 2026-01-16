
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

async function checkBuckets() {
    console.log('Checking Storage Buckets...');
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
        return;
    }

    console.log('Existing Buckets:', buckets.map(b => b.name));

    const requiredBuckets = ['tramitacao', 'posts', 'avatars', 'cover_photos'];

    for (const bucket of requiredBuckets) {
        if (!buckets.find(b => b.name === bucket)) {
            console.log(`Creating bucket: ${bucket}...`);
            const { error: createError } = await supabase.storage.createBucket(bucket, {
                public: true // Assuming public for now
            });
            if (createError) console.error(`Error creating ${bucket}:`, createError.message);
            else console.log(`Created ${bucket}`);
        } else {
            console.log(`Bucket ${bucket} exists.`);
        }
    }
}

checkBuckets();
