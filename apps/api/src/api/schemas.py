import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# ─── Auth Schemas ───────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserProfileResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: str
    organization_id: uuid.UUID
    is_active: bool

    class Config:
        from_attributes = True

# ─── Organization Schemas ───────────────────────────────────────
class OrganizationResponse(BaseModel):
    id: uuid.UUID
    name: str
    sector_type: str
    jurisdiction: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    sector_type: Optional[str] = None
    jurisdiction: Optional[str] = None

# ─── AI System Schemas ──────────────────────────────────────────
class AISystemCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    code_identifier: str = Field(pattern=r"^[A-Z0-9_\-]{3,50}$")
    business_purpose: str = Field(min_length=50, max_length=2000)
    financial_use_case: str
    criticality_tier: str
    deployment_status: str = "development"

class AISystemResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    code_identifier: str
    business_purpose: str
    financial_use_case: str
    criticality_tier: str
    deployment_status: str
    owner_user_id: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AISystemUpdate(BaseModel):
    name: Optional[str] = None
    business_purpose: Optional[str] = None
    criticality_tier: Optional[str] = None
    deployment_status: Optional[str] = None

class AIModelCreate(BaseModel):
    model_name: str = Field(max_length=255)
    version: str = Field(pattern=r"^\d+\.\d+\.\d+$")
    algorithm_type: Optional[str] = None
    is_third_party: bool = False
    vendor_name: Optional[str] = None
    training_data_summary: Optional[str] = None

# ─── Document Schemas ───────────────────────────────────────────
class DocumentResponse(BaseModel):
    id: uuid.UUID
    ai_system_id: uuid.UUID
    file_name: str
    file_type: str
    document_category: str
    parsing_status: str
    file_hash_sha256: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Assessment Schemas ─────────────────────────────────────────
class AssessmentInitiate(BaseModel):
    ai_system_id: uuid.UUID
    assessment_type: str = "full_governance_audit"
    selected_framework_codes: List[str] = []
    target_risk_domains: List[str] = []
    assessment_depth: str = "deep_audit"
    included_document_ids: List[uuid.UUID] = []

class AssessmentResponse(BaseModel):
    id: uuid.UUID
    ai_system_id: uuid.UUID
    assessment_type: str
    status: str
    overall_compliance_score: Optional[float] = None
    risk_level: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ComplianceFindingResponse(BaseModel):
    id: uuid.UUID
    compliance_criteria_id: uuid.UUID
    compliance_status: str
    finding_summary: str
    detailed_analysis: str
    citations: list
    confidence_score: float

    class Config:
        from_attributes = True

class RiskScoreResponse(BaseModel):
    id: uuid.UUID
    risk_domain: str
    score: float
    risk_level: str
    key_contributing_factors: dict

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    id: uuid.UUID
    priority: str
    remediation_title: str
    action_plan: str
    target_framework_clause: Optional[str] = None

    class Config:
        from_attributes = True

# ─── Report Schemas ─────────────────────────────────────────────
class ReportGenerateRequest(BaseModel):
    assessment_id: uuid.UUID
    format: str = "pdf"

class ReportResponse(BaseModel):
    id: uuid.UUID
    assessment_id: uuid.UUID
    report_title: str
    format: str
    file_path: str
    cryptographic_sha256: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Knowledge Base Schemas ─────────────────────────────────────
class KnowledgeSourceResponse(BaseModel):
    id: uuid.UUID
    source_code: str
    title: str
    category: str
    publishing_body: str
    version: str
    is_active: bool

    class Config:
        from_attributes = True

# ─── Pagination ─────────────────────────────────────────────────
class PaginatedResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
