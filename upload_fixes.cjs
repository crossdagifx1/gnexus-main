const ftp = require('basic-ftp');

async function uploadFixes() {
    const client = new ftp.Client(30000);
    client.ftp.verbose = true;
    try {
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        await client.uploadFrom('create_email_queue.php', 'create_email_queue.php');
        await client.uploadFrom('public/auth_routes.php', 'auth_routes.php');
        console.log('✅ Uploaded fixes');
    } finally {
        client.close();
    }
}
uploadFixes();
