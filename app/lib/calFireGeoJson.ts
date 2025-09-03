/**
 * CAL FIRE GeoJSON API Integration
 * Fetches real-time wildfire data from official CAL FIRE API
 */

export interface CalFireGeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    Name: string;
    Final: boolean;
    Updated: string;
    Started: string;
    AdminUnit: string;
    AdminUnitUrl: string | null;
    County: string;
    Location: string;
    AcresBurned: number;
    PercentContained: number;
    ControlStatement: string | null;
    AgencyNames: string;
    Longitude: number;
    Latitude: number;
    Type: string;
    UniqueId: string;
    Url: string;
    ExtinguishedDate: string;
    ExtinguishedDateOnly: string;
    StartedDateOnly: string;
    IsActive: boolean;
    CalFireIncident: boolean;
    NotificationDesired: boolean;
  };
}

export interface CalFireGeoJson {
  type: 'FeatureCollection';
  features: CalFireGeoJsonFeature[];
}

export interface FireIncident {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  personnel?: number;
  structures_threatened?: number;
  evacuation_orders?: boolean;
  started_date?: string;
  cause?: string;
  timestamp?: string;
  location?: string;
  adminUnit?: string;
  url?: string;
}

// CAL FIRE API endpoints
const CAL_FIRE_GEOJSON_ACTIVE = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?inactive=false';
const CAL_FIRE_GEOJSON_ALL = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?inactive=true';
const CAL_FIRE_GEOJSON_YEAR = `https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList?year=${new Date().getFullYear()}`;

/**
 * Mutation logger for tracking API calls
 */
function logApiCall(action: string, data: unknown) {
  const mutation = {
    timestamp: new Date().toISOString(),
    component: 'CalFireGeoJsonAPI',
    action,
    data
  };
  console.log('[CAL_FIRE_API]', mutation);
  
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('calFireApiLogs') || '[]');
    logs.push(mutation);
    if (logs.length > 100) logs.shift();
    localStorage.setItem('calFireApiLogs', JSON.stringify(logs));
  }
}

/**
 * Convert CAL FIRE GeoJSON feature to our FireIncident format
 */
function convertToFireIncident(feature: CalFireGeoJsonFeature): FireIncident {
  const props = feature.properties;
  
  // Use CAL FIRE's IsActive flag as the source of truth
  // If they say it's active, it's active - regardless of containment
  let status: 'Active' | 'Contained' | 'Controlled';
  if (props.ExtinguishedDate && props.ExtinguishedDate !== '') {
    status = 'Controlled';
  } else if (props.IsActive === true) {
    // Trust CAL FIRE - if they say active, it's active
    if (props.PercentContained >= 98) {
      status = 'Contained'; // Nearly out but still monitored
    } else {
      status = 'Active'; // Active fire needing resources
    }
  } else {
    status = 'Controlled';
  }
  
  return {
    id: props.UniqueId,
    name: props.Name.trim(),
    county: props.County.split(',')[0].trim(), // Take first county if multiple
    lat: props.Latitude,
    lng: props.Longitude,
    acres: Math.round(props.AcresBurned || 0),
    containment: props.PercentContained || 0,
    status,
    started_date: props.StartedDateOnly,
    timestamp: new Date(props.Updated).toLocaleString(),
    location: props.Location,
    adminUnit: props.AdminUnit,
    url: props.Url,
    // These fields aren't in the API but we can estimate
    personnel: estimatePersonnel(props.AcresBurned),
    structures_threatened: estimateStructures(props.AcresBurned, props.Location),
    evacuation_orders: props.AcresBurned > 1000 && props.PercentContained < 50
  };
}

/**
 * Estimate personnel based on fire size (rough approximation)
 */
function estimatePersonnel(acres: number): number {
  if (acres < 100) return 50;
  if (acres < 500) return 150;
  if (acres < 1000) return 300;
  if (acres < 5000) return 500;
  if (acres < 10000) return 800;
  if (acres < 50000) return 1500;
  return 2000;
}

/**
 * Estimate structures threatened based on size and location
 */
function estimateStructures(acres: number, location: string): number {
  const urbanKeywords = ['City', 'Town', 'Community', 'Residential'];
  const isNearUrban = urbanKeywords.some(keyword => 
    location.toLowerCase().includes(keyword.toLowerCase())
  );
  
  const baseThreat = Math.round(acres / 100);
  return isNearUrban ? baseThreat * 3 : baseThreat;
}

/**
 * Fetch active fires from CAL FIRE GeoJSON API
 */
export async function fetchActiveFiresGeoJson(): Promise<FireIncident[]> {
  try {
    logApiCall('FETCH_START', { 
      url: CAL_FIRE_GEOJSON_ACTIVE,
      timestamp: new Date().toISOString() 
    });
    
    // Fetch ONLY active fires to avoid misleading data
    const response = await fetch(CAL_FIRE_GEOJSON_ACTIVE, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data: CalFireGeoJson = await response.json();
    
    // Convert all features to FireIncident format
    const incidents = data.features.map(convertToFireIncident);
    
    // Sort by acres burned (largest first)
    incidents.sort((a, b) => b.acres - a.acres);
    
    const stats = {
      totalFires: incidents.length,
      activeFires: incidents.filter(f => f.status === 'Active').length,
      containedFires: incidents.filter(f => f.status === 'Contained').length,
      controlledFires: incidents.filter(f => f.status === 'Controlled').length,
      totalAcres: incidents.reduce((sum, f) => sum + f.acres, 0),
      sampleFires: incidents.slice(0, 3).map(f => `${f.name} (${f.status})`)
    };
    
    logApiCall('FETCH_SUCCESS', stats);
    console.log('[CAL_FIRE_API] Fire Statistics:', stats);
    
    return incidents;
    
  } catch (error) {
    logApiCall('FETCH_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    console.error('Failed to fetch CAL FIRE data:', error);
    return [];
  }
}

/**
 * Fetch all fires (including inactive) from CAL FIRE GeoJSON API
 */
export async function fetchAllFiresGeoJson(): Promise<FireIncident[]> {
  try {
    logApiCall('FETCH_ALL_START', { 
      url: CAL_FIRE_GEOJSON_ALL,
      timestamp: new Date().toISOString() 
    });
    
    const response = await fetch(CAL_FIRE_GEOJSON_ALL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data: CalFireGeoJson = await response.json();
    
    // Convert all features to FireIncident format
    const incidents = data.features.map(convertToFireIncident);
    
    // Sort by acres burned (largest first)
    incidents.sort((a, b) => b.acres - a.acres);
    
    logApiCall('FETCH_ALL_SUCCESS', { 
      totalFires: incidents.length,
      timestamp: new Date().toISOString()
    });
    
    return incidents;
    
  } catch (error) {
    logApiCall('FETCH_ALL_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    console.error('Failed to fetch all CAL FIRE data:', error);
    return [];
  }
}