const { readFileSync } = require('fs');
const https = require('https');

// Read the fixed workflow files
const productionWorkflow = readFileSync('.github/workflows/deploy-production.yml', 'utf8');
const testWorkflow = readFileSync('.github/workflows/deploy-test.yml', 'utf8');

// GitHub API helper function
function updateFileOnGitHub(path, content, message, branch) {
    return new Promise((resolve, reject) => {
        // First, get the file SHA (required for updates)
        const getOptions = {
            hostname: 'api.github.com',
            path: `/repos/crossdagifx1/gnexus-main/contents/${path}?ref=${branch}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Node.js',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
        };

        const getReq = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.log('GET response:', data);
                    reject(new Error(`Failed to get file: ${res.statusCode}`));
                    return;
                }

                const fileData = JSON.parse(data);
                const sha = fileData.sha;

                // Now update the file
                const updateData = JSON.stringify({
                    message,
                    content: Buffer.from(content).toString('base64'),
                    sha,
                    branch
                });

                const putOptions = {
                    hostname: 'api.github.com',
                    path: `/repos/crossdagifx1/gnexus-main/contents/${path}`,
                    method: 'PUT',
                    headers: {
                        'User-Agent': 'Node.js',
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Content-Length': updateData.length
                    }
                };

                const putReq = https.request(putOptions, (putRes) => {
                    let putData = '';
                    putRes.on('data', chunk => putData += chunk);
                    putRes.on('end', () => {
                        if (putRes.statusCode === 200 || putRes.statusCode === 201) {
                            console.log(`✅ Updated ${path} on ${branch} branch`);
                            resolve();
                        } else {
                            console.log('PUT response:', putData);
                            reject(new Error(`Failed to update file: ${putRes.statusCode}`));
                        }
                    });
                });

                putReq.on('error', reject);
                putReq.write(updateData);
                putReq.end();
            });
        });

        getReq.on('error', reject);
        getReq.end();
    });
}

// Get GitHub token from gh CLI
const { execSync } = require('child_process');
let token;
try {
    token = execSync('gh auth token', { encoding: 'utf8' }).trim();
    process.env.GITHUB_TOKEN = token;
} catch (error) {
    console.error('Failed to get GitHub token. Make sure gh CLI is authenticated.');
    process.exit(1);
}

// Update both workflow files on both branches
async function updateWorkflows() {
    try {
        console.log('🔄 Updating workflow files via GitHub API...\n');

        // Update main branch
        await updateFileOnGitHub(
            '.github/workflows/deploy-production.yml',
            productionWorkflow,
            'fix: correct FTP deployment directory for production',
            'main'
        );

        await updateFileOnGitHub(
            '.github/workflows/deploy-test.yml',
            testWorkflow,
            'fix: correct FTP deployment directory for test',
            'main'
        );

        // Update develop branch
        await updateFileOnGitHub(
            '.github/workflows/deploy-production.yml',
            productionWorkflow,
            'fix: correct FTP deployment directory for production',
            'develop'
        );

        await updateFileOnGitHub(
            '.github/workflows/deploy-test.yml',
            testWorkflow,
            'fix: correct FTP deployment directory for test',
            'develop'
        );

        console.log('\n✅ All workflow files updated successfully!');
        console.log('🚀 GitHub Actions will now redeploy with correct paths.');
        console.log('\n📊 Monitor at: https://github.com/crossdagifx1/gnexus-main/actions');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateWorkflows();
