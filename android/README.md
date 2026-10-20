# Sharpmonk for Android (Google Play)

This is a **Trusted Web Activity**: a small Android app that opens
https://sharpmonk.com full-screen in Chrome, with no browser bar. The app *is*
the website, so:

- **Web changes reach app users the moment you deploy.** There's no new app
  build for new exams, fixes or features.
- Rebuild the app only when something in `twa-manifest.json` changes: name,
  colours, icons, shortcuts, the share target, or the version for a store
  update.

Generated with Bubblewrap (`@bubblewrap/core` 1.25.0) from the site's web
manifest; `twa-manifest.json` is the source of truth. Package name:
**`com.sharpmonk.app`** (permanent once published).

## What the app gets from the site

- Install icon, splash screen and app shortcuts (long-press the icon: Exams,
  Resize, Signature, PDF).
- **Share target:** "Share → Sharpmonk" from the gallery, WhatsApp or Files
  sends photos and PDFs to `/share-target`, which the service worker
  (`public/sw.js`) hands to `/open`.
- Camera capture, offline use and the photo checks all come from the website
  itself.

## 1. Deploy the site first

The share target, `/open`, the maskable icons and (later) the asset links file
all need to be live on sharpmonk.com:

```bash
npm run deploy
```

## 2. Create your upload key (once)

```bash
keytool -genkeypair -v -keystore android/android.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

It asks for a password and your name. **Back the keystore and its password up
somewhere safe outside this folder.** `*.keystore` is gitignored. With Play
App Signing (the default) Google holds the real signing key, and a lost
upload key can be reset through Play support, but only with some delay.

## 3. Build the app bundle (.aab)

**Android Studio (simplest):** open the `android/` folder, let it sync (it
offers to install Android SDK 36; accept its licences), then *Build → Generate
Signed App Bundle / APK → Android App Bundle*. Choose `android.keystore`, alias
`upload`, build variant `release`. The bundle lands in
`android/app/release/app-release.aab`.

**Or the Bubblewrap CLI** (downloads its own JDK 17 and Android SDK on first
run):

```bash
cd android && npx @bubblewrap/cli@1.25.0 build
```

## 4. Publish on Play Console

1. Create a developer account at https://play.google.com/console ($25 once).
   New *personal* accounts must run a closed test with at least 12 testers for
   14 days before they can publish to production; organisation accounts skip
   that.
2. *Create app* → name "Sharpmonk", app, free.
3. Fill in the store listing and app content from `store/listing.md`, using the
   graphics in `store/`.
4. *Testing → Internal testing → Create release* → upload the `.aab`.
   Play App Signing is on by default; keep it on.

## 5. Link the app to the site (asset links)

Until this is done, the app opens with a thin browser address bar at the top.

1. Play Console → *Test and release → App integrity → App signing*. Copy the
   SHA-256 of the **App signing key certificate**, and of the **Upload key
   certificate** (for builds installed by hand).
2. Add both to `fingerprints` in `twa-manifest.json`:

   ```json
   "fingerprints": [
     { "name": "Play App Signing", "value": "AB:CD:…" },
     { "name": "Upload key", "value": "12:34:…" }
   ]
   ```

   For a local build before Play, the upload key's fingerprint is also shown by
   `keytool -list -v -keystore android/android.keystore -alias upload`.
3. Deploy the site. `scripts/assetlinks.mjs` runs before every build and
   writes https://sharpmonk.com/.well-known/assetlinks.json from that list.
4. Reopen the app: the address bar is gone. If it isn't, check the file with
   Google's tester at
   https://developers.google.com/digital-asset-links/tools/generator.

## Releasing an update

Most updates are just `npm run deploy`. For an app update: edit
`twa-manifest.json`, raise `appVersionCode` (and `appVersionName`), then
`cd android && npx @bubblewrap/cli@1.25.0 update` to regenerate the project,
and build and upload as above.
