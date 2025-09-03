/**
 * Fire Perimeter Generator
 * Creates realistic fire perimeter polygons, spread projections, and threat areas
 */

export interface FirePerimeter {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lng, lat], [lng, lat], ...]]
}

export interface WindData {
  speed: number; // mph
  direction: number; // degrees (0 = North, 90 = East)
}

export interface FireProjection {
  perimeter: FirePerimeter;
  directionCone: FirePerimeter;
  threatArea: FirePerimeter;
  windData: WindData;
  confidence: number; // 0-100
  lastUpdate: string;
}

// Mutation logger for perimeter updates
export function logPerimeterMutation(
  action: 'perimeter_update' | 'projection_update' | 'threat_area_update',
  fireId: string,
  data: unknown
) {
  const mutation = {
    timestamp: new Date().toISOString(),
    action,
    fireId,
    dataSource: 'perimeter_generator',
    changeType: action,
    data
  };
  
  console.log('[PERIMETER_MUTATION]', mutation);
  
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('perimeterMutations') || '[]');
    logs.push(mutation);
    if (logs.length > 500) logs.shift();
    localStorage.setItem('perimeterMutations', JSON.stringify(logs));
  }
}

/**
 * Generate a realistic fire perimeter polygon based on acres
 * Creates an irregular shape that looks like actual fire spread
 */
export function generateFirePerimeter(
  centerLat: number,
  centerLng: number,
  acres: number,
  windDirection: number = 0
): FirePerimeter {
  // Convert acres to approximate radius in degrees
  // 1 acre ≈ 0.00156 square miles ≈ 0.0014 degrees² at equator
  const baseRadius = Math.sqrt(acres * 0.0000014);
  
  // Generate irregular perimeter with more detail for larger fires
  const numPoints = Math.min(64, Math.max(16, Math.floor(Math.sqrt(acres))));
  const coordinates: number[][] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    // Add irregularity based on angle
    const irregularity = 0.3 + Math.random() * 0.4; // 30-70% variation
    
    // Elongate in wind direction
    const windEffect = 1 + 0.3 * Math.cos(angle - (windDirection * Math.PI / 180));
    
    // Add fractal-like detail
    const detail1 = 0.1 * Math.sin(angle * 3);
    const detail2 = 0.05 * Math.sin(angle * 7);
    const detail3 = 0.02 * Math.sin(angle * 13);
    
    const radius = baseRadius * irregularity * windEffect * (1 + detail1 + detail2 + detail3);
    
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + radius * Math.cos(angle) / Math.cos(centerLat * Math.PI / 180);
    
    coordinates.push([lng, lat]);
  }
  
  // Ensure polygon is closed
  if (coordinates.length > 0 && 
      (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
       coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
    coordinates.push([...coordinates[0]]);
  }
  
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
}

/**
 * Generate a directional cone showing projected fire spread
 */
export function generateDirectionCone(
  centerLat: number,
  centerLng: number,
  acres: number,
  windDirection: number,
  windSpeed: number
): FirePerimeter {
  const baseRadius = Math.sqrt(acres * 0.0000014);
  
  // Cone extends in wind direction, length based on wind speed
  const coneLength = baseRadius * (0.5 + windSpeed / 50); // Scale with wind
  
  const windRad = windDirection * Math.PI / 180;
  
  // Create arrow/cone shape
  const coordinates: number[][] = [];
  
  // Base of cone (at fire perimeter)
  const basePoints = 5;
  for (let i = 0; i <= basePoints; i++) {
    const angle = windRad + Math.PI/2 - (i / basePoints) * Math.PI;
    const radius = baseRadius * 0.8;
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + radius * Math.cos(angle) / Math.cos(centerLat * Math.PI / 180);
    coordinates.push([lng, lat]);
  }
  
  // Tip of cone (projection point)
  const tipLat = centerLat + coneLength * Math.sin(windRad);
  const tipLng = centerLng + coneLength * Math.cos(windRad) / Math.cos(centerLat * Math.PI / 180);
  coordinates.push([tipLng, tipLat]);
  
  // Close the polygon
  coordinates.push([...coordinates[0]]);
  
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
}

/**
 * Generate threat area polygon (buffered zone in spread direction)
 */
export function generateThreatArea(
  centerLat: number,
  centerLng: number,
  acres: number,
  windDirection: number,
  windSpeed: number
): FirePerimeter {
  const baseRadius = Math.sqrt(acres * 0.0000014);
  
  // Threat area extends beyond fire in wind direction
  const threatDistance = baseRadius * (1.5 + windSpeed / 30);
  const threatWidth = baseRadius * 1.2;
  
  const windRad = windDirection * Math.PI / 180;
  const coordinates: number[][] = [];
  
  // Generate elliptical threat area
  const numPoints = 32;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    // Ellipse elongated in wind direction
    const alongWind = Math.cos(angle - windRad);
    const acrossWind = Math.sin(angle - windRad);
    
    const radius = baseRadius + 
      threatDistance * Math.max(0, alongWind) * 1.5 + // More extension in wind direction
      threatWidth * Math.abs(acrossWind) * 0.5; // Some width across wind
    
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + radius * Math.cos(angle) / Math.cos(centerLat * Math.PI / 180);
    
    coordinates.push([lng, lat]);
  }
  
  // Close polygon
  if (coordinates.length > 0) {
    coordinates.push([...coordinates[0]]);
  }
  
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
}

/**
 * Calculate wind data based on location and time
 * In production, this would call a weather API
 */
export function calculateWindData(lat: number): WindData {
  // Mock wind data - in production use weather API
  const baseWind = {
    speed: 10 + Math.random() * 20, // 10-30 mph
    direction: Math.random() * 360 // Random direction
  };
  
  // Simulate diurnal wind patterns
  const hour = new Date().getHours();
  if (hour >= 14 && hour <= 18) {
    baseWind.speed *= 1.5; // Afternoon winds stronger
  }
  
  // Simulate terrain effects (simplified)
  if (lat > 37 && lat < 39) { // Northern California
    baseWind.direction = 315; // Northwest prevailing
  } else if (lat < 34) { // Southern California
    baseWind.direction = 270; // West (Santa Ana winds)
    if (hour >= 20 || hour <= 6) {
      baseWind.speed *= 1.3; // Night strengthening
    }
  }
  
  return baseWind;
}

/**
 * Generate complete fire projection with all layers
 */
export function generateFireProjection(
  fireId: string,
  centerLat: number,
  centerLng: number,
  acres: number
): FireProjection {
  const windData = calculateWindData(centerLat);
  
  // Generate all polygon layers
  const perimeter = generateFirePerimeter(centerLat, centerLng, acres, windData.direction);
  const directionCone = generateDirectionCone(centerLat, centerLng, acres, windData.direction, windData.speed);
  const threatArea = generateThreatArea(centerLat, centerLng, acres, windData.direction, windData.speed);
  
  // Log mutations
  logPerimeterMutation('perimeter_update', fireId, { 
    acres, 
    points: perimeter.coordinates[0].length,
    windInfluence: windData.direction 
  });
  
  logPerimeterMutation('projection_update', fireId, { 
    windSpeed: windData.speed,
    windDirection: windData.direction,
    projectionDistance: Math.sqrt(acres * 0.0000014) * (0.5 + windData.speed / 50)
  });
  
  logPerimeterMutation('threat_area_update', fireId, {
    threatRadius: Math.sqrt(acres * 0.0000014) * (1.5 + windData.speed / 30),
    confidence: calculateConfidence(acres, windData.speed)
  });
  
  return {
    perimeter,
    directionCone,
    threatArea,
    windData,
    confidence: calculateConfidence(acres, windData.speed),
    lastUpdate: new Date().toISOString()
  };
}

/**
 * Calculate confidence level for projections
 */
function calculateConfidence(acres: number, windSpeed: number): number {
  // Lower confidence for very large fires or high winds
  let confidence = 85;
  
  if (acres > 10000) confidence -= 10;
  if (acres > 50000) confidence -= 10;
  if (windSpeed > 25) confidence -= 15;
  if (windSpeed > 40) confidence -= 15;
  
  return Math.max(30, Math.min(95, confidence));
}

/**
 * Convert perimeter to Leaflet-compatible format
 */
export function perimeterToLeafletCoords(perimeter: FirePerimeter): [number, number][] {
  return perimeter.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
}