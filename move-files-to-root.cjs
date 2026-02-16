const ftp = require('basic-ftp');

async function moveFilesToRoot() {
    const client = new ftp.Client();
    client.ftp.verbose = false; // Less verbose for cleaner output

    try {
        console.log('🔌 Connecting to FTP server...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        console.log('📋 Step 1: Listing files in /public_html/');
        await client.cd('public_html');
        const files = await client.list();

        console.log(`Found ${files.length} items to move\n`);

        console.log('⚠️  CRITICAL: This will overwrite existing files in root!');
        console.log('Files to be moved include:');
        files.slice(0, 10).forEach(f => console.log(`  - ${f.name}`));
        if (files.length > 10) console.log(`  ... and ${files.length - 10} more`);

        console.log('\n🔄 Step 2: Moving files from /public_html/ to / (root)');

        // Go back to root
        await client.cd('..');

        // Move each file/directory
        let moved = 0;
        let skipped = 0;

        for (const file of files) {
            try {
                const sourcePath = `public_html/${file.name}`;
                const destPath = file.name;

                // Skip . and .. entries
                if (file.name === '.' || file.name === '..') {
                    continue;
                }

                // For the /test directory, skip it (it's correct)
                if (file.name === 'test') {
                    console.log(`⏭️  Skipping ${file.name} (already in correct location)`);
                    skipped++;
                    continue;
                }

                console.log(`📦 Moving ${file.name}...`);

                // FTP doesn't have a native move command, we need to use RNFR/RNTO
                const result = await client.send(`RNFR ${sourcePath}`);
                if (result.code === 350) {
                    const result2 = await client.send(`RNTO ${destPath}`);
                    if (result2.code === 250) {
                        console.log(`✅ Moved ${file.name}`);
                        moved++;
                    } else {
                        console.log(`⚠️  Could not move ${file.name}: ${result2.message}`);
                        skipped++;
                    }
                }

            } catch (error) {
                console.log(`⚠️  Error moving ${file.name}: ${error.message}`);
                skipped++;
            }
        }

        console.log(`\n📊 Results:`);
        console.log(`  ✅ Moved: ${moved} files/folders`);
        console.log(`  ⏭️  Skipped: ${skipped} items`);

        console.log('\n🔍 Step 3: Verifying root directory');
        await client.cd('/');
        const rootFiles = await client.list();

        const hasIndexHtml = rootFiles.some(f => f.name === 'index.html');
        const hasAssets = rootFiles.some(f => f.name === 'assets');

        if (hasIndexHtml && hasAssets) {
            console.log('✅ SUCCESS! Site files are now in root directory');
            console.log('🌐 Your site should now be accessible at');
            console.log('   https://gnexuset.com');
        } else {
            console.log('⚠️  Warning: Expected files not found in root');
        }

        // Check if public_html is empty now
        console.log('\n🗑️  Step 4: Checking /public_html/ directory');
        await client.cd('public_html');
        const remaining = await client.list();
        const actualRemaining = remaining.filter(f => f.name !== '.' && f.name !== '..');

        if (actualRemaining.length === 0) {
            console.log('✅ /public_html/ is now empty (can be deleted later)');
        } else {
            console.log(`⚠️  ${actualRemaining.length} items still remain in /public_html/`);
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
        console.error(error);
    } finally {
        client.close();
        console.log('\n🔌 Disconnected from FTP');
    }
}

console.log('🚀 G-Nexus - Fix Deployment Script\n');
console.log('This script will move files from /public_html/ to / (root)\n');

moveFilesToRoot();
