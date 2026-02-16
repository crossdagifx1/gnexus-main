const ftp = require('basic-ftp');

async function uploadMigration() {
    const client = new ftp.Client(30000);
    client.ftp.verbose = true;
    try {
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        await client.uploadFrom('add_token_column.php', 'add_token_column.php');
    } finally {
        client.close();
    }
}
uploadMigration();
