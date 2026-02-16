const ftp = require('basic-ftp');

async function verifyDeployment() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔍 EMERGENCY DIAGNOSTIC - Verifying What\'s Actually on Server\n');
        console.log('🔌 Connecting to FTP...');

        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        // Check public_html
        console.log('📂 Checking /public_html/:\n');
        await client.cd('public_html');

        const files = await client.list();

        // Look specifically for index.html
        const indexFile = files.find(f => f.name === 'index.html');
        const assetsFolder = files.find(f => f.name === 'assets' && f.isDirectory);
        const htaccessFile = files.find(f => f.name === '.htaccess');
        const testPage = files.find(f => f.name === 'test-page.html');

        console.log('Critical Files Check:');
        console.log(`  index.html: ${indexFile ? `✅ EXISTS (${indexFile.size} bytes, modified ${indexFile.modifiedAt})` : '❌ MISSING'}`);
        console.log(`  assets/: ${assetsFolder ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`  .htaccess: ${htaccessFile ? `✅ EXISTS (${htaccessFile.size} bytes)` : '❌ MISSING'}`);
        console.log(`  test-page.html: ${testPage ? '✅ EXISTS' : '❌ MISSING'}`);

        if (indexFile) {
            console.log('\n📄 Downloading index.html to verify content...');
            await client.downloadTo('verify-index.html', 'index.html');
            const fs = require('fs');
            const content = fs.readFileSync('verify-index.html', 'utf8');
            console.log(`File size: ${content.length} bytes`);
            console.log('First 500 characters:');
            console.log('---');
            console.log(content.substring(0, 500));
            console.log('---\n');

            // Check if it's actually HTML
            if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
                console.log('✅ File appears to be valid HTML');
            } else {
                console.log('❌ WARNING: File does NOT appear to be HTML!');
            }

            fs.unlinkSync('verify-index.html');
        }

        // Check file permissions
        console.log('\n🔐 Checking file permissions...');
        if (indexFile) {
            const perms = indexFile.permissions || indexFile.mode;
            console.log(`  index.html permissions: ${perms}`);
        }

        // List all files in public_html
        console.log('\n📋 All files in /public_html/:');
        files.forEach(f => {
            if (f.name !== '.' && f.name !== '..') {
                const type = f.isDirectory ? '📁' : '📄';
                const size = f.isDirectory ? '' : ` (${f.size} bytes)`;
                console.log(`  ${type} ${f.name}${size}`);
            }
        });

        // Try to get specific file info
        console.log('\n🔍 Getting detailed file stats for index.html...');
        try {
            const result = await client.send('STAT index.html');
            console.log('STAT result:');
            console.log(result.message);
        } catch (e) {
            console.log('Could not get STAT:', e.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        client.close();
    }
}

verifyDeployment();
