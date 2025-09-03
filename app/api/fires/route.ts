import { NextResponse } from 'next/server';

// CAL FIRE API endpoints
const CAL_FIRE_API = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?inactive=false';

export async function GET() {
  try {
    // Fetch from CAL FIRE API server-side (no CORS issues)
    const response = await fetch(CAL_FIRE_API, {
      headers: {
        'Accept': 'application/json',
      },
      // Cache for 1 minute to avoid hammering their API
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`CAL FIRE API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Failed to fetch from CAL FIRE:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fire data', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}