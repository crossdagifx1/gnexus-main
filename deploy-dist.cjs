const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function deployDistFolder() {
    const client = new ftp.Client();
    client.ftp.verbose = false; // Less verbose

    try {
        console.log('🚀 Deploy React Build to cPanel\n');
        console.log('🔌 Connecting to FTP...');

        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        // Navigate to public_html
        await client.cd('public_html');
        console.log('📂 In /public_html/\n');

        // Check if dist folder exists
        const distPath = './dist';
        if (!fs.existsSync(distPath)) {
            console.log('❌ dist/ folder not found!');
            console.log('Please run: npm run build');
            return;
        }

        console.log('📦 Uploading dist/ folder contents...\n');

        // Upload everything from dist to public_html
        await client.uploadFromDir(distPath);

        console.log('\n✅ Upload complete!');

        // Verify critical files
        console.log('\n🔍 Verifying deployment...');
        const files = await client.list();

        const hasIndex = files.some(f => f.name === 'index.html');
        const hasAssets = files.some(f => f.name === 'assets');

        console.log(`  ${hasIndex ? '✅' : '❌'} index.html`);
        console.log(`  ${hasAssets ? '✅' : '❌'} assets/`);

        if (hasIndex && hasAssets) {
            console.log('\n🎉 SUCCESS! Site deployed!');
            console.log('🌐 Visit: https://gnexuset.com');
        } else {
            console.log('\n⚠️  Warning: Some files might be missing');
        }

    } catch (error) {
        console.error('❌ Deployment Error:', error.message);
    } finally {
        client.close();
    }
}

deployDistFolder();
