const ftp = require('basic-ftp');

async function moveFilesToPublicHtml() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🔌 Connecting to FTP server...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        console.log('🔄 FIXING: Moving files to /public_html/ (correct web root)\n');

        // Get list of files in root
        const files = await client.list();

        // Filter out directories and system files we don't want to move
        const filesToMove = files.filter(f => {
            if (f.name === '.' || f.name === '..') return false;
            if (f.name === 'public_html') return false; // Don't move the public_html directory itself
            if (f.name === '.ftpquota') return false; // System file
            if (f.name.startsWith('etc')) return false; // System directories
            if (f.name.startsWith('mail')) return false;
            return true;
        });

        console.log(`Found ${filesToMove.length} items to move to /public_html/\n`);

        let moved = 0;
        let errors = 0;

        for (const file of filesToMove) {
            try {
                const sourcePath = file.name;
                const destPath = `public_html/${file.name}`;

                console.log(`📦 Moving ${file.name} to public_html/`);

                // Use RNFR/RNTO for moving
                const result = await client.send(`RNFR ${sourcePath}`);
                if (result.code === 350) {
                    const result2 = await client.send(`RNTO ${destPath}`);
                    if (result2.code === 250) {
                        console.log(`✅ Moved ${file.name}`);
                        moved++;
                    } else {
                        console.log(`⚠️  Could not move ${file.name}: ${result2.message}`);
                        errors++;
                    }
                }
            } catch (error) {
                console.log(`⚠️  Error moving ${file.name}: ${error.message}`);
                errors++;
            }
        }

        console.log(`\n📊 Results:`);
        console.log(`  ✅ Moved: ${moved} items`);
        console.log(`  ❌ Errors: ${errors}`);

        // Verify public_html contents
        console.log('\n🔍 Verifying /public_html/ directory:');
        await client.cd('public_html');
        const publicHtmlFiles = await client.list();

        const hasIndexHtml = publicHtmlFiles.some(f => f.name === 'index.html');
        const hasAssets = publicHtmlFiles.some(f => f.name === 'assets');
        const hasHtaccess = publicHtmlFiles.some(f => f.name === '.htaccess');

        console.log(`  ${hasIndexHtml ? '✅' : '❌'} index.html`);
        console.log(`  ${hasAssets ? '✅' : '❌'} assets/`);
        console.log(`  ${hasHtaccess ? '✅' : '❌'} .htaccess`);

        if (hasIndexHtml && hasAssets && hasHtaccess) {
            console.log('\n✅ SUCCESS! Files are now in correct location');
            console.log('🌐 Site should now be accessible at https://gnexuset.com');
        } else {
            console.log('\n⚠️  Some expected files are missing');
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
        console.log('\n🔌 Disconnected');
    }
}

console.log('🚀 Move Files to Correct Web Root (/public_html/)\n');
console.log('In cPanel, the web root is /public_html/, not /\n');
moveFilesToPublicHtml();
