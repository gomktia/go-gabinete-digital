
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

async function checkFinanceBucket() {
    console.log('Checking Finance Bucket...');
    const bucketName = 'finance_receipts';

    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) return console.error(error);

    if (!buckets.find(b => b.name === bucketName)) {
        console.log(`Creating bucket: ${bucketName}...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB
        });
        if (createError) console.error(`Error creating ${bucketName}:`, createError.message);
        else console.log(`Created ${bucketName}`);
    } else {
        console.log(`Bucket ${bucketName} exists.`);
    }
}

checkFinanceBucket();
