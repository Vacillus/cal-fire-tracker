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
 * Creates a smooth, natural-looking fire boundary
 */
export function generateFirePerimeter(
  centerLat: number,
  centerLng: number,
  acres: number,
  windDirection: number = 0
): FirePerimeter {
  // Convert acres to approximate radius in degrees
  const areaInSqMeters = acres * 4047;
  const radiusInMeters = Math.sqrt(areaInSqMeters / Math.PI);
  const baseRadius = radiusInMeters / 111000;
  
  const numPoints = 64; // More points for smoother curve
  const coordinates: number[][] = [];
  
  // Generate smooth fire perimeter using harmonic functions
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    // Create natural fire shape with multiple harmonics
    // Primary shape - slightly elliptical
    let radiusVariation = 1.0;
    
    // Add large-scale variations (2-3 lobes)
    radiusVariation += 0.15 * Math.sin(angle * 2 + Math.PI/4);
    radiusVariation += 0.10 * Math.cos(angle * 3);
    
    // Add medium-scale variations (finger-like projections)
    radiusVariation += 0.05 * Math.sin(angle * 5);
    radiusVariation += 0.03 * Math.cos(angle * 7);
    
    // Wind elongation effect
    const windRad = windDirection * Math.PI / 180;
    const windAlignment = Math.cos(angle - windRad);
    const windEffect = 1 + 0.3 * windAlignment * Math.max(0, windAlignment);
    
    // Final radius calculation
    const radius = baseRadius * radiusVariation * windEffect;
    
    // Calculate position
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + radius * Math.cos(angle) / Math.cos(centerLat * Math.PI / 180);
    
    coordinates.push([lng, lat]);
  }
  
  // Ensure polygon is closed
  if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
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
  const areaInSqMeters = acres * 4047;
  const radiusInMeters = Math.sqrt(areaInSqMeters / Math.PI);
  const baseRadius = radiusInMeters / 111000;
  
  // Cone extends in wind direction, length based on wind speed
  const coneLength = baseRadius * (0.6 + windSpeed / 50);
  const windRad = windDirection * Math.PI / 180;
  
  const coordinates: number[][] = [];
  const arcPoints = 30; // Smoother arc
  const spreadAngle = Math.PI / 3; // 60 degree spread total
  
  // Start from fire center
  coordinates.push([centerLng, centerLat]);
  
  // Create smooth parabolic arc for fire spread projection
  for (let i = 0; i <= arcPoints; i++) {
    const t = i / arcPoints;
    const arcAngle = windRad - spreadAngle/2 + t * spreadAngle;
    
    // Parabolic distance falloff from center
    const centeredness = 1 - Math.abs(t - 0.5) * 2;
    const distance = coneLength * (0.7 + 0.3 * centeredness * centeredness);
    
    const lat = centerLat + distance * Math.sin(arcAngle);
    const lng = centerLng + distance * Math.cos(arcAngle) / Math.cos(centerLat * Math.PI / 180);
    coordinates.push([lng, lat]);
  }
  
  // Close polygon
  coordinates.push([centerLng, centerLat]);
  
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
  const areaInSqMeters = acres * 4047;
  const radiusInMeters = Math.sqrt(areaInSqMeters / Math.PI);
  const baseRadius = radiusInMeters / 111000;
  
  // Threat area extends beyond fire in wind direction
  const windRad = windDirection * Math.PI / 180;
  const threatExtension = baseRadius * (0.4 + windSpeed / 40);
  
  const coordinates: number[][] = [];
  const numPoints = 64; // Smooth ellipse
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    // Create smooth ellipse elongated in wind direction
    const windAlignment = Math.cos(angle - windRad);
    
    // Elliptical parameters
    const alongWindRadius = baseRadius * 1.5 + threatExtension * Math.max(0, windAlignment);
    const acrossWindRadius = baseRadius * 1.2;
    
    // Smooth elliptical formula
    const angleFromWind = angle - windRad;
    const x = alongWindRadius * Math.cos(angleFromWind);
    const y = acrossWindRadius * Math.sin(angleFromWind);
    const radius = Math.sqrt(x * x + y * y);
    
    // Add slight organic variation
    const variation = 1 + 0.05 * Math.sin(angle * 4);
    
    const lat = centerLat + radius * variation * Math.sin(angle);
    const lng = centerLng + radius * variation * Math.cos(angle) / Math.cos(centerLat * Math.PI / 180);
    
    coordinates.push([lng, lat]);
  }
  
  // Ensure closed polygon
  if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
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