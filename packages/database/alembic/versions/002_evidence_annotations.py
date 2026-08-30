"""Evidence Annotations Migration

Revision ID: 002_evidence_annotations
Revises: 001_initial_schema
Create Date: 2026-08-05 03:32:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '002_evidence_annotations'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Create Enum
    op.execute("CREATE TYPE annotation_type_enum AS ENUM ('compliance_violation', 'risk', 'warning', 'compliant_evidence')")

    # 2. Evidence Annotations Table
    op.create_table(
        'evidence_annotations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('finding_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('compliance_findings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('uploaded_documents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('page_number', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('extracted_text', sa.Text(), nullable=False),
        sa.Column('start_position', sa.Integer(), nullable=True),
        sa.Column('end_position', sa.Integer(), nullable=True),
        sa.Column('annotation_type', postgresql.ENUM(name='annotation_type_enum', create_type=False), nullable=False, server_default='compliance_violation'),
        sa.Column('severity', postgresql.ENUM(name='overall_risk_level_enum', create_type=False), nullable=False, server_default='high'),
        sa.Column('ai_comment', sa.Text(), nullable=False),
        sa.Column('requirement_reference', sa.String(255), nullable=False),
        sa.Column('recommendation', sa.Text(), nullable=False),
        sa.Column('bounding_box', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )
    op.create_index('idx_annotations_finding', 'evidence_annotations', ['finding_id'])
    op.create_index('idx_annotations_doc_page', 'evidence_annotations', ['document_id', 'page_number'])

def downgrade() -> None:
    op.drop_table('evidence_annotations')
    op.execute("DROP TYPE annotation_type_enum")
