const ftp = require('basic-ftp');
const fs = require('fs');

async function verifyNewRoot() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🔍 VERIFYING NEW FTP ACCESS\n');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!');

        console.log('📂 Listing files in root...');
        const files = await client.list();
        files.forEach(f => {
            console.log(`  ${f.isDirectory ? '📁' : '📄'} ${f.name} (${f.size}b)`);
        });

        // Validating if we are in the real public_html
        // If we see cgi-bin, or .well-known, it's a good sign of a real web root
        const looksLikeWebRoot = files.some(f => f.name === 'cgi-bin' || f.name === '.well-known');

        if (looksLikeWebRoot) {
            console.log('\n✅ This looks like the REAL web root!');
        } else {
            console.log('\n⚠️  Directory is empty or doesn\'t have standard web root folders. Proceeding anyway.');
        }

        // Upload a test file
        console.log('\nOut for a test drive: Uploading verification.html...');
        fs.writeFileSync('verification.html', '<h1>FTP FIXED!</h1>');
        await client.uploadFrom('verification.html', 'verification.html');
        await client.send('SITE CHMOD 644 verification.html');
        console.log('✅ Uploaded.');

        fs.unlinkSync('verification.html');

        console.log('\n👉 Readiness Check Complete. Starting Deployment...');

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

verifyNewRoot();
