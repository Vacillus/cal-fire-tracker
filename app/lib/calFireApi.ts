/**
 * CAL FIRE API Integration Module
 * Fetches real-time wildfire data from CAL FIRE and other sources
 */

export interface CalFireIncident {
  id: string;
  name: string;
  county: string;
  location?: string;
  latitude: number;
  longitude: number;
  acres_burned: number;
  containment_percent: number;
  status: 'Active' | 'Contained' | 'Controlled';
  updated_at: string;
  personnel_involved: number;
  structures_threatened: number;
  evacuation_orders: boolean;
  started_date?: string;
  cause?: string;
}

// CAL FIRE RSS Feed URL (public, no API key required)
const CAL_FIRE_RSS = 'https://www.fire.ca.gov/umbraco/api/IncidentApi/List';

interface MutationLog {
  timestamp: string;
  action: string;
  data: unknown;
  source: string;
  environment: string | undefined;
}

/**
 * Mutation logger for tracking all data fetches
 */
function logMutation(action: string, data: unknown): MutationLog {
  const mutation = {
    timestamp: new Date().toISOString(),
    action,
    data,
    source: 'CAL_FIRE_API',
    environment: process.env.NODE_ENV
  };
  
  console.log('[MUTATION_LOG]', JSON.stringify(mutation));
  
  // Store in localStorage for forensic analysis
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('calFireMutations') || '[]');
    logs.push(mutation);
    if (logs.length > 500) logs.shift(); // Keep last 500 entries
    localStorage.setItem('calFireMutations', JSON.stringify(logs));
  }
  
  return mutation;
}

/**
 * Fetch live fire data from CAL FIRE API
 */
export async function fetchCalFireData(): Promise<CalFireIncident[]> {
  try {
    logMutation('FETCH_START', { timestamp: new Date().toISOString() });
    
    // Try to fetch from CAL FIRE API
    const response = await fetch(CAL_FIRE_RSS, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CalFireTracker/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CAL FIRE API responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform CAL FIRE data to our format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const incidents: CalFireIncident[] = data.map((incident: Record<string, any>) => {
      const counties = incident.Counties as string | undefined;
      const evacuationInfo = incident.EvacuationInfo as string | undefined;
      
      return {
        id: (incident.UniqueId as string) || (incident.Name as string),
        name: incident.Name as string,
        county: (incident.County as string) || counties?.split('/')[0] || 'Unknown',
        location: incident.Location as string | undefined,
        latitude: parseFloat(incident.Latitude as string) || 0,
        longitude: parseFloat(incident.Longitude as string) || 0,
        acres_burned: parseInt(incident.AcresBurned as string) || 0,
        containment_percent: parseInt(incident.PercentContained as string) || 0,
        status: incident.IsActive ? 'Active' : 'Contained',
        updated_at: (incident.Updated as string) || new Date().toISOString(),
        personnel_involved: parseInt(incident.PersonnelInvolved as string) || 0,
        structures_threatened: parseInt(incident.StructuresThreatened as string) || 0,
        evacuation_orders: evacuationInfo?.includes('Evacuation') || false,
        started_date: incident.Started as string | undefined,
        cause: incident.Cause as string | undefined
      };
    });
    
    logMutation('FETCH_SUCCESS', { 
      incidentCount: incidents.length,
      activeCount: incidents.filter(i => i.status === 'Active').length
    });
    
    return incidents;
    
  } catch (error) {
    logMutation('FETCH_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    console.error('Failed to fetch CAL FIRE data:', error);
    
    // Return empty array on error - app will fall back to mock data
    return [];
  }
}

interface FireData {
  id: string;
  name: string;
  county: string;
  city?: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  timestamp: string;
  personnel: number;
  structures_threatened: number;
  evacuation_orders: boolean;
  started_date?: string;
  cause?: string;
}

/**
 * Transform CAL FIRE data to match our FireData interface
 */
export function transformToFireData(incident: CalFireIncident): FireData {
  return {
    id: incident.id,
    name: incident.name,
    county: incident.county,
    city: incident.location,
    lat: incident.latitude,
    lng: incident.longitude,
    acres: incident.acres_burned,
    containment: incident.containment_percent,
    status: incident.status,
    timestamp: new Date(incident.updated_at).toLocaleString(),
    personnel: incident.personnel_involved,
    structures_threatened: incident.structures_threatened,
    evacuation_orders: incident.evacuation_orders,
    started_date: incident.started_date,
    cause: incident.cause
  };
}

/**
 * Fetch and merge data from multiple sources
 */
export async function fetchAllFireData(): Promise<CalFireIncident[]> {
  const startTime = Date.now();
  
  try {
    // Fetch from multiple sources in parallel
    const [calFireData] = await Promise.allSettled([
      fetchCalFireData()
    ]);
    
    // Merge and deduplicate results
    const allIncidents: CalFireIncident[] = [];
    
    if (calFireData.status === 'fulfilled') {
      allIncidents.push(...calFireData.value);
    }
    
    // Remove duplicates based on location proximity
    const uniqueIncidents = allIncidents.filter((incident, index, self) => 
      index === self.findIndex(i => 
        Math.abs(i.latitude - incident.latitude) < 0.01 && 
        Math.abs(i.longitude - incident.longitude) < 0.01
      )
    );
    
    const endTime = Date.now();
    logMutation('FETCH_COMPLETE', { 
      duration_ms: endTime - startTime,
      total_incidents: uniqueIncidents.length,
      sources_used: ['CAL_FIRE']
    });
    
    return uniqueIncidents;
    
  } catch (error) {
    logMutation('FETCH_ALL_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return [];
  }
}

/**
 * Get mutation logs for debugging
 */
export function getMutationLogs(): MutationLog[] {
  if (typeof window === 'undefined') return [];
  
  const logs = localStorage.getItem('calFireMutations');
  return logs ? JSON.parse(logs) : [];
}

/**
 * Clear mutation logs
 */
export function clearMutationLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('calFireMutations');
    logMutation('LOGS_CLEARED', { timestamp: new Date().toISOString() });
  }
}