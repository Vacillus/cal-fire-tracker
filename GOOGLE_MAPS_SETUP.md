# Google Maps API Setup

To enable the interactive map functionality, you need to configure a Google Maps API key.

## Steps to Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **Maps JavaScript API**
4. Create credentials → API Key
5. Restrict the API key to your domain for security

## Configuration

Replace `YOUR_API_KEY` in `app/components/CalFireMap.tsx` line 202:

```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=geometry`;
```

## Environment Variable (Recommended)

For production, use an environment variable:

1. Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

2. Update the code to use:
```typescript
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
```

## Features Enabled

- ✅ Geospatially accurate fire locations
- ✅ Interactive county boundaries from local GeoJSON
- ✅ Custom fire overlays with OverlayView
- ✅ Dynamic fire perimeter polygons
- ✅ County click events for fire data
- ✅ Responsive terrain map view