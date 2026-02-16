const ftp = require('basic-ftp');

async function uploadShellScript() {
    const client = new ftp.Client(30000);
    client.ftp.verbose = true;
    try {
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        await client.uploadFrom('unzip_shell.php', 'unzip_shell.php');
        console.log('✅ Uploaded unzip_shell.php');
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}
uploadShellScript();
