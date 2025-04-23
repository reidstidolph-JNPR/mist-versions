'use strict';

// Import modules
const https = require('https');
const zlib = require('zlib');
const mistEnvironments = require('./environments.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      },
    };

    https
      .get(url, options, (res) => {
        let data = [];
        const encoding = res.headers['content-encoding'];

        // Handle response chunks
        res.on('data', (chunk) => {
          data.push(chunk);
        });

        // Handle end of response
        res.on('end', () => {
          try {
            let completedData = Buffer.concat(data);

            // Handle gzip or deflate encoding
            if (encoding === 'gzip') {
              zlib.gunzip(completedData, (err, decoded) => {
                if (err) {
                  return reject(new Error('Failed to unzip gzip data'));
                }
                resolve(JSON.parse(decoded.toString()));
              });
            } else if (encoding === 'deflate') {
              zlib.inflate(completedData, (err, decoded) => {
                if (err) {
                  return reject(new Error('Failed to inflate deflate data'));
                }
                resolve(JSON.parse(decoded.toString()));
              });
            } else {
              // No encoding, parse directly
              resolve(JSON.parse(completedData.toString()));
            }
          } catch (error) {
            reject(new Error('Failed to parse JSON'));
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function fetchEnvironmentData() {
  const versions = {};
  for (const [key, env] of Object.entries(mistEnvironments)) {
    try {
      const response = await fetchJson(`https://${env.url}/about.json`);
      const version = response.version;
      const time = response.time;
      const timestamp = new Date(time).getTime();

      if (!versions[version]) {
        versions[version] = {
          time: timestamp,
          environments: [`${key} (${env.shortName})`],
        };
      } else {
        versions[version].environments.push(`${key} (${env.shortName})`);
      }
    } catch (error) {
      console.error(`Error fetching data for ${key} (${env.shortName}):`, error.message);
    }
  }

  // Sort versions by timestamp
  const sortedVersions = Object.entries(versions).sort((a, b) => b[1].time - a[1].time);

  // Print sorted versions
  sortedVersions.forEach(([version, data]) => {
    console.log('----------------------------------------');
    console.log(
      `${version}\nBuild date: ${new Date(data.time).toDateString()}\n  - ${data.environments.join(
        '\n  - '
      )}`
    );
  });
}

fetchEnvironmentData();
