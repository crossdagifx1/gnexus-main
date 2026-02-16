const ftp = require('basic-ftp');

async function fixDeployment() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔌 Connecting to FTP server...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('✅ Connected!\n');

        // List current directory
        console.log('📂 Current directory contents:');
        const list = await client.list();
        list.forEach(item => {
            console.log(`  ${item.isDirectory ? '📁' : '📄'} ${item.name} (${item.size} bytes)`);
        });

        console.log('\n🔍 Checking for nested public_html directory...');

        // Check if there's a nested public_html
        const hasPublicHtml = list.some(item => item.name === 'public_html' && item.isDirectory);

        if (hasPublicHtml) {
            console.log('⚠️  Found nested public_html directory!');
            console.log('📋 Listing contents of nested directory:');

            await client.cd('public_html');
            const nestedList = await client.list();
            nestedList.forEach(item => {
                console.log(`  ${item.isDirectory ? '📁' : '📄'} ${item.name}`);
            });

            // Move back to root
            await client.cd('..');

            console.log('\n🔄 Fix strategy:');
            console.log('  1. The files are currently in: /public_html/');
            console.log('  2. They should be in: / (root)');
            console.log('  3. Recommendation: Use cPanel File Manager to move files manually');
            console.log('     OR wait for corrected workflow to redeploy');

        } else {
            console.log('✅ No nested public_html found.');
            console.log('📂 Files are in correct location.');
            console.log('\n📋 Current files:');
            list.forEach(item => {
                console.log(`  ${item.name}`);
            });
        }

    } catch (error) {
        console.error('❌ FTP Error:', error.message);
    } finally {
        client.close();
    }
}

console.log('🚀 G-Nexus Deployment Diagnostic Tool\n');
fixDeployment();
