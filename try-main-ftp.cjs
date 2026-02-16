const ftp = require('basic-ftp');

async function tryMainAccount() {
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🔐 ATTEMPTING MAIN ACCOUNT LOGIN (gnexusqa)\n');

        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnexusqa', // Main cPanel user
            password: 'dAgi143100', // Trying same password
            secure: false
        });

        console.log('✅ SUCCESS! Connected as main user "gnexusqa"');
        console.log('📂 listing root directories...\n');

        const files = await client.list();
        files.forEach(f => {
            console.log(`  ${f.isDirectory ? '📁' : '📄'} ${f.name}`);
        });

        // Check for public_html
        const publicHtml = files.find(f => f.name === 'public_html');
        if (publicHtml) {
            console.log('\n✅ Found /public_html (This is the real web root!)');

            // Upload test file
            const fs = require('fs');
            fs.writeFileSync('test_main_root.html', '<h1>Main cPanel Root Accessible!</h1>');
            await client.uploadFrom('test_main_root.html', 'public_html/test_main_root.html');
            console.log('✅ Uploaded test_main_root.html to /public_html/');
            fs.unlinkSync('test_main_root.html');

            console.log('\n🔍 Check https://gnexuset.com/test_main_root.html');
        }

    } catch (error) {
        console.log('❌ Login failed as gnexusqa:', error.message);
        if (error.code === 530) {
            console.log('   (Password incorrect or user does not exist)');
        }
    } finally {
        client.close();
    }
}

tryMainAccount();
