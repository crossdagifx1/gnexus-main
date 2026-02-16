const ftp = require('basic-ftp');

async function checkJail() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('⛓️ CHECKING FTP JAIL STATUS\n');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!');

        console.log('📂 Current dir: / (Root)');

        try {
            await client.cd('..');
            console.log('🔄 CD .. succeeded.');
            console.log('📂 Checking where we are...');
            const list = await client.list();
            console.log('Files here:', list.map(f => f.name).join(', '));

            if (list.some(f => f.name === 'public_html')) {
                console.log('🔓 WE ESCAPED! We can verify public_html exists here.');
            } else {
                console.log('🔒 Still seemingly inside the same jail or same directory structure.');
            }
        } catch (e) {
            console.log('🔒 CD .. Failed. We are definitely jailed.');
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

checkJail();
