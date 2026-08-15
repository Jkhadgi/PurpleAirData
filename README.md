# Nepal Air Watch

A dashboard that shows **live PM2.5 / temperature / humidity** from every
PurpleAir sensor inside Nepal's bounding box. The PurpleAir API key is kept
server-side in a Netlify Function — it is never sent to the browser or
visible in page source.

## Deploy to Netlify

### Option A — drag & drop (fastest)
1. Go to https://app.netlify.com/drop
2. Drag the whole `nepal-air-watch` folder onto the page.
3. Once it's deployed, go to **Site settings → Environment variables** and add:
   - Key: `PURPLEAIR_API_KEY`
   - Value: your PurpleAir API key
4. Go to **Deploys → Trigger deploy → Deploy site** so the function picks up
   the new environment variable.
5. Visit your site — the dashboard now calls `/api/sensors`, which is
   handled by the function in `netlify/functions/sensors.js`.

### Option B — via Git (recommended for updates over time)
1. Push this folder to a GitHub repo (the `netlify.toml` and
   `netlify/functions/` folder need to be at the repo root).
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick
   the repo. Build command: none. Publish directory: `.`
3. Add the `PURPLEAIR_API_KEY` environment variable as in Option A, step 3.
4. Deploy.

## Why this keeps the key hidden

The browser never talks to PurpleAir directly. It calls `/api/sensors` on
your own Netlify site, which routes (via `netlify.toml`) to a serverless
function. That function reads `PURPLEAIR_API_KEY` from Netlify's environment
variables at request time, calls PurpleAir with it, and returns the JSON.
Serverless function source and environment variables are never shipped to
the browser, so the key stays server-side.

## Customizing

- **Bounding box**: edit `NEPAL_BBOX` in `netlify/functions/sensors.js`.
- **Refresh interval**: edit `REFRESH_MS` in `index.html`.
- **Fields shown**: edit `FIELDS` in `sensors.js` and the table markup in
  `index.html`'s `render()` function.

## Local testing (optional)

If you have the Netlify CLI installed:

```bash
npm install -g netlify-cli
cd nepal-air-watch
export PURPLEAIR_API_KEY=your-key-here
netlify dev
```

This serves the site and the function together at `http://localhost:8888`,
matching production behavior.
