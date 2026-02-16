const ftp = require('basic-ftp');
const fs = require('fs');

async function findDocumentRoot() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🕵️ BRUTE FORCE ROOT DISCOVERY\n');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!\n');

        // 1. List all directories
        const files = await client.list();
        const dirs = files.filter(f => f.isDirectory && f.name !== '.' && f.name !== '..').map(f => f.name);
        dirs.push('.'); // Add root to the list

        console.log(`Found directories to test: ${dirs.join(', ')}\n`);

        const folderMap = {};

        // 2. Upload unique test file to each
        for (const dir of dirs) {
            try {
                const uniqueContent = `<html><body><h1>FOUND IT!</h1><p>Document Root is: <strong>${dir}</strong></p></body></html>`;
                const fileName = `test_location.html`;

                fs.writeFileSync(fileName, uniqueContent);

                let uploadPath = fileName;
                if (dir !== '.') {
                    uploadPath = `${dir}/${fileName}`;
                }

                console.log(`📤 Uploading to ${dir}...`);
                await client.uploadFrom(fileName, uploadPath);

                // Ensure perm
                await client.send(`SITE CHMOD 644 ${uploadPath}`);

                folderMap[dir] = true;

            } catch (err) {
                console.log(`❌ Failed to upload to ${dir}: ${err.message}`);
            }
        }

        fs.unlinkSync('test_location.html');

        console.log('\n✅ Uploads complete.');
        console.log('🔍 Now check: https://gnexuset.com/test_location.html');
        console.log('The page will tell you which folder is the root!');

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

findDocumentRoot();
