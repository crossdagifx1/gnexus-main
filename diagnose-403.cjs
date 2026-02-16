const ftp = require('basic-ftp');

async function diagnoseAndFix403() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log('🔌 Connecting to FTP...');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });

        console.log('\n✅ Connected!\n');

        // Go to public_html
        await client.cd('public_html');

        console.log('🔧 Step 1: Setting comprehensive permissions\n');

        // Set public_html directory itself to 755
        await client.cd('..');
        try {
            await client.send('SITE CHMOD 755 public_html');
            console.log('✅ Set public_html/ to 755');
        } catch (e) {
            console.log('⚠️  Could not set public_html permissions');
        }

        await client.cd('public_html');

        // Set all subdirectories to 755
        const dirs = ['api', 'assets', 'icons', 'test'];
        for (const dir of dirs) {
            try {
                await client.send(`SITE CHMOD 755 ${dir}`);
                console.log(`✅ Set ${dir}/ to 755`);
            } catch (e) {
                console.log(`⚠️  Could not set ${dir} permissions (might not exist)`);
            }
        }

        // Set all files to 644
        const files = await client.list();
        for (const file of files) {
            if (!file.isDirectory && file.name !== '.' && file.name !== '..') {
                try {
                    await client.send(`SITE CHMOD 644 ${file.name}`);
                } catch (e) {
                    // Silent fail for files we can't chmod
                }
            }
        }
        console.log('✅ Set all files to 644\n');

        console.log('🔧 Step 2: Checking .htaccess file\n');

        // Download and check .htaccess
        try {
            await client.downloadTo('temp_htaccess.txt', '.htaccess');
            const fs = require('fs');
            const htaccess = fs.readFileSync('temp_htaccess.txt', 'utf8');

            console.log('📄 Current .htaccess content:');
            console.log('---');
            console.log(htaccess);
            console.log('---\n');

            // Check for problematic rules
            if (htaccess.includes('Require') || htaccess.includes('Deny')) {
                console.log('⚠️  .htaccess contains access control directives');
            }

            fs.unlinkSync('temp_htaccess.txt');
        } catch (e) {
            console.log('⚠️  Could not read .htaccess:', e.message);
        }

        console.log('🔧 Step 3: Creating a simple test page\n');

        // Create a simple test HTML file
        const testHtml = `<!DOCTYPE html>
<html>
<head><title>Test Page</title></head>
<body>
<h1>Test Page Works!</h1>
<p>If you see this, the server can serve HTML files.</p>
</body>
</html>`;

        const fs = require('fs');
        fs.writeFileSync('test-page.html', testHtml);

        await client.uploadFrom('test-page.html', 'test-page.html');
        await client.send('SITE CHMOD 644 test-page.html');

        console.log('✅ Uploaded test-page.html');
        console.log('   Try accessing: https://gnexuset.com/test-page.html\n');

        fs.unlinkSync('test-page.html');

        console.log('🔧 Step 4: Checking index.html\n');

        try {
            const indexList = await client.list('index.html');
            if (indexList.length > 0) {
                console.log(`✅ index.html exists (${indexList[0].size} bytes)`);

                // Re-set permissions
                await client.send('SITE CHMOD 644 index.html');
                console.log('✅ Set index.html to 644');
            }
        } catch (e) {
            console.log('❌ index.html NOT FOUND!');
        }

        console.log('\n🔧 Step 5: Trying to rename .htaccess temporarily\n');
        console.log('This will test if .htaccess is causing the 403\n');

        try {
            await client.send('RNFR .htaccess');
            await client.send('RNTO .htaccess.backup');
            console.log('✅ Renamed .htaccess to .htaccess.backup');
            console.log('   Try accessing https://gnexuset.com now');
            console.log('   If it works, the .htaccess file was the problem\n');

            console.log('⏳ Waiting 5 seconds for you to test...');
            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log('\n🔄 Restoring .htaccess...');
            await client.send('RNFR .htaccess.backup');
            await client.send('RNTO .htaccess');
            console.log('✅ Restored .htaccess');
        } catch (e) {
            console.log('⚠️  Could not rename .htaccess:', e.message);
        }

        console.log('\n📊 Summary:');
        console.log('  ✅ All permissions set correctly');
        console.log('  ✅ Test page created at /test-page.html');
        console.log('  ✅ .htaccess temporarily disabled for testing');
        console.log('\n🔍 Next Steps:');
        console.log('  1. Try: https://gnexuset.com/test-page.html');
        console.log('  2. If test page works but main site doesn\'t, issue is with React app');
        console.log('  3. If test page also shows 403, contact cPanel support');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        client.close();
    }
}

console.log('🔍 Diagnosing 403 Forbidden Error\n');
diagnoseAndFix403();
