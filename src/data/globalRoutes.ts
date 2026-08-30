import { GlobalRoute } from '../types';

export const GLOBAL_ROUTES: GlobalRoute[] = [
  {
    id: 'india-usa',
    name: 'India ➔ USA (Silicon Valley / Ashburn)',
    from: {
      city: 'Mumbai',
      country: 'India',
      coords: [68, 48], // [x%, y%] on world map layout
      flag: '🇮🇳',
    },
    to: {
      city: 'San Francisco & Ashburn',
      country: 'United States',
      coords: [18, 38],
      flag: '🇺🇸',
    },
    intermediateHops: [
      { name: 'Red Sea Subsea Cable Gateway (Oman/Egypt)', coords: [58, 45], type: 'cable_landing' },
      { name: 'Marseille & London IXP Gateway', coords: [48, 32], type: 'ixp' },
      { name: 'Transatlantic Subsea Cable (Dunant / TAT-14)', coords: [32, 34], type: 'cable_landing' },
    ],
    distanceKm: 13850,
    estimatedLatencyMs: 168,
    typicalHops: 14,
    subseaCables: ['SEA-ME-WE 5', 'AAE-1', 'Dunant Fiber', 'MAREA Cable'],
    description:
      'Travels through the Arabian Sea, crosses the Suez Canal corridor via submarine cables, passes through European Internet Exchange Points in Frankfurt/London, and crosses the Atlantic Ocean into US cloud data centers.',
  },
  {
    id: 'india-singapore',
    name: 'India ➔ Singapore (Asian Hub)',
    from: {
      city: 'Chennai',
      country: 'India',
      coords: [70, 52],
      flag: '🇮🇳',
    },
    to: {
      city: 'Singapore Central',
      country: 'Singapore',
      coords: [78, 58],
      flag: '🇸🇬',
    },
    intermediateHops: [
      { name: 'Bay of Bengal Subsea Trunk (BBG)', coords: [73, 54], type: 'cable_landing' },
      { name: 'Strait of Malacca Cable Corridor', coords: [76, 56], type: 'ixp' },
    ],
    distanceKm: 2920,
    estimatedLatencyMs: 34,
    typicalHops: 7,
    subseaCables: ['BBG (Bay of Bengal Gateway)', 'i2i Cable Network', 'SMW4'],
    description:
      'A lightning-fast ultra-low-latency direct hop across the Bay of Bengal into Singapore’s Equinix and Singtel mega data centers, serving Southeast Asia.',
  },
  {
    id: 'india-europe',
    name: 'India ➔ Europe (Frankfurt / London)',
    from: {
      city: 'Mumbai',
      country: 'India',
      coords: [68, 48],
      flag: '🇮🇳',
    },
    to: {
      city: 'Frankfurt & London',
      country: 'Germany / UK',
      coords: [49, 30],
      flag: '🇪🇺',
    },
    intermediateHops: [
      { name: 'Gulf of Oman & UAE Landing', coords: [60, 44], type: 'cable_landing' },
      { name: 'Egypt Terrestrial Fiber Transit', coords: [54, 40], type: 'ixp' },
      { name: 'Mediterranean Subsea Segment', coords: [50, 36], type: 'cable_landing' },
    ],
    distanceKm: 6580,
    estimatedLatencyMs: 82,
    typicalHops: 9,
    subseaCables: ['Europe India Gateway (EIG)', 'FLAG Europe Asia (FEA)', '2Africa Trunk'],
    description:
      'High-capacity optical routes connecting Mumbai to the DE-CIX Frankfurt Internet Exchange, the busiest data exchange point on Earth.',
  },
  {
    id: 'usa-europe',
    name: 'USA (New York) ➔ Europe (London)',
    from: {
      city: 'New York',
      country: 'United States',
      coords: [26, 36],
      flag: '🇺🇸',
    },
    to: {
      city: 'London',
      country: 'United Kingdom',
      coords: [46, 28],
      flag: '🇬🇧',
    },
    intermediateHops: [
      { name: 'Halifax / Bude Landing Station', coords: [36, 31], type: 'cable_landing' },
    ],
    distanceKm: 5570,
    estimatedLatencyMs: 65,
    typicalHops: 8,
    subseaCables: ['Grace Hopper Cable', 'Havfrue / AEC-2', 'Apollo Cable System'],
    description:
      'The legendary Transatlantic corridor carrying over 250 Terabits/sec of international financial and cloud traffic.',
  },
];
