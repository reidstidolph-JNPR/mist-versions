# mist-versions

Web app that fetches and displays versions of various Mist cloud environments, grouped by version and sorted from newest to oldest.

Because the `manage.*.mist.com` APIs don't allow cross-origin browser requests (CORS), a small Node/Express backend proxies the requests server-side and serves the frontend.

## Usage

```
npm install
npm start
```

Then visit http://localhost:3000. Click **Refresh** to re-fetch the latest data.

## Run in a container

```
docker build -t mist-versions .
docker run --rm -p 3000:3000 mist-versions
```

Or with Docker Compose:

```
docker compose up --build
```

Then visit http://localhost:3000.

Environments are configured in [environments.json](environments.json).
