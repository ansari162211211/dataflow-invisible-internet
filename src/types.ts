export interface NetworkStage {
  id: number;
  key: 'device' | 'wifi' | 'isp' | 'backbone' | 'datacenter' | 'destination';
  title: string;
  subtitle: string;
  emoji: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  analogy: string;
  protocol: string;
  hardware: string;
  speed: string;
  color: string;
  glowColor: string;
  packetTransform: string;
}

export interface PacketChunk {
  id: number;
  total: number;
  textPayload: string;
  binaryPayload: string;
  hexPayload: string;
  sequenceNumber: number;
  sourceIp: string;
  destIp: string;
  sourcePort: number;
  destPort: number;
  checksum: string;
  ttl: number;
}

export interface GlobalRoute {
  id: string;
  name: string;
  from: {
    city: string;
    country: string;
    coords: [number, number]; // [xPercent, yPercent] on map
    flag: string;
  };
  to: {
    city: string;
    country: string;
    coords: [number, number];
    flag: string;
  };
  intermediateHops: Array<{
    name: string;
    coords: [number, number];
    type: 'cable_landing' | 'ixp' | 'satellite';
  }>;
  distanceKm: number;
  estimatedLatencyMs: number;
  typicalHops: number;
  subseaCables: string[];
  description: string;
}

export interface KnowledgeTopic {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  summary: string;
  analogy: string;
  howItWorks: string[];
  funFact: string;
  iconName: string;
  color: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
