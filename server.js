'use strict';

const path = require('path');
const express = require('express');
const mistEnvironments = require('./environments.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache = null; // { expiresAt, payload }

async function fetchAbout(env) {
  const response = await fetch(`https://${env.url}/about.json`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function loadVersions() {
  const versions = {};
  const errors = [];

  await Promise.all(
    Object.entries(mistEnvironments).map(async ([key, env]) => {
      try {
        const about = await fetchAbout(env);
        const version = about.version;
        const timestamp = new Date(about.time).getTime();

        if (!versions[version]) {
          versions[version] = {
            time: timestamp,
            environments: [`${key} (${env.shortName})`],
          };
        } else {
          versions[version].environments.push(`${key} (${env.shortName})`);
        }
      } catch (error) {
        errors.push(`${key} (${env.shortName}): ${error.message}`);
      }
    })
  );

  const sortedVersions = Object.entries(versions).sort((a, b) => b[1].time - a[1].time);

  return { versions: sortedVersions, errors };
}

app.get('/api/versions', async (req, res) => {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return res.json(cache.payload);
  }

  const payload = await loadVersions();
  cache = { expiresAt: now + CACHE_TTL_MS, payload };
  res.json(payload);
});

app.listen(PORT, () => {
  console.log(`Mist versions app listening on http://localhost:${PORT}`);
});
