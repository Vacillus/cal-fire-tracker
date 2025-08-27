import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * CAL FIRE Data Schema
 * Tracks fire incidents, mutations, and audit logs
 */
const schema = a.schema({
  FireIncident: a
    .model({
      incidentId: a.string().required(),
      incidentName: a.string().required(),
      county: a.string().required(),
      acresBurned: a.float(),
      containmentPercent: a.integer(),
      startedDate: a.datetime(),
      updatedDate: a.datetime(),
      latitude: a.float(),
      longitude: a.float(),
      isActive: a.boolean(),
      crewsInvolved: a.integer(),
      cause: a.string(),
      structures: a.hasMany('Structure', 'incidentId'),
      mutations: a.hasMany('MutationLog', 'entityId'),
    })
    .authorization(allow => [allow.publicApiKey(), allow.authenticated()]),

  Structure: a
    .model({
      id: a.id(),
      incidentId: a.string().required(),
      incident: a.belongsTo('FireIncident', 'incidentId'),
      threatened: a.integer(),
      destroyed: a.integer(),
      damaged: a.integer(),
      type: a.string(), // residential, commercial, other
    })
    .authorization(allow => [allow.publicApiKey(), allow.authenticated()]),

  MutationLog: a
    .model({
      id: a.id(),
      entityId: a.string().required(),
      entityType: a.string().required(), // FireIncident, Structure, etc.
      entity: a.belongsTo('FireIncident', 'entityId'),
      action: a.string().required(), // CREATE, UPDATE, DELETE
      mutationType: a.string(), // DATA_SYNC, USER_UPDATE, SYSTEM_SCRAPE
      previousValue: a.json(),
      newValue: a.json(),
      contradictionNotes: a.string(),
      forensicSignature: a.string(), // "Contradiction loop detected", etc.
      timestamp: a.datetime().required(),
      source: a.string(), // CAL_FIRE_API, USER_INPUT, SYSTEM
      userId: a.string(),
    })
    .authorization(allow => [allow.publicApiKey(), allow.authenticated()]),

  County: a
    .model({
      name: a.string().required(),
      totalIncidents: a.integer(),
      activeIncidents: a.integer(),
      totalAcresBurned: a.float(),
      riskLevel: a.string(), // LOW, MEDIUM, HIGH, EXTREME
      lastUpdated: a.datetime(),
    })
    .authorization(allow => [allow.publicApiKey()]),

  FireLore: a
    .model({
      id: a.id(),
      year: a.integer().required(),
      county: a.string(),
      totalFires: a.integer(),
      totalAcres: a.float(),
      largestFire: a.string(),
      notableEvents: a.json(),
      historicalPattern: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*
 * Forensic Mutation Types:
 * - DATA_SYNC: Regular data synchronization
 * - USER_UPDATE: Manual user intervention
 * - SYSTEM_SCRAPE: Automated CAL FIRE scraping
 * - CONTRADICTION_DETECTED: Conflicting data found
 * - MUTATION_ARTIFACT: Audit trail entry
 */