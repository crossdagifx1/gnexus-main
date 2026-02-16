const ftp = require('basic-ftp');
const fs = require('fs');

async function deployZip() {
    const client = new ftp.Client(300000); // 5 mins
    client.ftp.verbose = true;

    try {
        console.log('🚀 UPLOADING ZIP DEPLOYMENT');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('Uploading dist.zip...');
        await client.uploadFrom('dist.zip', 'dist.zip');

        console.log('Uploading unzip_deploy.php...');
        await client.uploadFrom('unzip_deploy.php', 'unzip_deploy.php');

        console.log('✅ Upload Complete!');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        client.close();
    }
}

deployZip();
