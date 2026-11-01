# Metro Probati — Google Maps Platform Setup Guide

## 1. Google Cloud Console Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. `metro-probati-chattogram`).
3. Navigate to **APIs & Services > Library** and enable:
   - **Maps JavaScript API**
   - **Geolocation API** (Optional, for backend resolution)
4. Navigate to **APIs & Services > Credentials** and click **Create Credentials > API Key**.

## 2. API Key Restrictions
To protect your key from unauthorized usage:
- **Application Restrictions**: Set to **HTTP referrers (web sites)**.
  - Add `localhost:3000/*` for local testing.
  - Add `https://metro-probati.vercel.app/*` (or your custom domain) for production.
- **API Restrictions**: Restrict the key specifically to **Maps JavaScript API**.

## 3. Environment Variable Configuration

Add the key to your `.env.local` or Vercel dashboard:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_google_maps_api_key
```

## 4. Fallback Architecture
If no API key is provided or the client has network issues connecting to Google servers, the platform automatically renders the high-contrast **Interactive Chattogram Transit Vector Radar Map**, ensuring passengers can always track genuine bus telemetry without failure.
