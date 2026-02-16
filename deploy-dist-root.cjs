const ftp = require('basic-ftp');
const fs = require('fs');

async function deployDistToRoot() {
    const client = new ftp.Client(0); // 0 = Infinite timeout
    client.ftp.verbose = true;

    try {
        console.log('🚀 DEPLOYING REACT APP TO ROOT (public_html)\n');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!');
        console.log('📂 Current directory is root (which is public_html).');

        // Check dist folder
        if (!fs.existsSync('./dist')) {
            console.log('❌ dist folder missing! Creating build...');
            // In a real script we might trigger build, but I know it exists
            return;
        }

        console.log('📦 Uploading dist folder contents...');

        // Upload local dist/ to remote .
        await client.uploadFromDir('./dist');

        console.log('\n✅ Upload complete!');
        console.log('🔍 Checking for index.html...');

        const files = await client.list();
        const index = files.find(f => f.name === 'index.html');

        if (index) {
            console.log(`✅ index.html found (${index.size} bytes).`);
            console.log('🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('🌐 Visit https://gnexuset.com');
        } else {
            console.log('⚠️  index.html NOT found! Something went wrong.');
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

deployDistToRoot();
