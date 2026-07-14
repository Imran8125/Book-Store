const fs = require('fs');
const path = require('path');
const https = require('https');

const uploadDir = path.join(__dirname, 'Backend', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const images = {
  'classic.jpg': 'https://covers.openlibrary.org/b/id/12836248-L.jpg',
  'dystopian.jpg': 'https://covers.openlibrary.org/b/id/12843865-L.jpg',
  'fantasy.jpg': 'https://covers.openlibrary.org/b/id/13210344-L.jpg',
  'scifi.jpg': 'https://covers.openlibrary.org/b/id/12711698-L.jpg',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    function request(targetUrl) {
      https.get(targetUrl, options, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Follow redirect
          request(response.headers.location);
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => resolve());
          });
        } else {
          reject(new Error(`Failed to download: Status Code ${response.statusCode}`));
        }
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }

    request(url);
  });
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(uploadDir, filename);
    try {
      await download(url, dest);
      console.log(`Successfully downloaded ${filename}`);
    } catch (err) {
      console.error(`Failed to download ${filename}:`, err.message);
    }
  }
}

run();
