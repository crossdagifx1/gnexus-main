const ftp = require('basic-ftp');

async function uploadDebug() {
    const client = new ftp.Client(30000);
    client.ftp.verbose = true;
    try {
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        await client.uploadFrom('debug_schema_standalone.php', 'debug_schema_standalone.php');
    } finally {
        client.close();
    }
}
uploadDebug();
