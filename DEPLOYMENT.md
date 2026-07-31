# Deploying the client

`pnpm build` emits `dist/`: one `index.html` plus content-hashed `.js`/`.css`
assets. Two rules make a deploy safe for people who already have the app open.

## 1. Never cache `index.html`

`index.html` is the only file whose name does not change between builds, and it
is the file that names every other one. A browser holding yesterday's
`index.html` asks for yesterday's `main.<hash>.js` — which this deploy deleted —
and the app cannot start.

```nginx
location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
    expires off;
}

location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

`no-cache` still lets the browser keep a copy; it just has to revalidate before
using it, which is what a content-hashed asset set is designed for. The hashed
files can be cached forever precisely because a new build gives them new names.

Check what you are actually serving before assuming this is set:

```bash
curl -sI https://<host>/index.html | grep -i cache-control
```

## 2. Keep the previous build's assets

Even with correct headers, a tab that was opened before the deploy is running the
old JS, and that JS asks for its own lazily-loaded chunks by name. If the deploy
replaced `dist/` wholesale, those chunks are gone and the next modal or route the
reader opens fails.

Deploy by **overlaying** onto the existing directory rather than replacing it,
and prune assets older than a release or two on a separate schedule:

```bash
rsync -a --delete-after --exclude='*.js' --exclude='*.css' dist/ /var/www/chief/
rsync -a dist/ /var/www/chief/
```

The first pass syncs `index.html` and removes anything stale that is not a hashed
asset; the second adds this build's assets without touching the previous ones.

## What the app does when this still goes wrong

`src/utils/chunkRecovery/` is the safety net, not the fix. A failed chunk load is
recognised and answered with a single reload, rate-limited to once every ten
seconds per tab so a genuinely broken deploy cannot spin. Every `React.lazy` call
goes through `chunkGuard`, and the router's own route chunks are caught by the
root `errorComponent`.

It reloads the page, so anything unsaved is lost. That is why the two rules above
matter: the safety net should effectively never fire.
