import uuid
from sqlalchemy.orm import Session
from connection import SessionLocal, init_pgvector_extension
from models import (
    Organization, SectorType,
    User, UserRole,
    KnowledgeSource, KnowledgeCategory,
    ComplianceCriteria, RiskDomain
)

def seed_database():
    """Seed initial core regulatory sources, criteria, default tenant, and users."""
    print("Initializing PostgreSQL database and pgvector extension...")
    try:
        init_pgvector_extension()
    except Exception as e:
        print(f"Warning: pgvector extension setup deferred or failed: {e}")

    session: Session = SessionLocal()
    try:
        print("Seeding default tenant organization...")
        tenant = session.query(Organization).filter_by(name="Al-Rajhi Financial Corp").first()
        if not tenant:
            tenant = Organization(
                id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
                name="Al-Rajhi Financial Corp",
                sector_type=SectorType.BANK,
                jurisdiction="KSA"
            )
            session.add(tenant)
            session.commit()

        print("Seeding default compliance officer user...")
        user = session.query(User).filter_by(email="compliance.officer@alrajhi.com.sa").first()
        if not user:
            user = User(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                organization_id=tenant.id,
                email="compliance.officer@alrajhi.com.sa",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # bcrypt test hash
                full_name="Sarah Al-Mansoor",
                role=UserRole.COMPLIANCE_OFFICER,
                is_active=True
            )
            session.add(user)
            session.commit()

        print("Seeding Knowledge Sources (Core AI Governance & Finance Regulatory)...")
        sources_data = [
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333301"),
                "source_code": "SAMA_AI_GUIDANCE_2024",
                "title": "SAMA Artificial Intelligence and Technology Guidance for Banks",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "Saudi Central Bank (SAMA)",
                "version": "2024.1"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333302"),
                "source_code": "SAMA_CSF_2022",
                "title": "SAMA Cyber Security Framework for Financial Institutions",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "Saudi Central Bank (SAMA)",
                "version": "CS-2022-01"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333303"),
                "source_code": "ISO_IEC_42001",
                "title": "ISO/IEC 42001:2023 Information Technology - Artificial Intelligence - Management System (AIMS)",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "ISO / IEC",
                "version": "2023.12"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333304"),
                "source_code": "SAUDI_PDPL",
                "title": "Saudi Personal Data Protection Law (PDPL)",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "SDAIA",
                "version": "Royal Decree M/19"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333305"),
                "source_code": "MRM_SR_11_7",
                "title": "Model Risk Management Principles for Banking & Financial Services",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "Federal Reserve / OCC / SAMA",
                "version": "SR 11-7 Adapt."
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333306"),
                "source_code": "OECD_AI_PRINCIPLES",
                "title": "OECD Principles on Artificial Intelligence",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "OECD",
                "version": "2024.05"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333307"),
                "source_code": "NCA_ECC_2018",
                "title": "NCA Essential Cybersecurity Controls",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "National Cybersecurity Authority (NCA)",
                "version": "ECC-1:2018"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333308"),
                "source_code": "SDAIA_AI_ETHICS",
                "title": "SDAIA AI Ethics Principles",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "Saudi Data and Artificial Intelligence Authority (SDAIA)",
                "version": "1.0 (2023)"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333309"),
                "source_code": "ISO_IEC_23894",
                "title": "ISO/IEC 23894:2023 Information Technology - Artificial Intelligence - Guidance on Risk Management",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "ISO / IEC",
                "version": "2023.02"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333310"),
                "source_code": "UNESCO_AI_ETHICS",
                "title": "UNESCO Recommendation on the Ethics of Artificial Intelligence",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "UNESCO",
                "version": "2021"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333311"),
                "source_code": "NDMO_DATA_GOV",
                "title": "NDMO National Data Governance Framework",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "National Data Management Office (NDMO)",
                "version": "2.1 (2023)"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333312"),
                "source_code": "BASEL_AI_PRINCIPLES",
                "title": "Basel Committee Principles for Operational Resilience and AI Model Governance",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "Basel Committee on Banking Supervision (BCBS)",
                "version": "BCBS Newsletter 2023"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333313"),
                "source_code": "SAMA_OPEN_BANKING",
                "title": "SAMA Open Banking Framework - AI & Technology Provisions",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "Saudi Central Bank (SAMA)",
                "version": "v1.2"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333314"),
                "source_code": "AML_FRAUD_AI_GOV",
                "title": "AML, Fraud Detection, and Financial Crime AI Governance Guidance",
                "category": KnowledgeCategory.FINANCE_REGULATORY,
                "publishing_body": "FATF / SAMA",
                "version": "FATF Guidance 2024"
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333315"),
                "source_code": "ITU_AI_FRAMEWORK",
                "title": "ITU AI Readiness Framework & ITU-T Y.3172",
                "category": KnowledgeCategory.CORE_AI_GOVERNANCE,
                "publishing_body": "International Telecommunication Union (ITU)",
                "version": "Y.3172 (2022)"
            }
        ]

        for s_data in sources_data:
            existing = session.query(KnowledgeSource).filter_by(source_code=s_data["source_code"]).first()
            if not existing:
                ks = KnowledgeSource(**s_data)
                session.add(ks)
        session.commit()

        print("Seeding Core Compliance Criteria Samples...")
        sama_ks = session.query(KnowledgeSource).filter_by(source_code="SAMA_AI_GUIDANCE_2024").first()
        if sama_ks:
            sample_criteria = [
                {
                    "knowledge_source_id": sama_ks.id,
                    "article_section": "Section 3.1",
                    "risk_domain": RiskDomain.EXPLAINABILITY,
                    "title": "Explainability in Automated Financial Decisions",
                    "requirement_text": "Financial institutions must ensure that AI models used for credit scoring, underwriting, or automated customer decisions provide human-interpretable explanations (e.g. SHAP, LIME) for any adverse decisions or rejections.",
                    "weight": 2.00
                },
                {
                    "knowledge_source_id": sama_ks.id,
                    "article_section": "Section 4.2",
                    "risk_domain": RiskDomain.MODEL_GOVERNANCE,
                    "title": "Independent Model Risk Validation",
                    "requirement_text": "AI and machine learning models deployed in production must undergo comprehensive annual independent validation by a team separate from the model developers prior to deployment.",
                    "weight": 2.00
                },
                {
                    "knowledge_source_id": sama_ks.id,
                    "article_section": "Section 5.3",
                    "risk_domain": RiskDomain.HUMAN_OVERSIGHT,
                    "title": "Human Intervention & Emergency Kill-Switch",
                    "requirement_text": "Critical financial AI systems operating in high-volume production environments must maintain a human-in-the-loop fallback mechanism and an instant automated kill-switch to halt execution upon detecting anomalous output.",
                    "weight": 1.50
                }
            ]
            for c_data in sample_criteria:
                existing_c = session.query(ComplianceCriteria).filter_by(
                    knowledge_source_id=c_data["knowledge_source_id"],
                    article_section=c_data["article_section"]
                ).first()
                if not existing_c:
                    cc = ComplianceCriteria(**c_data)
                    session.add(cc)
            session.commit()

        print("Database seed completed successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()
