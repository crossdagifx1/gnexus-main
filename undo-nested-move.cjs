const ftp = require('basic-ftp');

async function moveBackToRoot() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🔌 Connecting to FTP...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected!\n');

        // 1. Check if we are in the root and see public_html
        const rootFiles = await client.list();
        const publicHtml = rootFiles.find(f => f.name === 'public_html' && f.isDirectory);

        if (!publicHtml) {
            console.log('❌ Could not find nested public_html directory!');
            console.log('Current files:', rootFiles.map(f => f.name).join(', '));
            return;
        }

        console.log('📂 Found nested public_html directory. Checking contents...\n');
        await client.cd('public_html');
        const filesToMove = await client.list();

        if (filesToMove.length === 0) {
            console.log('⚠️  public_html is empty.');
            return;
        }

        console.log(`Found ${filesToMove.length} items to move BACK to root.\n`);

        // 2. Move files back to root
        await client.cd('..'); // Go back to root

        for (const file of filesToMove) {
            if (file.name === '.' || file.name === '..') continue;

            try {
                const source = `public_html/${file.name}`;
                const dest = file.name;

                console.log(`📦 Moving ${file.name}...`);

                // Skip if destination is the same directory we are moving from (shouldn't happen but safety first)
                if (file.name === 'public_html') continue;

                await client.send(`RNFR ${source}`);
                const result = await client.send(`RNTO ${dest}`);

                if (result.code === 250) {
                    console.log(`✅ Moved ${file.name}`);
                } else {
                    console.log(`⚠️  Failed to move ${file.name}: ${result.message}`);
                }
            } catch (error) {
                console.log(`❌ Error moving ${file.name}: ${error.message}`);
            }
        }

        console.log('\n✅ Move complete.');

        // 3. Verify index.html in root
        const newRootFiles = await client.list();
        const hasIndex = newRootFiles.some(f => f.name === 'index.html');

        if (hasIndex) {
            console.log('🎉 SUCCESS! index.html is now in the root directory.');
        } else {
            console.log('⚠️  Warning: index.html still not found in root.');
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

moveBackToRoot();
