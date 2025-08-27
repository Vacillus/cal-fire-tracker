import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface CalFireIncident {
  UniqueId: string;
  Name: string;
  County: string;
  AcresBurned: number;
  PercentContained: number;
  Started: string;
  Updated: string;
  Latitude: number;
  Longitude: number;
  Active: boolean;
  PersonnelInvolved: number;
  StructuresThreatened: number;
  StructuresDestroyed: number;
}

interface MutationLog {
  entityId: string;
  entityType: string;
  action: string;
  mutationType: string;
  previousValue?: any;
  newValue?: any;
  contradictionNotes?: string;
  forensicSignature: string;
  timestamp: string;
  source: string;
}

export const handler: Handler = async (event) => {
  console.log('[FORENSIC] Initiating CAL FIRE data scrape mutation');
  
  try {
    // Fetch CAL FIRE data
    const response = await fetch(process.env.CAL_FIRE_API_URL || '');
    const incidents: CalFireIncident[] = await response.json();
    
    console.log(`[FORENSIC] Retrieved ${incidents.length} fire incidents`);
    
    const processedIncidents = [];
    const mutations: MutationLog[] = [];
    
    for (const incident of incidents) {
      // Check if incident exists
      const existingQuery = await docClient.send(new QueryCommand({
        TableName: process.env.FIRE_INCIDENTS_TABLE,
        KeyConditionExpression: 'incidentId = :id',
        ExpressionAttributeValues: {
          ':id': incident.UniqueId,
        },
      }));
      
      const existingIncident = existingQuery.Items?.[0];
      
      // Detect contradictions
      let contradictionNotes = null;
      let forensicSignature = 'CLEAN_SYNC';
      
      if (existingIncident) {
        if (existingIncident.acresBurned > incident.AcresBurned) {
          contradictionNotes = `Contradiction detected: Acres burned decreased from ${existingIncident.acresBurned} to ${incident.AcresBurned}`;
          forensicSignature = 'CONTRADICTION_LOOP_DETECTED';
        }
        if (existingIncident.containmentPercent > incident.PercentContained) {
          contradictionNotes = `${contradictionNotes || ''} Containment regressed from ${existingIncident.containmentPercent}% to ${incident.PercentContained}%`;
          forensicSignature = 'TEMPORAL_ANOMALY';
        }
      }
      
      // Store incident
      const incidentData = {
        incidentId: incident.UniqueId,
        incidentName: incident.Name,
        county: incident.County,
        acresBurned: incident.AcresBurned,
        containmentPercent: incident.PercentContained,
        startedDate: incident.Started,
        updatedDate: new Date().toISOString(),
        latitude: incident.Latitude,
        longitude: incident.Longitude,
        isActive: incident.Active,
        crewsInvolved: incident.PersonnelInvolved,
      };
      
      await docClient.send(new PutCommand({
        TableName: process.env.FIRE_INCIDENTS_TABLE,
        Item: incidentData,
      }));
      
      // Create mutation log
      const mutation: MutationLog = {
        entityId: incident.UniqueId,
        entityType: 'FireIncident',
        action: existingIncident ? 'UPDATE' : 'CREATE',
        mutationType: 'SYSTEM_SCRAPE',
        previousValue: existingIncident || null,
        newValue: incidentData,
        contradictionNotes,
        forensicSignature,
        timestamp: new Date().toISOString(),
        source: 'CAL_FIRE_API',
      };
      
      mutations.push(mutation);
      
      // Store mutation log
      await docClient.send(new PutCommand({
        TableName: process.env.MUTATION_LOGS_TABLE,
        Item: {
          id: `${Date.now()}-${incident.UniqueId}`,
          ...mutation,
        },
      }));
      
      processedIncidents.push(incidentData);
    }
    
    // Update county statistics
    const countyStats = new Map();
    incidents.forEach(incident => {
      if (!countyStats.has(incident.County)) {
        countyStats.set(incident.County, {
          name: incident.County,
          totalIncidents: 0,
          activeIncidents: 0,
          totalAcresBurned: 0,
          riskLevel: 'LOW',
        });
      }
      const stats = countyStats.get(incident.County);
      stats.totalIncidents++;
      if (incident.Active) stats.activeIncidents++;
      stats.totalAcresBurned += incident.AcresBurned;
      
      // Calculate risk level
      if (stats.activeIncidents > 5 || stats.totalAcresBurned > 10000) {
        stats.riskLevel = 'EXTREME';
      } else if (stats.activeIncidents > 3 || stats.totalAcresBurned > 5000) {
        stats.riskLevel = 'HIGH';
      } else if (stats.activeIncidents > 1 || stats.totalAcresBurned > 1000) {
        stats.riskLevel = 'MEDIUM';
      }
    });
    
    // Store county stats
    for (const [county, stats] of countyStats) {
      await docClient.send(new PutCommand({
        TableName: process.env.COUNTIES_TABLE,
        Item: {
          ...stats,
          lastUpdated: new Date().toISOString(),
        },
      }));
    }
    
    console.log(`[FORENSIC] Mutation cycle complete: ${processedIncidents.length} incidents, ${mutations.filter(m => m.contradictionNotes).length} contradictions detected`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        processed: processedIncidents.length,
        mutations: mutations.length,
        contradictions: mutations.filter(m => m.contradictionNotes).length,
        forensicSignature: 'MUTATION_ARTIFACT_STORED',
      }),
    };
  } catch (error) {
    console.error('[FORENSIC] Critical failure in mutation cycle:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Mutation cycle failed',
        forensicSignature: 'CATASTROPHIC_MUTATION_FAILURE',
      }),
    };
  }
};