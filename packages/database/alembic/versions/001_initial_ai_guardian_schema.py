"""Initial AI Guardian Schema Migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-05 02:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Create Enums
    op.execute("CREATE TYPE sector_type_enum AS ENUM ('bank', 'fintech', 'insurance', 'investment', 'payments')")
    op.execute("CREATE TYPE user_role_enum AS ENUM ('sys_admin', 'compliance_officer', 'risk_manager', 'ai_model_owner', 'auditor')")
    op.execute("CREATE TYPE financial_use_case_enum AS ENUM ('credit_scoring', 'fraud_detection', 'aml_transaction_monitoring', 'algorithmic_trading', 'robo_advisory', 'underwriting', 'customer_service_bot', 'other')")
    op.execute("CREATE TYPE criticality_tier_enum AS ENUM ('tier_1_critical', 'tier_2_high', 'tier_3_medium', 'tier_4_low')")
    op.execute("CREATE TYPE deployment_status_enum AS ENUM ('development', 'validation', 'staging', 'production', 'decommissioned')")
    op.execute("CREATE TYPE document_category_enum AS ENUM ('model_architecture', 'data_governance', 'validation_report', 'bias_audit', 'cybersecurity_spec', 'third_party_contract', 'user_manual')")
    op.execute("CREATE TYPE parsing_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed')")
    op.execute("CREATE TYPE knowledge_category_enum AS ENUM ('core_ai_governance', 'finance_regulatory', 'custom_org_policy')")
    op.execute("CREATE TYPE risk_domain_enum AS ENUM ('model_governance', 'bias_fairness', 'explainability', 'data_governance', 'privacy', 'cybersecurity', 'regulatory_compliance', 'risk_management', 'human_oversight', 'third_party_risk')")
    op.execute("CREATE TYPE compliance_status_enum AS ENUM ('compliant', 'partially_compliant', 'non_compliant', 'insufficient_evidence')")
    op.execute("CREATE TYPE assessment_type_enum AS ENUM ('full_governance_audit', 'sama_compliance_check', 'mrm_validation', 'rapid_gap_analysis')")
    op.execute("CREATE TYPE assessment_status_enum AS ENUM ('queued', 'parsing_docs', 'retrieving_rules', 'evaluating_agents', 'calculating_scores', 'completed', 'failed')")
    op.execute("CREATE TYPE overall_risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical')")
    op.execute("CREATE TYPE retrieval_layer_enum AS ENUM ('core_governance', 'finance_regulatory', 'uploaded_doc')")
    op.execute("CREATE TYPE priority_level_enum AS ENUM ('low', 'medium', 'high', 'urgent')")
    op.execute("CREATE TYPE report_format_enum AS ENUM ('pdf', 'docx', 'json')")

    # 2. Organizations Table
    op.create_table(
        'organizations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('sector_type', postgresql.ENUM(name='sector_type_enum', create_type=False), nullable=False),
        sa.Column('jurisdiction', sa.String(100), nullable=False, server_default='KSA'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 3. Users Table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', postgresql.ENUM(name='user_role_enum', create_type=False), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_users_org_role', 'users', ['organization_id', 'role'])

    # 4. AI Systems Table
    op.create_table(
        'ai_systems',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('code_identifier', sa.String(100), nullable=False),
        sa.Column('business_purpose', sa.Text(), nullable=False),
        sa.Column('financial_use_case', postgresql.ENUM(name='financial_use_case_enum', create_type=False), nullable=False),
        sa.Column('criticality_tier', postgresql.ENUM(name='criticality_tier_enum', create_type=False), nullable=False),
        sa.Column('deployment_status', postgresql.ENUM(name='deployment_status_enum', create_type=False), nullable=False),
        sa.Column('owner_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_ai_systems_org_tier', 'ai_systems', ['organization_id', 'criticality_tier'])

    # 5. AI Models Table
    op.create_table(
        'ai_models',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('ai_system_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_systems.id', ondelete='CASCADE'), nullable=False),
        sa.Column('model_name', sa.String(255), nullable=False),
        sa.Column('version', sa.String(50), nullable=False),
        sa.Column('algorithm_type', sa.String(100), nullable=True),
        sa.Column('is_third_party', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('vendor_name', sa.String(255), nullable=True),
        sa.Column('training_data_summary', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 6. Uploaded Documents Table
    op.create_table(
        'uploaded_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('ai_system_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_systems.id', ondelete='CASCADE'), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_type', sa.String(50), nullable=False),
        sa.Column('document_category', postgresql.ENUM(name='document_category_enum', create_type=False), nullable=False),
        sa.Column('storage_path', sa.String(512), nullable=False),
        sa.Column('file_hash_sha256', sa.String(64), nullable=False),
        sa.Column('parsing_status', postgresql.ENUM(name='parsing_status_enum', create_type=False), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_docs_system_category', 'uploaded_documents', ['ai_system_id', 'document_category'])

    # 7. Knowledge Sources Table
    op.create_table(
        'knowledge_sources',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('source_code', sa.String(100), nullable=False, unique=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('category', postgresql.ENUM(name='knowledge_category_enum', create_type=False), nullable=False),
        sa.Column('publishing_body', sa.String(255), nullable=False),
        sa.Column('version', sa.String(50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 8. Compliance Criteria Table
    op.create_table(
        'compliance_criteria',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('knowledge_source_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('knowledge_sources.id', ondelete='CASCADE'), nullable=False),
        sa.Column('article_section', sa.String(100), nullable=False),
        sa.Column('risk_domain', postgresql.ENUM(name='risk_domain_enum', create_type=False), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('requirement_text', sa.Text(), nullable=False),
        sa.Column('weight', sa.Numeric(3, 2), nullable=False, server_default='1.00'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_criteria_source_domain', 'compliance_criteria', ['knowledge_source_id', 'risk_domain'])

    # 9. Assessments Table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('ai_system_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_systems.id', ondelete='CASCADE'), nullable=False),
        sa.Column('initiated_by_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assessment_type', postgresql.ENUM(name='assessment_type_enum', create_type=False), nullable=False),
        sa.Column('status', postgresql.ENUM(name='assessment_status_enum', create_type=False), nullable=False, server_default='queued'),
        sa.Column('overall_compliance_score', sa.Numeric(5, 2), nullable=True),
        sa.Column('risk_level', postgresql.ENUM(name='overall_risk_level_enum', create_type=False), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_assessments_system_status', 'assessments', ['ai_system_id', 'status'])

    # 10. Compliance Findings Table
    op.create_table(
        'compliance_findings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('compliance_criteria_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('compliance_criteria.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('compliance_status', postgresql.ENUM(name='compliance_status_enum', create_type=False), nullable=False),
        sa.Column('finding_summary', sa.Text(), nullable=False),
        sa.Column('detailed_analysis', sa.Text(), nullable=False),
        sa.Column('citations', postgresql.JSONB(), nullable=False),
        sa.Column('confidence_score', sa.Numeric(3, 2), nullable=False, server_default='1.00'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 11. Retrieved Evidence Table
    op.create_table(
        'retrieved_evidence',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('compliance_criteria_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('compliance_criteria.id', ondelete='CASCADE'), nullable=False),
        sa.Column('uploaded_document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('uploaded_documents.id', ondelete='SET NULL'), nullable=True),
        sa.Column('retrieved_text_chunk', sa.Text(), nullable=False),
        sa.Column('source_reference', sa.String(255), nullable=False),
        sa.Column('similarity_score', sa.Numeric(4, 3), nullable=False),
        sa.Column('retrieval_layer', postgresql.ENUM(name='retrieval_layer_enum', create_type=False), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 12. Agent Outputs Table
    op.create_table(
        'agent_outputs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('agent_name', sa.String(100), nullable=False),
        sa.Column('step_number', sa.Integer(), nullable=False),
        sa.Column('output_payload', postgresql.JSONB(), nullable=False),
        sa.Column('execution_time_ms', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 13. Risk Scores Table
    op.create_table(
        'risk_scores',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('risk_domain', postgresql.ENUM(name='risk_domain_enum', create_type=False), nullable=False),
        sa.Column('score', sa.Numeric(5, 2), nullable=False),
        sa.Column('risk_level', postgresql.ENUM(name='overall_risk_level_enum', create_type=False), nullable=False),
        sa.Column('key_contributing_factors', postgresql.JSONB(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 14. Recommendations Table
    op.create_table(
        'recommendations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('compliance_finding_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('compliance_findings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('priority', postgresql.ENUM(name='priority_level_enum', create_type=False), nullable=False),
        sa.Column('remediation_title', sa.String(255), nullable=False),
        sa.Column('action_plan', sa.Text(), nullable=False),
        sa.Column('target_framework_clause', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 15. Generated Reports Table
    op.create_table(
        'generated_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('report_title', sa.String(255), nullable=False),
        sa.Column('format', postgresql.ENUM(name='report_format_enum', create_type=False), nullable=False),
        sa.Column('file_path', sa.String(512), nullable=False),
        sa.Column('cryptographic_sha256', sa.String(64), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    # 16. Audit Logs Table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='SET NULL'), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(255), nullable=True),
        sa.Column('details', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_audit_org_timestamp', 'audit_logs', ['organization_id', 'created_at'])

def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('generated_reports')
    op.drop_table('recommendations')
    op.drop_table('risk_scores')
    op.drop_table('agent_outputs')
    op.drop_table('retrieved_evidence')
    op.drop_table('compliance_findings')
    op.drop_table('assessments')
    op.drop_table('compliance_criteria')
    op.drop_table('knowledge_sources')
    op.drop_table('uploaded_documents')
    op.drop_table('ai_models')
    op.drop_table('ai_systems')
    op.drop_table('users')
    op.drop_table('organizations')

    op.execute("DROP TYPE report_format_enum")
    op.execute("DROP TYPE priority_level_enum")
    op.execute("DROP TYPE retrieval_layer_enum")
    op.execute("DROP TYPE overall_risk_level_enum")
    op.execute("DROP TYPE assessment_status_enum")
    op.execute("DROP TYPE assessment_type_enum")
    op.execute("DROP TYPE compliance_status_enum")
    op.execute("DROP TYPE risk_domain_enum")
    op.execute("DROP TYPE knowledge_category_enum")
    op.execute("DROP TYPE parsing_status_enum")
    op.execute("DROP TYPE document_category_enum")
    op.execute("DROP TYPE deployment_status_enum")
    op.execute("DROP TYPE criticality_tier_enum")
    op.execute("DROP TYPE financial_use_case_enum")
    op.execute("DROP TYPE user_role_enum")
    op.execute("DROP TYPE sector_type_enum")
