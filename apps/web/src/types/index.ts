export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplianceStatus = 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'INSUFFICIENT_EVIDENCE';

export type Industry = 'Finance' | 'Healthcare' | 'Education' | 'Agriculture';

export interface AISystem {
  id: string;
  name: string;
  code_identifier: string;
  business_purpose: string;
  financial_use_case: string;
  criticality_tier: string;
  deployment_status: string;
  readiness_score: number;
  compliance_score: number;
  risk_level: RiskLevel;
  last_assessed: string;
  industry: Industry;
}

export interface RiskVector {
  domain: string;
  label: string;
  score: number;
  status: RiskLevel;
  findingCount: number;
  description: string;
}

export interface DocumentSource {
  id: string;
  name: string;
  type: string; // PDF, DOCX, TXT, MD, JSON
  category: string;
  status: 'Parsed & Indexed' | 'Processing' | 'Failed' | 'Ready for Assessment';
  fileSize: string;
  lastUpdated: string;
  pageCount?: number;
  findingsCount?: number;
  contentSnippet?: string;
}

export type SourceType =
  | 'LAW'
  | 'REGULATION'
  | 'REGULATORY_GUIDANCE'
  | 'STANDARD'
  | 'FRAMEWORK'
  | 'ETHICS_PRINCIPLE'
  | 'INTERNAL_POLICY';

export interface RegulatoryProvenance {
  sourceId: string;                     // e.g. "SRC-SAMA-AI-2024"
  framework: string;                    // e.g. "SAMA AI Guidance"
  sourceType: SourceType;               // e.g. "REGULATORY_GUIDANCE"
  title: string;                        // Full regulatory title
  issuingOrganization: string;          // e.g. "Saudi Central Bank (SAMA)"
  jurisdiction: string;                 // e.g. "Saudi Arabia (KSA)"
  sector: string;                       // e.g. "Banking & Finance"
  documentVersion: string;              // e.g. "2024.1"
  publicationDate?: string;             // e.g. "2024-01-15"
  effectiveDate?: string;               // e.g. "2024-06-01"
  url?: string;                         // Regulatory URL
  page?: number;                        // e.g. 14
  section?: string;                     // e.g. "Section 5: Model Risk Management"
  article?: string;                     // e.g. "Article 13"
  clause?: string;                      // e.g. "Clause 5.3"
  requirementId: string;                // e.g. "REQ-SAMA-AI-5.3"
  requirementVersion?: number;          // e.g. 1
  requirementText: string;              // Exact statutory/regulatory requirement text
  documentHash: string;                 // SHA-256 hash of requirement
  sourceDocumentHash?: string;          // SHA-256 hash of source document
  retrievedAt: string;                  // ISO timestamp
  status: 'ACTIVE' | 'SUPERSEDED' | 'DRAFT' | 'DEPRECATED';
  language: string;                     // 'en' | 'ar'
  kbVersion: string;                    // e.g. "v1.4.2-provenance"
}

export interface KnowledgeSource {
  id: string;
  code: string;
  sourceId?: string;
  sourceType?: SourceType;
  title: string;
  organization: string;
  country: string;
  jurisdiction?: string;
  sector?: string;
  topic: string;
  documentType: string;
  status: 'Active' | 'Indexed';
  version: string;
  effectiveDate?: string;
  documentHash?: string;
  url?: string;
}

export interface EvidenceCitation {
  documentName: string;
  documentId: string;
  pageNumber: number;
  section?: string;
  highlightedQuote: string;
  contextExcerpt: string;
  retrievalTimestamp?: string;
}

export type ComplianceEvidenceState = 
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'PARTIALLY_COMPLIANT'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_APPLICABLE';

export type EvidenceStrength = 
  | 'STRONG'
  | 'MODERATE'
  | 'WEAK'
  | 'NONE';

export interface RequirementEvaluationRecord {
  requirementId: string;
  framework: string;
  clause: string;
  category: string;
  weight: number;
  status: ComplianceEvidenceState;
  evidenceStrength: EvidenceStrength;
  evidenceIds: string[];
  evidenceLocation?: string;
  reasoning: string;
  confidence: number;
  reviewRequired: boolean;
  provenance?: RegulatoryProvenance;
}

export interface CategoryScoreDetail {
  category: string;
  weight: number;
  rawScore: number;
  adjustedScore: number;
  penaltyDeduction: number;
  totalApplicableRequirements: number;
  compliantCount: number;
  partiallyCompliantCount: number;
  nonCompliantCount: number;
  insufficientEvidenceCount: number;
  violationsBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface DeterministicScoreSnapshot {
  overallComplianceScore: number;
  overallRiskLevel: RiskLevel;
  scoringEngineVersion: string;
  scoringConfigurationVersion: string;
  assessmentVersion: string;
  calculationTimestamp: string;
  inputHash: string;
  categoryScores: Record<string, CategoryScoreDetail>;
  penaltiesApplied: Array<{
    category: string;
    penaltyPoints: number;
    formula: string;
    capped: boolean;
  }>;
  mathematicalProof: {
    formula: string;
    rawCategoryFormula: string;
    penaltyFormula: string;
    adjustedCategoryFormula: string;
  };
}

export interface ComplianceFinding {
  id: string;
  severity: RiskLevel;
  category: string;
  title: string;
  description: string;
  evidence: EvidenceCitation;
  regulationReference: string;
  recommendation: string;
  confidenceScore: number;
  isResolved: boolean;
  assignedOwner?: string;
  criteriaId: string;
  provenance: RegulatoryProvenance;
  provenanceStatus?: 'VERIFIED' | 'UNVERIFIED';
  evidenceStrength?: EvidenceStrength;
  reviewRequired?: boolean;
}

export interface AssessmentProfile {
  jurisdiction: string;
  sector: string;
  organizationType: string;
  aiUseCase: string;
  systemPurpose: string;
  dataTypes: string[];
  sensitiveData: boolean;
  deploymentStage: string;
  productionStatus: string;
  decisionImpact: string;
  affectedUsers: string;
  humanOversight: string;
  thirdPartyComponents: boolean;
  riskLevel: RiskLevel;
  inferredFields?: Record<string, boolean>;
}

export interface ApplicabilityEvaluationItem {
  requirementId: string;
  sourceId: string;
  framework: string;
  clause: string;
  sourceType: SourceType;
  applicable: boolean;
  confidence: number;
  applicabilityReasons: string[];
  exclusionReasons: string[];
  provenance: RegulatoryProvenance;
  requirementText: string;
}

export interface ApplicabilityMatrixResult {
  totalEvaluated: number;
  applicableCount: number;
  excludedCount: number;
  applicabilityRatio: number;
  evaluatedProfile: AssessmentProfile;
  applicableRequirements: ApplicabilityEvaluationItem[];
  excludedRequirements: ApplicabilityEvaluationItem[];
  evaluatedAt: string;
}

export interface AssessmentPipelineStep {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  progress: number;
  description: string;
  timestamp?: string;
}

export type AnnotationCategory = 'compliance_violation' | 'risk' | 'warning' | 'compliant_evidence';

export interface EvidenceAnnotation {
  id: string;
  findingId: string;
  documentId: string;
  documentName: string;
  pageNumber: number;
  extractedText: string;
  annotationType: AnnotationCategory;
  severity: RiskLevel;
  aiComment: string;
  requirementReference: string;
  recommendation: string;
  boundingBox?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export type FindingTransitionState =
  | 'NEW'
  | 'RESOLVED'
  | 'IMPROVED'
  | 'REGRESSED'
  | 'UNCHANGED'
  | 'NOT_APPLICABLE';

export interface FindingTransitionItem {
  requirementId: string;
  framework: string;
  clause: string;
  category: string;
  statusBase: ComplianceEvidenceState | string;
  statusTarget: ComplianceEvidenceState | string;
  transitionState: FindingTransitionState;
  evidenceStrengthBase?: EvidenceStrength | string;
  evidenceStrengthTarget?: EvidenceStrength | string;
  evidenceLocationBase?: string;
  evidenceLocationTarget?: string;
  reasoningBase: string;
  reasoningTarget: string;
  remediationAction?: string;
  provenance?: RegulatoryProvenance;
}

export interface DetailedVersionComparisonResult {
  comparisonId: string;
  baseVersion: {
    versionId: string;
    versionNumber: number;
    versionLabel: string;
    score: number;
    riskLevel: RiskLevel;
    kbVersion: string;
    scoringVersion: string;
    modelVersion: string;
    createdAt: string;
  };
  targetVersion: {
    versionId: string;
    versionNumber: number;
    versionLabel: string;
    score: number;
    riskLevel: RiskLevel;
    kbVersion: string;
    scoringVersion: string;
    modelVersion: string;
    createdAt: string;
  };
  metricsDiff: {
    complianceScore: {
      base: number;
      target: number;
      delta: number;
      improved: boolean;
    };
    criticalFindings: {
      base: number;
      target: number;
      delta: number;
    };
    highFindings: {
      base: number;
      target: number;
      delta: number;
    };
    mediumFindings: {
      base: number;
      target: number;
      delta: number;
    };
    lowFindings: {
      base: number;
      target: number;
      delta: number;
    };
    resolvedCount: number;
    newCount: number;
    improvedCount: number;
    regressedCount: number;
    unchangedCount: number;
    regulatoryCoverage: {
      base: number;
      target: number;
      delta: number;
    };
  };
  findingTransitions: FindingTransitionItem[];
}

export interface VersionComparison {
  versionA: string;
  versionB: string;
  scoreA: number;
  scoreB: number;
  resolvedCount: number;
  newRisksCount: number;
  changes: {
    type: 'added' | 'removed' | 'risk_new';
    description: string;
  }[];
}

// ===================================================================
// GOVERNANCE SCENARIO SIMULATOR TYPES
// ===================================================================

export type SimulationCategory =
  | 'VENDOR_RISK'
  | 'HUMAN_OVERSIGHT'
  | 'MODEL_DRIFT'
  | 'DATA_RETENTION'
  | 'TRANSPARENCY'
  | 'VENDOR_UPDATE';

export interface ScoreImpact {
  privacy: number;
  security: number;
  fairness: number;
  transparency: number;
  human_oversight: number;
  governance: number;
  monitoring: number;
  overall_compliance: number;
  overall_readiness: number;
}

export interface SimulationChoice {
  id: string;
  label: string;
  icon: string; // emoji
  consequence: string;
  scoreModifier: ScoreImpact;
  isOptimal: boolean;
  mitigationApplied: boolean;
}

export interface TriggeredPolicy {
  id: string;
  policyName: string;
  clause: string;
  source: string;
  confidence: number;
  requirement: string;
}

export interface GovernanceGap {
  id: string;
  title: string;
  severity: RiskLevel;
  description: string;
  category: string;
}

export interface SimulationRecommendation {
  id: string;
  priority: RiskLevel;
  issue: string;
  whyItMatters: string;
  action: string;
  expectedComplianceGain: number;
  expectedReadinessGain: number;
  relatedPolicy: string;
  estimatedEffort: string;
  owner: string;
  status: 'OPEN' | 'RESOLVED' | 'IN_PROGRESS';
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  category: SimulationCategory;
  timestamp: string; // e.g. "10:30"
  timeLabel: string; // e.g. "Day 1 — 10:30 AM"
  choices: SimulationChoice[];
  triggeredPolicies: TriggeredPolicy[];
  governanceGaps: GovernanceGap[];
  recommendations: SimulationRecommendation[];
  immediateImpact: ScoreImpact; // impact before user choice
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'DEPLOYMENT' | 'INCIDENT' | 'VIOLATION' | 'ALERT' | 'MITIGATION' | 'RESOLUTION';
  severity?: RiskLevel;
  scenarioId?: string;
}

export interface SimulationScoreSnapshot {
  eventLabel: string;
  compliance: number;
  readiness: number;
  privacy: number;
  security: number;
  fairness: number;
  transparency: number;
  human_oversight: number;
  governance: number;
  monitoring: number;
}

export interface SimulationSummaryData {
  initialCompliance: number;
  finalCompliance: number;
  recoveredCompliance: number;
  initialReadiness: number;
  finalReadiness: number;
  recoveredReadiness: number;
  totalViolations: number;
  resolved: number;
  remaining: number;
  governanceMaturity: 'IMPROVED' | 'UNCHANGED' | 'DEGRADED';
  scoreHistory: SimulationScoreSnapshot[];
}

// ===================================================================
// GENERATIVE WHAT-IF OPTIMIZATION AGENT TYPES (AGENT 10)
// ===================================================================

export interface WhatIfScenario {
  id: string;
  pillLabel: string;
  icon: string; // e.g. "✨", "🛡️", "⚖️", "🔒"
  category: 'FEATURE_CHANGE' | 'OVERSIGHT' | 'DATA_GOVERNANCE' | 'SECURITY' | 'EXPLAINABILITY' | 'REGULATORY_UPDATE';
  title: string;
  description: string;
  proposedAction: string;
  scoreDeltas: ScoreImpact;
  satisfiedClauses: {
    framework: string;
    clause: string;
    title: string;
  }[];
  resolvedFindingsCount: number;
  estimatedEffort: string;
  priorityGain: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface WhatIfScoreProjection {
  baselineCompliance: number;
  projectedCompliance: number;
  baselineReadiness: number;
  projectedReadiness: number;
  privacyDelta: number;
  securityDelta: number;
  fairnessDelta: number;
  transparencyDelta: number;
  humanOversightDelta: number;
  governanceDelta: number;
  monitoringDelta: number;
}

export interface WhatIfCustomAnalysisResult {
  query: string;
  understanding: string;
  projectedDeltas: ScoreImpact;
  matchedClauses: {
    framework: string;
    clause: string;
    requirement: string;
  }[];
  recommendation: string;
  confidence: number;
}

// ===================================================================
// AUDIT TRAIL & AI EXECUTION LOGGING (PART 5)
// ===================================================================

export type AuditEventType =
  | 'USER_LOGIN'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_DELETED'
  | 'DOCUMENT_PROCESSED'
  | 'ASSESSMENT_CREATED'
  | 'ASSESSMENT_STARTED'
  | 'ASSESSMENT_COMPLETED'
  | 'REQUIREMENT_RETRIEVED'
  | 'FINDING_CREATED'
  | 'FINDING_UPDATED'
  | 'FINDING_RESOLVED'
  | 'EVIDENCE_ADDED'
  | 'ACTION_CREATED'
  | 'ACTION_ASSIGNED'
  | 'ACTION_COMPLETED'
  | 'POLICY_UPDATED'
  | 'ASSESSMENT_VERSION_CREATED'
  | 'ASSESSMENT_COMPARED'
  | 'REPORT_GENERATED'
  | 'SCORE_CALCULATED'
  | 'AGENT_EXECUTED'
  | 'MODEL_EXECUTED'
  | 'HUMAN_OVERRIDE';

export type ActorType = 'USER' | 'AGENT' | 'SYSTEM' | 'AUTOMATION';

export interface AIExecutionLogRecord {
  agentName: string;
  agentVersion: string;
  modelProvider: string;
  modelName: string;
  modelVersion: string;
  promptVersion: string;
  retrievalConfiguration: {
    topK: number;
    similarityThreshold: number;
    rerankingEnabled: boolean;
    denseWeight: number;
  };
  knowledgeBaseVersion: string;
  inputReference: string; // SHA-256 URN e.g. "urn:sha256:e3b0c44..."
  outputReference: string; // SHA-256 URN
  timestamp: string;
  executionStatus: 'SUCCESS' | 'FAILED' | 'FALLBACK';
  latencyMs?: number;
  tokenCount?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface HumanOverrideRecord {
  findingId: string;
  requirementId: string;
  originalStatus: string;
  newStatus: string;
  reason: string;
  user: string;
  userRole: string;
  timestamp: string;
  externalEvidenceId?: string;
}

export interface AuditTrailEvent {
  eventId: string;
  sequenceNumber: number;
  eventType: AuditEventType;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  systemComponent: string; // e.g. 'RAG_ENGINE', 'AGENT_ORCHESTRATOR', 'SCORING_ENGINE', 'API_GATEWAY', 'WEB_UI'
  actor: {
    actorId: string;
    actorName: string;
    actorType: ActorType;
    role?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  timestamp: string;
  projectId?: string;
  projectName?: string;
  assessmentId?: string;
  assessmentVersion?: number;
  summary: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  aiExecutionData?: AIExecutionLogRecord;
  humanOverrideData?: HumanOverrideRecord;
  // Cryptographic Tamper-Evidence
  eventHash: string; // SHA-256
  previousEventHash: string;
  chainVerified: boolean;
}

export interface AuditFilterParams {
  eventType?: string;
  actorType?: string;
  actorId?: string;
  projectId?: string;
  severity?: string;
  systemComponent?: string;
  searchQuery?: string;
}

// ===================================================================
// 4-LAYER GOVERNANCE GAP ANALYSIS (PART 6)
// ===================================================================

export type LayerState = 'PRESENT' | 'PARTIAL' | 'MISSING' | 'UNKNOWN';

export type OverallGapStatus =
  | 'COVERED'
  | 'PARTIAL_COVERAGE'
  | 'EVIDENCE_GAP'
  | 'CONTROL_GAP'
  | 'POLICY_GAP'
  | 'CRITICAL_GAP'
  | 'MAJOR_GAP';

export interface GovernanceLayerData {
  title: string;
  documentName?: string;
  location?: string;
  excerpt?: string;
  legalObligation?: string;
  mechanism?: string;
  confidence?: number;
  status: LayerState;
}

export interface RequirementGapMatrixItem {
  requirementId: string;
  framework: string;
  clause: string;
  category: string;
  severity: RiskLevel | string;
  // 4 Discrete Layers
  regulationState: LayerState;
  policyState: LayerState;
  controlState: LayerState;
  evidenceState: LayerState;
  // Overall State & Prioritization
  overallGapStatus: OverallGapStatus;
  brokenLayer: 'POLICY' | 'CONTROL' | 'EVIDENCE' | 'NONE' | string;
  prioritizationScore: number; // 0 - 100
  priorityRank?: number;
  // Deep Drill-down Metadata for Clickable Cells
  regulationDetails?: {
    sourceId: string;
    framework: string;
    clause: string;
    legalObligation: string;
    jurisdiction: string;
    provenanceHash?: string;
  };
  policyDetails?: {
    policyDocument: string;
    section: string;
    policyText: string;
    confidence: number;
    status: LayerState;
  };
  controlDetails?: {
    controlId: string;
    controlName: string;
    implementationMechanism: string;
    status: LayerState;
  };
  evidenceDetails?: {
    evidenceId: string;
    documentName: string;
    location: string;
    excerpt: string;
    status: LayerState;
  };
  remediationAction?: string;
  remediationOwner?: string;
  remediationDeadline?: string;
}

export interface GapAnalysisMatrixResult {
  totalRequirements: number;
  metrics: {
    coveredCount: number;
    evidenceGapCount: number;
    controlGapCount: number;
    policyGapCount: number;
    partialCount: number;
    coverageRatio: number;
  };
  matrix: RequirementGapMatrixItem[];
}

// ===================================================================
// GAP-TO-CLOSURE GOVERNANCE LIFECYCLE (PART 7)
// ===================================================================

export type ActionStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'CLOSED'
  | 'REJECTED';

export type OwnerType = 'INDIVIDUAL' | 'TEAM' | 'DEPARTMENT';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'PENDING_REVIEW'
  | 'VERIFIED_EFFECTIVE'
  | 'FAILED_VERIFICATION';

export interface RemediationActionItem {
  actionId: string;
  findingId?: string;
  requirementId: string;
  framework: string;
  clause: string;
  title: string;
  description: string;
  ownerType: OwnerType;
  ownerName: string;
  ownerId?: string;
  department: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: ActionStatus;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  evidenceRequired: boolean;
  evidenceDescription?: string;
  evidenceIds: string[];
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  reassessmentScoreDelta?: number;
  reassessmentStatus?: string;
}

export interface GovernanceLifecycleMetrics {
  totalActions: number;
  openActions: number;
  overdueActions: number;
  pendingVerification: number;
  resolvedFindings: number;
  averageResolutionTimeDays: number;
  riskReductionPct: number;
  complianceImprovementPct: number;
}

// ===================================================================
// EXPLAINABLE ADVERSARIAL GOVERNANCE SIMULATOR (PART 8)
// ===================================================================

export type AdversarialScenarioCategory =
  | 'DATA_LEAKAGE'
  | 'MODEL_MANIPULATION'
  | 'BIAS_DISCRIMINATION'
  | 'VENDOR_FAILURE'
  | 'HUMAN_OVERSIGHT_FAILURE'
  | 'REGULATORY_CHANGE'
  | 'SECURITY_FAILURE'
  | 'MONITORING_FAILURE'
  | 'DOCUMENTATION_FAILURE'
  | 'GOVERNANCE_FAILURE';

export interface RiskSimulationMetrics {
  likelihood: number; // 1 - 5
  impact: number; // 1 - 5
  inherentRisk: number; // 1 - 25
  existingControls: string[];
  controlEffectivenessPct: number; // 0 - 100
  residualRisk: number; // 1 - 25
}

export interface AdversarialScenarioGrounding {
  whyGenerated: string[];
  relatedFindingIds: string[];
  relatedRegulatoryClauses: string[];
  relatedEvidenceArtifacts: string[];
}

export interface AdversarialScenario {
  scenarioId: string;
  title: string;
  description: string;
  riskCategory: AdversarialScenarioCategory | string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  triggerConditions: string[];
  relatedFindings: string[];
  relatedRequirements: string[];
  relatedEvidence: string[];
  riskSimulation: RiskSimulationMetrics;
  provenanceExplanation: AdversarialScenarioGrounding;
  mitigations: Array<{ action: string; riskReduction: number }>;
  confidence: number;
  generatedBy: string;
  disclaimer: string;
  isSimulated: boolean;
}

// ===================================================================
// UNCERTAINTY-AWARE WHAT-IF SIMULATOR (PART 9)
// ===================================================================

export type ConfidenceBand = 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';

export interface WhatIfAssumption {
  id: string;
  text: string;
  category: 'CONTROL' | 'SCOPE' | 'POLICY' | 'MONITORING' | 'EVIDENCE' | string;
  fulfilled: boolean;
  weight: number;
}

export interface ProgressiveStageComparison {
  stage: 'BASELINE' | 'POLICY_ONLY' | 'POLICY_AND_CONTROL' | 'POLICY_CONTROL_MONITORING' | string;
  label: string;
  score: number;
  delta: number;
  confidence: string;
  confidencePct: number;
  description: string;
}

export interface UncertaintyAwareWhatIfScenario {
  simulationId: string;
  pillLabel: string;
  title: string;
  description: string;
  proposedChanges: string[];
  affectedRequirements: string[];
  affectedControls: string[];
  assumptions: WhatIfAssumption[];
  baselineScore: number;
  projectedScore: number;
  estimatedImprovement: number;
  confidenceLevel: ConfidenceBand;
  confidencePct: number;
  confidenceRationale: string;
  affectedFindings: string[];
  affectedRiskLevel: {
    baseline: string;
    projected: string;
  };
  progressiveStages: ProgressiveStageComparison[];
  disclaimer: string;
  scoreDeltas: {
    privacy: number;
    security: number;
    fairness: number;
    transparency: number;
    human_oversight: number;
    governance: number;
    monitoring: number;
    overall_compliance: number;
    overall_readiness: number;
  };
}

// ===================================================================
// EXECUTIVE GOVERNANCE VIEW (PART 10)
// ===================================================================

export interface ExecutivePostureSummary {
  overall_score: number; // e.g. 84
  score_delta: number; // e.g. +13
  posture_status: 'HEALTHY' | 'CONTROLLED_WITH_CONDITIONS' | 'ELEVATED_RISK' | 'CRITICAL' | string;
  risk_rating: 'LOW' | 'LOW_TO_MEDIUM' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  assessment_version: string; // e.g. 'v3.0'
  last_evaluated_at: string;
}

export interface ExecutiveKpis {
  critical_risks: number; // e.g. 2
  high_risks: number; // e.g. 6
  open_actions: number; // e.g. 9
  overdue_actions: number; // e.g. 3
  resolved_findings: number; // e.g. 17
  remediation_rate_pct: number; // e.g. 65.4%
}

export interface ExecutiveCoreMetrics {
  overall_governance_score: number;
  compliance_score: number;
  risk_score: number;
  regulatory_coverage_pct: number;
  policy_coverage_pct: number;
  control_coverage_pct: number;
  evidence_coverage_pct: number;
  open_critical_risks: number;
  open_high_risks: number;
  remediation_progress_pct: number;
}

export interface ExecutiveTrendPoint {
  version: string; // e.g. 'v1.0'
  date: string;
  governance_score: number;
  compliance_score: number;
  risk_score: number;
  open_findings: number;
}

export interface ExecutiveTopRiskItem {
  rank: number;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  framework: string;
  finding_id: string;
  evidence_url: string;
  evidence_name: string;
  action_required: string;
}

export interface ExecutiveRecommendationItem {
  priority_rank: number;
  title: string;
  description: string;
  expected_governance_gain: number; // e.g. +15.0
  expected_impact: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affected_requirements_count: number;
  open_findings_count: number;
  estimated_effort: string;
  owner_department: string;
  action_link: string;
}

export interface ExecutiveGovernancePosture {
  posture: ExecutivePostureSummary;
  summary_kpis: ExecutiveKpis;
  core_metrics: ExecutiveCoreMetrics;
  trend_history: ExecutiveTrendPoint[];
  top_risks: ExecutiveTopRiskItem[];
  executive_recommendations: ExecutiveRecommendationItem[];
}

// ===================================================================
// AI GUARDIAN SELF-GOVERNANCE LAYER (PART 11)
// ===================================================================

export interface AIComponentItem {
  component_id: string;
  name: string;
  provider: string;
  model: string;
  model_version: string;
  agent_name: string;
  agent_version: string;
  prompt_id: string;
  prompt_version: string;
  purpose: string;
  data_used: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evaluation_status: string;
  approval_status: 'APPROVED_FOR_PRODUCTION' | 'PENDING_VALIDATION' | 'REJECTED' | 'DEPRECATED';
}

export interface PromptVersionItem {
  prompt_id: string;
  version: string;
  author: string;
  content_hash: string;
  system_prompt_text?: string;
  text?: string;
  change_reason: string;
  approval_status: 'APPROVED' | 'DRAFT' | 'SUPERSEDED' | 'REJECTED';
  is_active: boolean;
  created_at: string;
}

export interface AIRiskControlItem {
  control_id: string;
  risk_category: 'HALLUCINATION' | 'CITATION_ACCURACY' | 'BIAS' | 'PROMPT_INJECTION' | 'DATA_LEAKAGE' | 'UNSAFE_OUTPUT' | 'MODEL_DRIFT' | 'RETRIEVAL_FAILURES' | 'INCORRECT_SCORING' | string;
  title: string;
  technical_mechanism: string;
  enforcement_layer: string;
  verification_method: string;
  status: 'ACTIVE_ENFORCING' | 'MONITORING_ONLY' | 'PENDING_DEPLOYMENT';
}

export interface SelfAssessmentData {
  project_id: string;
  title: string;
  evaluated_system: string;
  compliance_score: number;
  readiness_score: number;
  governance_status: string;
  assessed_frameworks: string[];
  total_requirements_assessed: number;
  compliant_count: number;
  partially_compliant_count: number;
  non_compliant_count: number;
  human_overrides_logged: number;
  prompt_versions_active: number;
  audit_hash_chain_verified: boolean;
  evidence_artifacts: string[];
}

export interface SelfGovernanceManifest {
  status: string;
  platform_version: string;
  components_count: number;
  prompts_count: number;
  risk_controls_count: number;
  components: AIComponentItem[];
  prompts: PromptVersionItem[];
  risk_controls: AIRiskControlItem[];
  self_assessment: SelfAssessmentData;
}

// ===================================================================
// AI EVALUATION & QUALITY ASSURANCE ENGINE (PART 12)
// ===================================================================

export interface RetrievalMetrics {
  retrieval_precision_pct: number;
  retrieval_recall_pct: number;
  relevant_requirement_coverage_pct: number;
}

export interface EvidenceMetrics {
  evidence_grounding_pct: number;
  evidence_accuracy_pct: number;
  citation_accuracy_pct: number;
}

export interface ComplianceMetrics {
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  accuracy_pct: number;
  f1_score_pct: number;
}

export interface AIQualityMetrics {
  hallucination_rate_pct: number;
  unsupported_claim_rate_pct: number;
  reasoning_consistency_pct: number;
  score_consistency_pct: number;
}

export interface EvaluationTestCaseResult {
  test_case_id: string;
  name: string;
  industry: string;
  jurisdiction: string;
  expected_status: string;
  actual_status: string;
  expected_citations: string[];
  actual_citations: string[];
  citations_matched: boolean;
  expected_risk: string;
  actual_risk: string;
  hallucination_detected: boolean;
  passed: boolean;
  latency_ms: number;
}

export interface RegressionComparisonDetails {
  baseline_run_id: string;
  quality_score_delta: number;
  citation_accuracy_delta: number;
  hallucination_rate_delta: number;
  false_positive_delta: number;
  regressions_count: number;
  status: string;
}

export interface EvaluationRunItem {
  run_id: string;
  run_number: number;
  status: 'COMPLETED_PASS' | 'REGRESSION_DETECTED' | 'RUNNING' | 'FAILED';
  triggered_by: string;
  trigger_reason: string;
  target_component: string;
  timestamp: string;
  total_test_cases: number;
  passed_test_cases: number;
  failed_test_cases: number;
  overall_quality_score: number;
  retrieval_metrics: RetrievalMetrics;
  evidence_metrics: EvidenceMetrics;
  compliance_metrics: ComplianceMetrics;
  ai_quality_metrics: AIQualityMetrics;
  test_case_results?: EvaluationTestCaseResult[];
  regression_detected: boolean;
  regression_details?: RegressionComparisonDetails | null;
}

export interface EvaluationTestCase {
  test_case_id: string;
  name: string;
  industry: string;
  jurisdiction: string;
  scenario: string;
  documents: Array<{ document_name: string; page_number: number; quote: string }>;
  expected_requirements: string[];
  expected_findings: string[];
  expected_status: string;
  expected_citations: string[];
  expected_risk: string;
  expected_score_min: number;
  expected_score_max: number;
}








