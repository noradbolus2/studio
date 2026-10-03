# Founder OS Android app

This is the plain-local Expo Android companion for the Founder Command Center. It uses Firebase client configuration for cloud reads and is built remotely with Expo EAS from GitHub Actions.

## Local setup

```bash
cp .env.example .env
# Fill the EXPO_PUBLIC_FIREBASE_* values from Firebase Console → Project settings → Your apps
npm install
npx expo start
```

The Firebase web config values are client-side values. Do not place Firebase service-account JSON, payment secrets, LLM keys, or `service_role` keys in this file or in the APK.

## GitHub APK build

Add these repository Actions secrets:

- `EXPO_TOKEN`
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_API_BASE_URL` (optional HTTPS URL for the startup-agent API)

Then open GitHub → Actions → **Build Founder OS Android APK** → **Run workflow**. The preview profile produces an installable APK. Expo EAS build credentials are managed by Expo; no Android keystore is committed to GitHub.

## Firebase collection

If the collection `startup_workflows` exists, the app reads up to 20 workflow documents. The app falls back to the built-in demo workflows until Firebase is configured or the collection is empty.
