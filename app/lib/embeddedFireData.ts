/**
 * Embedded fire data for fast initial loading
 * This data is updated at build time and provides instant display
 * Background updates via CORS proxy refresh this data
 */
export const EMBEDDED_FIRE_DATA = [
  {
    id: "ca-2025-gifford",
    name: "Gifford Fire",
    county: "San Luis Obispo, Santa Barbara",
    lat: 35.111258,
    lng: -120.097902,
    acres: 131614,
    containment: 97,
    status: 'Active' as const,
    personnel: 2000,
    structures_threatened: 150,
    evacuation_orders: false,
    started_date: '2025-08-01',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-tcu-lightning",
    name: "TCU September Lightning Complex",
    county: "Calaveras, Tuolumne",
    lat: 37.998587,
    lng: -120.475152,
    acres: 13371,
    containment: 0,
    status: 'Active' as const,
    personnel: 1200,
    structures_threatened: 250,
    evacuation_orders: true,
    started_date: '2024-09-01',
    cause: 'Lightning'
  },
  {
    id: "ca-2025-6-5-fire",
    name: "6-5 Fire",
    county: "Tuolumne",
    lat: 37.819667,
    lng: -120.437333,
    acres: 6837,
    containment: 70,
    status: 'Active' as const,
    personnel: 850,
    structures_threatened: 120,
    evacuation_orders: false,
    started_date: '2024-06-05',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-2-2-fire",
    name: "2-2 Fire",
    county: "Calaveras, Stanislaus",
    lat: 37.77721,
    lng: -120.38529,
    acres: 3462,
    containment: 85,
    status: 'Active' as const,
    personnel: 600,
    structures_threatened: 80,
    evacuation_orders: false,
    started_date: '2024-02-02',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-2-8-fire",
    name: "2-8 Fire",
    county: "Calaveras",
    lat: 38.0,
    lng: -120.5,
    acres: 1326,
    containment: 60,
    status: 'Active' as const,
    personnel: 400,
    structures_threatened: 50,
    evacuation_orders: false,
    started_date: '2024-02-08',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-6-2-fire",
    name: "6-2 Fire",
    county: "Tuolumne",
    lat: 37.77721,
    lng: -120.38529,
    acres: 951,
    containment: 80,
    status: 'Active' as const,
    personnel: 300,
    structures_threatened: 30,
    evacuation_orders: false,
    started_date: '2024-06-02',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-25-fire",
    name: "25 Fire",
    county: "Stanislaus",
    lat: 37.906,
    lng: -120.863833,
    acres: 47,
    containment: 75,
    status: 'Active' as const,
    personnel: 100,
    structures_threatened: 5,
    evacuation_orders: false,
    started_date: '2024-01-25',
    cause: 'Under Investigation'
  },
  {
    id: "ca-2025-kibbie-fire",
    name: "Kibbie Fire",
    county: "Tuolumne",
    lat: 38.1,
    lng: -119.8,
    acres: 13.4,
    containment: 0,
    status: 'Active' as const,
    personnel: 50,
    structures_threatened: 2,
    evacuation_orders: false,
    started_date: '2025-08-15',
    cause: 'Lightning'
  }
];

export const LAST_UPDATED = '2025-09-03T23:35:00Z';