const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

async function deployChunked() {
    const client = new ftp.Client(300000); // 5 mins timeout
    client.ftp.verbose = true;

    try {
        console.log('🚀 STARTING ROBUST DEPLOYMENT');
        await client.access({
            host: 'ftp.gnexuset.com',
            user: 'gnex@gnexuset.com',
            password: 'dAgi143100',
            secure: false
        });
        console.log('✅ Connected');

        const localDir = './dist';

        // Recursive walk
        async function getFiles(dir) {
            const dirents = fs.readdirSync(dir, { withFileTypes: true });
            const files = await Promise.all(dirents.map((dirent) => {
                const res = path.resolve(dir, dirent.name);
                return dirent.isDirectory() ? getFiles(res) : res;
            }));
            return Array.prototype.concat(...files);
        }

        const allFiles = await getFiles(localDir);
        // Sort: upload index.html LAST
        allFiles.sort((a, b) => {
            if (a.includes('index.html')) return 1;
            if (b.includes('index.html')) return -1;
            return 0;
        });

        for (const file of allFiles) {
            const relPath = path.relative(localDir, file).replace(/\\/g, '/');
            const remotePath = relPath; // Root is public_html

            // Ensure dir exists
            const remoteDir = path.dirname(remotePath);
            if (remoteDir !== '.') {
                await client.ensureDir(remoteDir);
                client.cd('/'); // Go back to root
            }

            console.log(`Uploading ${relPath}...`);
            try {
                // Use stream for better reliability
                await client.uploadFrom(fs.createReadStream(file), remotePath);
            } catch (err) {
                console.error(`❌ Failed to upload ${relPath}: ${err.message}`);
                // Retry once
                try {
                    console.log(`Retrying ${relPath}...`);
                    await client.uploadFrom(fs.createReadStream(file), remotePath);
                } catch (retryErr) {
                    console.error(`❌ Retry failed: ${retryErr.message}`);
                    throw retryErr;
                }
            }
        }

        console.log('🎉 DEPLOYMENT COMPLETE');

    } catch (err) {
        console.error('❌ FATAL ERROR:', err);
    } finally {
        client.close();
    }
}

deployChunked();
