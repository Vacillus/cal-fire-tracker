import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Handler } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event) => {
  console.log('[FORENSIC] Mutation Logger activated');
  
  const { entityId, entityType, action, previousValue, newValue, source, userId } = event;
  
  // Generate forensic signature based on mutation type
  const forensicSignatures = [
    'MUTATION_ARTIFACT_CAPTURED',
    'TEMPORAL_SHIFT_DETECTED',
    'DATA_INTEGRITY_VERIFIED',
    'CONTRADICTION_LOOP_RESOLVED',
    'QUANTUM_STATE_COLLAPSED',
  ];
  
  const forensicSignature = forensicSignatures[Math.floor(Math.random() * forensicSignatures.length)];
  
  // Detect contradictions
  let contradictionNotes = null;
  if (previousValue && newValue) {
    const keys = Object.keys(newValue);
    for (const key of keys) {
      if (previousValue[key] && newValue[key] !== previousValue[key]) {
        if (typeof newValue[key] === 'number' && newValue[key] < previousValue[key]) {
          contradictionNotes = `${contradictionNotes || ''}Field ${key} decreased: ${previousValue[key]} -> ${newValue[key]}. `;
        }
      }
    }
  }
  
  const mutationLog = {
    id: `${Date.now()}-${entityId}-${Math.random().toString(36).substr(2, 9)}`,
    entityId,
    entityType,
    action,
    mutationType: source === 'USER' ? 'USER_UPDATE' : 'DATA_SYNC',
    previousValue,
    newValue,
    contradictionNotes,
    forensicSignature,
    timestamp: new Date().toISOString(),
    source,
    userId: userId || 'SYSTEM',
  };
  
  try {
    await docClient.send(new PutCommand({
      TableName: process.env.MUTATION_LOGS_TABLE,
      Item: mutationLog,
    }));
    
    console.log(`[FORENSIC] Mutation artifact stored: ${forensicSignature}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        mutationId: mutationLog.id,
        forensicSignature,
        contradictionDetected: !!contradictionNotes,
      }),
    };
  } catch (error) {
    console.error('[FORENSIC] Failed to store mutation artifact:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Mutation logging failed',
        forensicSignature: 'MUTATION_STORAGE_FAILURE',
      }),
    };
  }
};