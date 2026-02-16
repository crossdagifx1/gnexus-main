const ftp = require('basic-ftp');

async function forceRedeployIndex() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🚀 FORCE REDEPLOY - Replacing index.html with React build\n');
        console.log('🔌 Connecting...');

        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        await client.cd('public_html');
        console.log('✅ Connected to /public_html/\n');

        // Delete old index.html
        console.log('🗑️  Deleting old index.html...');
        try {
            await client.remove('index.html');
            console.log('✅ Old index.html deleted');
        } catch (e) {
            console.log('⚠️  Could not delete:', e.message);
        }

        // Upload new index.html
        console.log('\n📤 Uploading new React build index.html...');
        await client.uploadFrom('dist/index.html', 'index.html');
        console.log('✅ Uploaded!');

        // Set permissions
        await client.send('SITE CHMOD 644 index.html');
        console.log('✅ Permissions set to 644');

        // Verify
        console.log('\n🔍 Verifying...');
        const files = await client.list();
        const index = files.find(f => f.name === 'index.html');

        if (index) {
            console.log(`✅ index.html exists: ${index.size} bytes`);

            if (index.size > 10000) {
                console.log('✅ File size looks correct for React build!');
            } else {
                console.log('⚠️  WARNING: File is too small!');
            }
        }

        console.log('\n🌐 Site should now work at https://gnexuset.com');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.close();
    }
}

forceRedeployIndex();
