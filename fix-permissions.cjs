const ftp = require('basic-ftp');

async function fixPermissions() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔌 Connecting to FTP server...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        console.log('🔧 Setting permissions on files...\n');

        // Set permissions for index.html
        try {
            await client.send('SITE CHMOD 644 index.html');
            console.log('✅ Set index.html permissions to 644');
        } catch (e) {
            console.log('⚠️  Could not set index.html permissions');
        }

        // Set permissions for .htaccess
        try {
            await client.send('SITE CHMOD 644 .htaccess');
            console.log('✅ Set .htaccess permissions to 644');
        } catch (e) {
            console.log('⚠️  Could not set .htaccess permissions');
        }

        // Set permissions for assets folder
        try {
            await client.send('SITE CHMOD 755 assets');
            console.log('✅ Set assets/ permissions to 755');
        } catch (e) {
            console.log('⚠️  Could not set assets permissions');
        }

        // List files to check
        console.log('\n📋 Checking root directory:');
        const files = await client.list();
        files.forEach(f => {
            if (!f.name.startsWith('.') || f.name === '.htaccess') {
                console.log(`  ${f.isDirectory ? '📁' : '📄'} ${f.name}`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.close();
    }
}

console.log('🛡️ Fix File Permissions\n');
fixPermissions();
