const https = require('https');

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.error("ERROR: No API Key found.");
    process.exit(1);
}

console.log("Testing generation for key ending in:", apiKey.slice(-4));

function testModel(model) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`\n--- Testing ${model} ---`);
                console.log(`Status Code: ${res.statusCode}`);
                if (res.statusCode !== 200) {
                    console.log("Error Body:", body);
                } else {
                    console.log("Success!");
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error(`Error confirming ${model}:`, error);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    await testModel('gemini-flash-latest');
    // await testModel('gemini-2.0-flash');
}

run();
