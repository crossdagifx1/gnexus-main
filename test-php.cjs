const ftp = require('basic-ftp');
const fs = require('fs');

async function testPhpAndDisableHtaccess() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🧪 TESTING PHP AND DISABLING .HTACCESS\n');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!\n');

        // 1. Rename .htaccess
        console.log('🔧 Renaming .htaccess to .htaccess.bak...');
        try {
            await client.send('RNFR .htaccess');
            await client.send('RNTO .htaccess.bak');
            console.log('✅ Disabled .htaccess');
        } catch (e) {
            console.log('⚠️  Could not rename .htaccess (maybe doesn\'t exist)');
        }

        // 2. Create index.php
        console.log('\n📄 Creating index.php...');
        fs.writeFileSync('index.php', '<?php echo "<h1>PHP WORKS!</h1><p>The directory is correct.</p>"; ?>');
        await client.uploadFrom('index.php', 'index.php');
        await client.send('SITE CHMOD 644 index.php');
        console.log('✅ Uploaded index.php');

        console.log('\n🔍 Check https://gnexuset.com now.');
        console.log('If you see "PHP WORKS!", then the directory is correct but index.html was ignored.');

        fs.unlinkSync('index.php');

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

testPhpAndDisableHtaccess();
