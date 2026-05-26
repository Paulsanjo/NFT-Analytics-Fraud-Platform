export type RiskRating = "Green" | "Yellow" | "Red";

export interface RiskBreakdown {
  washTradeProb: number;
  holderConcentration: number;
  teamCredibility: number;
  contractAudit: number;
  socialManipulation: number;
  liquidityDepth: number;
}

export interface CollectionData {
  id?: string;
  name: string;
  chain: string;
  symbol: string;
  floorPrice: number;
  floorPriceUsd: number;
  velocity24h: number;
  realVolume: number;
  washVolume: number;
  holderCount: number;
  totalSupply: number;
  giniCoefficient: number;
  riskScore: number;
  riskRating: RiskRating;
  auditStatus: string;
  plagiarismReport: string;
  teamCredibility: string;
  socialManipulationScore: number;
  liquidityDepth: string;
  breakdown: RiskBreakdown;
  description: string;
}

export interface ThreatLog {
  id: string;
  time: string;
  chain: string;
  type: string;
  message: string;
  severity: "green" | "yellow" | "red";
}

export interface GraphNode {
  id: string;
  group: number;
  type: string;
  washInvolved: number;
}

export interface GraphLink {
  source: string;
  target: string;
  val: number;
  type: string;
}
