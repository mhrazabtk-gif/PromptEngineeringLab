const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'prompt-engineering-lab.pages.dev';
const KEY = '0298ce5a3d9b4780b50aa3b664ae3532';
const KEY_LOCATION = `https://prompt-engineering-lab.pages.dev/0298ce5a3d9b4780b50aa3b664ae3532`;

const urlsFile = path.join(__dirname, 'urls.txt');
let urlList = [];

if (fs.existsSync(urlsFile)) {
    urlList = fs.readFileSync(urlsFile, 'utf8')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

if (urlList.length === 0) {
    console.log('No URLs to ping.');
    return;
}

const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
});

const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
};

const req = https.request(options, (res) => {
    console.log(`IndexNow statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('IndexNow Error:', error);
});

req.write(payload);
req.end();
