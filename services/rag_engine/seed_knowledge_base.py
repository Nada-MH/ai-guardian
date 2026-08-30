import os
import re
import json
import uuid
import sys
import hashlib
from datetime import datetime, date
from pathlib import Path

# Add database package to sys path
sys.path.append(str(Path(__file__).parent.parent.parent / "packages" / "database"))

from connection import SessionLocal
from models import (
    KnowledgeSource, ComplianceCriteria, KnowledgeCategory, RiskDomain,
    SourceType, RegulatorySource, RegulatoryRequirement, RegulatorySourceStatus
)

KNOWLEDGE_BASE_DIR = Path(__file__).parent / "knowledge_base"
OUTPUT_VECTOR_SEED_FILE = Path(__file__).parent / "knowledge_base_chunks_seed.json"
KB_VERSION = "v1.4.2-provenance"

DOMAIN_MAPPING = {
    "Governance": RiskDomain.MODEL_GOVERNANCE,
    "Oversight": RiskDomain.HUMAN_OVERSIGHT,
    "Validation": RiskDomain.MODEL_GOVERNANCE,
    "Explainability": RiskDomain.EXPLAINABILITY,
    "Bias": RiskDomain.BIAS_FAIRNESS,
    "Cybersecurity": RiskDomain.CYBERSECURITY,
    "Data": RiskDomain.DATA_GOVERNANCE,
    "Privacy": RiskDomain.PRIVACY,
    "Risk": RiskDomain.RISK_MANAGEMENT,
    "Third-Party": RiskDomain.THIRD_PARTY_RISK,
}

FRAMEWORK_PROVENANCE_CATALOG = {
    "SAUDI_PDPL": {
        "source_type": SourceType.LAW,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "Royal Decree M/19",
        "publication_date": date(2021, 9, 16),
        "effective_date": date(2023, 9, 14),
        "url": "https://sdaia.gov.sa/en/SDAIA/about/Pages/PDPL.aspx",
        "framework": "Saudi Personal Data Protection Law (PDPL)",
    },
    "EU_AI_ACT": {
        "source_type": SourceType.LAW,
        "issuing_organization": "European Parliament & Council",
        "jurisdiction": "European Union",
        "sector": "Cross-Sector",
        "document_version": "Regulation (EU) 2024/1689",
        "publication_date": date(2024, 7, 12),
        "effective_date": date(2024, 8, 1),
        "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        "framework": "EU Artificial Intelligence Act (AI Act)",
    },
    "EU_AI_ACT_2024": {
        "source_type": SourceType.LAW,
        "issuing_organization": "European Parliament & Council",
        "jurisdiction": "European Union",
        "sector": "Cross-Sector",
        "document_version": "Regulation (EU) 2024/1689",
        "publication_date": date(2024, 7, 12),
        "effective_date": date(2024, 8, 1),
        "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        "framework": "EU Artificial Intelligence Act (AI Act)",
    },
    "SAMA_AI_GUIDANCE_2024": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2024.1",
        "publication_date": date(2024, 1, 15),
        "effective_date": date(2024, 6, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/default.aspx",
        "framework": "SAMA AI and Technology Guidance for Banks",
    },
    "SAMA_CSF_2022": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "CS-2022-01",
        "publication_date": date(2022, 5, 10),
        "effective_date": date(2022, 6, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/CyberSecurity.aspx",
        "framework": "SAMA Cyber Security Framework (CSF)",
    },
    "SAMA_OPEN_BANKING": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "v1.2",
        "publication_date": date(2022, 11, 1),
        "effective_date": date(2023, 1, 1),
        "url": "https://openbanking.sa/framework",
        "framework": "SAMA Open Banking Framework",
    },
    "MRM_SR_11_7": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Federal Reserve / OCC / SAMA",
        "jurisdiction": "United States / SAMA Adaptation",
        "sector": "Banking & Finance",
        "document_version": "SR 11-7 Adapt.",
        "publication_date": date(2011, 4, 4),
        "effective_date": date(2011, 4, 4),
        "url": "https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm",
        "framework": "Model Risk Management Guidance (SR 11-7)",
    },
    "SDAIA_AI_ETHICS": {
        "source_type": SourceType.ETHICS_PRINCIPLE,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "1.0 (2023)",
        "publication_date": date(2023, 1, 1),
        "effective_date": date(2023, 1, 1),
        "url": "https://sdaia.gov.sa/en/Research/Pages/AIPrinciples.aspx",
        "framework": "SDAIA AI Ethics Principles",
    },
    "SDAIA_GENAI_GUIDELINES": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "1.0 (2024)",
        "publication_date": date(2024, 2, 1),
        "effective_date": date(2024, 2, 1),
        "url": "https://sdaia.gov.sa/en/Guidelines/GenAI.aspx",
        "framework": "SDAIA Generative AI Guidelines",
    },
    "SDAIA_GENAI_2024": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "1.0 (2024)",
        "publication_date": date(2024, 2, 1),
        "effective_date": date(2024, 2, 1),
        "url": "https://sdaia.gov.sa/en/Guidelines/GenAI.aspx",
        "framework": "SDAIA Generative AI Guidelines",
    },
    "NDMO_DATA_GOV": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "National Data Management Office (NDMO)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2.1 (2023)",
        "publication_date": date(2023, 3, 15),
        "effective_date": date(2023, 3, 15),
        "url": "https://ndmo.gov.sa/framework",
        "framework": "NDMO National Data Governance Framework",
    },
    "NCA_ECC_2018": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "National Cybersecurity Authority (NCA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "ECC-1:2018",
        "publication_date": date(2018, 10, 1),
        "effective_date": date(2018, 10, 1),
        "url": "https://nca.gov.sa/en/regulations",
        "framework": "NCA Essential Cybersecurity Controls",
    },
    "ISO_IEC_42001": {
        "source_type": SourceType.STANDARD,
        "issuing_organization": "International Organization for Standardization (ISO)",
        "jurisdiction": "International (ISO/IEC)",
        "sector": "Cross-Sector",
        "document_version": "2023.12",
        "publication_date": date(2023, 12, 18),
        "effective_date": date(2023, 12, 18),
        "url": "https://www.iso.org/standard/81230.html",
        "framework": "ISO/IEC 42001:2023 Artificial Intelligence Management System",
    },
    "ISO_IEC_23894": {
        "source_type": SourceType.STANDARD,
        "issuing_organization": "International Organization for Standardization (ISO)",
        "jurisdiction": "International (ISO/IEC)",
        "sector": "Cross-Sector",
        "document_version": "2023.02",
        "publication_date": date(2023, 2, 15),
        "effective_date": date(2023, 2, 15),
        "url": "https://www.iso.org/standard/77304.html",
        "framework": "ISO/IEC 23894:2023 AI Risk Management Guidance",
    },
    "NIST_AI_RMF": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "National Institute of Standards and Technology (NIST)",
        "jurisdiction": "United States / Global",
        "sector": "Cross-Sector",
        "document_version": "NIST AI 100-1",
        "publication_date": date(2023, 1, 26),
        "effective_date": date(2023, 1, 26),
        "url": "https://www.nist.gov/itl/ai-risk-management-framework",
        "framework": "NIST AI Risk Management Framework 1.0",
    },
    "NIST_AI_RMF_1_0": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "National Institute of Standards and Technology (NIST)",
        "jurisdiction": "United States / Global",
        "sector": "Cross-Sector",
        "document_version": "NIST AI 100-1",
        "publication_date": date(2023, 1, 26),
        "effective_date": date(2023, 1, 26),
        "url": "https://www.nist.gov/itl/ai-risk-management-framework",
        "framework": "NIST AI Risk Management Framework 1.0",
    },
    "OECD_AI_PRINCIPLES": {
        "source_type": SourceType.ETHICS_PRINCIPLE,
        "issuing_organization": "Organisation for Economic Co-operation and Development (OECD)",
        "jurisdiction": "International (OECD)",
        "sector": "Cross-Sector",
        "document_version": "2024.05",
        "publication_date": date(2024, 5, 3),
        "effective_date": date(2024, 5, 3),
        "url": "https://oecd.ai/en/ai-principles",
        "framework": "OECD Principles on Artificial Intelligence",
    },
    "UNESCO_AI_ETHICS": {
        "source_type": SourceType.ETHICS_PRINCIPLE,
        "issuing_organization": "United Nations Educational, Scientific and Cultural Organization (UNESCO)",
        "jurisdiction": "International (UN)",
        "sector": "Cross-Sector",
        "document_version": "2021",
        "publication_date": date(2021, 11, 23),
        "effective_date": date(2021, 11, 23),
        "url": "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics",
        "framework": "UNESCO Recommendation on the Ethics of AI",
    },
    "ITU_AI_FRAMEWORK": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "International Telecommunication Union (ITU)",
        "jurisdiction": "International (ITU)",
        "sector": "Telecommunications & IT",
        "document_version": "Y.3172 (2022)",
        "publication_date": date(2022, 9, 1),
        "effective_date": date(2022, 9, 1),
        "url": "https://www.itu.int/rec/T-REC-Y.3172",
        "framework": "ITU AI Readiness Framework & ITU-T Y.3172",
    },
    "BASEL_AI_PRINCIPLES": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "Basel Committee on Banking Supervision (BCBS)",
        "jurisdiction": "International (BCBS)",
        "sector": "Banking & Finance",
        "document_version": "Newsletter 2023",
        "publication_date": date(2023, 6, 1),
        "effective_date": date(2023, 6, 1),
        "url": "https://www.bis.org/bcbs/publ/d551.htm",
        "framework": "Basel Committee AI Model Governance Principles",
    },
    "AML_FRAUD_AI_GOV": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Financial Action Task Force (FATF) / SAMA",
        "jurisdiction": "Saudi Arabia / International",
        "sector": "Banking & Finance",
        "document_version": "FATF Guidance 2024",
        "publication_date": date(2024, 2, 15),
        "effective_date": date(2024, 2, 15),
        "url": "https://www.fatf-gafi.org",
        "framework": "AML, Fraud Detection & Financial Crime AI Governance",
    },
    "HKMA_AI_REGULATION": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Hong Kong Monetary Authority (HKMA)",
        "jurisdiction": "Hong Kong (HKMA)",
        "sector": "Banking & Finance",
        "document_version": "2023.11",
        "publication_date": date(2023, 11, 1),
        "effective_date": date(2023, 11, 1),
        "url": "https://www.hkma.gov.hk",
        "framework": "HKMA High-level Principles on AI Governance",
    },
    "HKMA_AI_BANKING_2023": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Hong Kong Monetary Authority (HKMA)",
        "jurisdiction": "Hong Kong (HKMA)",
        "sector": "Banking & Finance",
        "document_version": "2023.11",
        "publication_date": date(2023, 11, 1),
        "effective_date": date(2023, 11, 1),
        "url": "https://www.hkma.gov.hk",
        "framework": "HKMA High-level Principles on AI Governance",
    },
    "MAS_FEAT_PRINCIPLES": {
        "source_type": SourceType.ETHICS_PRINCIPLE,
        "issuing_organization": "Monetary Authority of Singapore (MAS)",
        "jurisdiction": "Singapore (MAS)",
        "sector": "Banking & Finance",
        "document_version": "2018.11",
        "publication_date": date(2018, 11, 12),
        "effective_date": date(2018, 11, 12),
        "url": "https://www.mas.gov.sg/publications/monographs-or-information-paper/2018/FEAT",
        "framework": "MAS FEAT Principles for AI in Financial Sector",
    },
    "MAS_FEAT_2018": {
        "source_type": SourceType.ETHICS_PRINCIPLE,
        "issuing_organization": "Monetary Authority of Singapore (MAS)",
        "jurisdiction": "Singapore (MAS)",
        "sector": "Banking & Finance",
        "document_version": "2018.11",
        "publication_date": date(2018, 11, 12),
        "effective_date": date(2018, 11, 12),
        "url": "https://www.mas.gov.sg/publications/monographs-or-information-paper/2018/FEAT",
        "framework": "MAS FEAT Principles for AI in Financial Sector",
    },
}

def determine_risk_domain(text: str) -> RiskDomain:
    """Infer risk domain based on regulatory keywords."""
    for keyword, domain in DOMAIN_MAPPING.items():
        if keyword.lower() in text.lower():
            return domain
    return RiskDomain.REGULATORY_COMPLIANCE

def parse_markdown_regulatory_file(file_path: Path):
    """Parses markdown regulatory file into structured sections, clauses, and canonical provenance metadata."""
    content = file_path.read_text(encoding="utf-8")
    doc_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    
    # Extract metadata block at top
    source_code_match = re.search(r"\*\*Source Identifier\*\*:\s*`([^`]+)`", content)
    publishing_body_match = re.search(r"\*\*Publishing Body\*\*:\s*([^\n]+)", content)
    version_match = re.search(r"\*\*Version\*\*:\s*([^\n]+)", content)
    category_match = re.search(r"\*\*Category\*\*:\s*([^\n]+)", content)
    title_match = re.search(r"^#\s*([^\n]+)", content, re.MULTILINE)

    if not source_code_match:
        print(f"Skipping {file_path.name}: missing source identifier metadata.")
        return None, []

    source_code = source_code_match.group(1).strip()
    title = title_match.group(1).strip() if title_match else file_path.stem
    version = version_match.group(1).strip() if version_match else "1.0"
    category_str = category_match.group(1).strip() if category_match else "Core AI Governance"
    category_enum = KnowledgeCategory.FINANCE_REGULATORY if "Finance" in category_str else KnowledgeCategory.CORE_AI_GOVERNANCE

    # Lookup canonical catalog metadata
    catalog_meta = FRAMEWORK_PROVENANCE_CATALOG.get(source_code, {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": publishing_body_match.group(1).strip() if publishing_body_match else "Regulatory Authority",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance" if "Finance" in category_str else "Cross-Sector",
        "document_version": version,
        "publication_date": date(2024, 1, 1),
        "effective_date": date(2024, 1, 1),
        "url": "https://ai-guardian.gov.sa/regulations",
        "framework": title,
    })

    source_info = {
        "source_id": f"SRC-{source_code}",
        "source_code": source_code,
        "framework": catalog_meta.get("framework", title),
        "source_type": catalog_meta.get("source_type", SourceType.REGULATORY_GUIDANCE),
        "title": title,
        "category": category_enum,
        "issuing_organization": catalog_meta.get("issuing_organization", "Regulatory Authority"),
        "jurisdiction": catalog_meta.get("jurisdiction", "Saudi Arabia (KSA)"),
        "sector": catalog_meta.get("sector", "Cross-Sector"),
        "document_version": catalog_meta.get("document_version", version),
        "publication_date": catalog_meta.get("publication_date"),
        "effective_date": catalog_meta.get("effective_date"),
        "url": catalog_meta.get("url"),
        "document_hash": doc_hash,
        "retrieved_at": datetime.utcnow(),
        "status": RegulatorySourceStatus.ACTIVE,
        "language": "en"
    }

    # Extract Sections & Clauses
    clauses = []
    raw_clauses = re.split(r"\n(?=###?\s+)", content)
    
    page_counter = 1
    for block in raw_clauses:
        clause_title_match = re.search(r"^###?\s+([^\n]+)", block)
        if not clause_title_match:
            continue
        
        clause_header = clause_title_match.group(1).strip()
        clause_body = re.sub(r"^###?\s+[^\n]+\n", "", block).strip()

        if not clause_body:
            continue

        # Extract structured clause references
        article_match = re.search(r"Article\s+(\d+[\w\-]*)", clause_header, re.IGNORECASE)
        section_match = re.search(r"Section\s+([\d\.]+[\w\-]*)", clause_header, re.IGNORECASE)
        clause_match = re.search(r"Clause\s+([\d\.]+[\w\-]*)", clause_header, re.IGNORECASE)
        control_match = re.search(r"Control\s+([\w\-\.]+)", clause_header, re.IGNORECASE)

        article = f"Article {article_match.group(1)}" if article_match else None
        section = f"Section {section_match.group(1)}" if section_match else None
        clause_num = f"Clause {clause_match.group(1)}" if clause_match else (f"Control {control_match.group(1)}" if control_match else None)

        section_ref_match = re.search(r"^(Clause\s+[\d\.]+|Article\s+\d+|Control\s+[\w\-\.]+|Section\s+[\d\.]+)", clause_header, re.IGNORECASE)
        article_section = section_ref_match.group(1) if section_ref_match else clause_header[:35]

        # Generate canonical requirement ID (e.g. REQ-SAMA-AI-5.3)
        req_clean_code = re.sub(r"[^A-Za-z0-9\-]", "", source_code)[:12]
        clause_clean = re.sub(r"[^A-Za-z0-9\.]", "", article_section)[:10]
        requirement_id = f"REQ-{req_clean_code}-{clause_clean}"

        req_hash = hashlib.sha256((clause_header + "\n" + clause_body).encode("utf-8")).hexdigest()
        risk_domain = determine_risk_domain(clause_header + " " + clause_body)

        clauses.append({
            "requirement_id": requirement_id,
            "article_section": article_section,
            "title": clause_header,
            "requirement_text": clause_body,
            "section": section,
            "article": article,
            "clause": clause_num or article_section,
            "page": page_counter,
            "risk_domain": risk_domain,
            "weight": 2.00 if ("mandatory" in clause_body.lower() or "must" in clause_body.lower()) else 1.00,
            "document_hash": req_hash,
            "version": 1,
            "is_current_version": True,
            "retrieved_at": datetime.utcnow(),
            "status": "ACTIVE",
            "language": "en"
        })
        page_counter += 1

    return source_info, clauses

def process_and_seed_knowledge_base():
    """Reads all markdown files, updates DB with canonical provenance models, and writes vector payload seed file."""
    print("=" * 80)
    print("AI GUARDIAN REGULATORY PROVENANCE INGESTION & VERSIONING ENGINE")
    print("=" * 80)
    
    session = SessionLocal()
    all_chunks_seed = []

    try:
        md_files = list(KNOWLEDGE_BASE_DIR.glob("*.md"))
        print(f"Found {len(md_files)} regulatory markdown documents in knowledge base.")

        for file_path in md_files:
            source_info, clauses = parse_markdown_regulatory_file(file_path)
            if not source_info:
                continue

            # 1. Upsert KnowledgeSource (backward compatibility)
            ks = session.query(KnowledgeSource).filter_by(source_code=source_info["source_code"]).first()
            if not ks:
                ks = KnowledgeSource(
                    id=uuid.uuid4(),
                    source_code=source_info["source_code"],
                    title=source_info["title"],
                    category=source_info["category"],
                    publishing_body=source_info["issuing_organization"],
                    version=source_info["document_version"],
                    is_active=True
                )
                session.add(ks)
                session.flush()

            # 2. Upsert Canonical RegulatorySource
            reg_src = session.query(RegulatorySource).filter_by(source_id=source_info["source_id"]).first()
            if not reg_src:
                reg_src = RegulatorySource(
                    id=uuid.uuid4(),
                    source_id=source_info["source_id"],
                    framework=source_info["framework"],
                    source_type=source_info["source_type"],
                    title=source_info["title"],
                    issuing_organization=source_info["issuing_organization"],
                    jurisdiction=source_info["jurisdiction"],
                    sector=source_info["sector"],
                    document_version=source_info["document_version"],
                    publication_date=source_info["publication_date"],
                    effective_date=source_info["effective_date"],
                    url=source_info["url"],
                    document_hash=source_info["document_hash"],
                    retrieved_at=source_info["retrieved_at"],
                    status=source_info["status"],
                    language=source_info["language"]
                )
                session.add(reg_src)
                session.flush()
            else:
                # Update hash & metadata if needed
                reg_src.document_hash = source_info["document_hash"]
                reg_src.source_type = source_info["source_type"]
                reg_src.framework = source_info["framework"]

            print(f"[{reg_src.source_type.value:19}] {reg_src.source_id}: Ingesting {len(clauses)} versioned requirements...")

            for clause in clauses:
                # Upsert ComplianceCriteria (backward compatibility)
                crit = session.query(ComplianceCriteria).filter_by(
                    knowledge_source_id=ks.id,
                    article_section=clause["article_section"]
                ).first()

                if not crit:
                    crit = ComplianceCriteria(
                        id=uuid.uuid4(),
                        knowledge_source_id=ks.id,
                        article_section=clause["article_section"],
                        risk_domain=clause["risk_domain"],
                        title=clause["title"],
                        requirement_text=clause["requirement_text"],
                        weight=clause["weight"]
                    )
                    session.add(crit)
                    session.flush()

                # Upsert Versioned RegulatoryRequirement (Independent Versioning)
                existing_req = session.query(RegulatoryRequirement).filter_by(
                    source_id=reg_src.id,
                    requirement_id=clause["requirement_id"],
                    is_current_version=True
                ).first()

                if not existing_req:
                    req_entity = RegulatoryRequirement(
                        id=uuid.uuid4(),
                        requirement_id=clause["requirement_id"],
                        source_id=reg_src.id,
                        page=clause["page"],
                        section=clause["section"],
                        article=clause["article"],
                        clause=clause["clause"],
                        requirement_text=clause["requirement_text"],
                        version=1,
                        is_current_version=True,
                        effective_date=reg_src.effective_date,
                        document_hash=clause["document_hash"],
                        retrieved_at=datetime.utcnow(),
                        status="ACTIVE",
                        language="en"
                    )
                    session.add(req_entity)
                    session.flush()
                else:
                    # Check if requirement text changed -> create NEW version rather than overwrite
                    if existing_req.document_hash != clause["document_hash"]:
                        print(f"  [VERSION BUMP] Requirement {existing_req.requirement_id} text changed! Creating v{existing_req.version + 1}...")
                        existing_req.is_current_version = False
                        existing_req.status = "SUPERSEDED"
                        
                        req_entity = RegulatoryRequirement(
                            id=uuid.uuid4(),
                            requirement_id=clause["requirement_id"],
                            source_id=reg_src.id,
                            page=clause["page"],
                            section=clause["section"],
                            article=clause["article"],
                            clause=clause["clause"],
                            requirement_text=clause["requirement_text"],
                            version=existing_req.version + 1,
                            previous_version_id=existing_req.id,
                            is_current_version=True,
                            effective_date=reg_src.effective_date,
                            document_hash=clause["document_hash"],
                            retrieved_at=datetime.utcnow(),
                            status="ACTIVE",
                            language="en"
                        )
                        session.add(req_entity)
                        session.flush()
                    else:
                        req_entity = existing_req

                # Build Canonical Provenance Payload
                provenance_payload = {
                    "source_id": reg_src.source_id,
                    "framework": reg_src.framework,
                    "source_type": reg_src.source_type.value,
                    "title": reg_src.title,
                    "issuing_organization": reg_src.issuing_organization,
                    "jurisdiction": reg_src.jurisdiction,
                    "sector": reg_src.sector,
                    "document_version": reg_src.document_version,
                    "publication_date": reg_src.publication_date.isoformat() if reg_src.publication_date else None,
                    "effective_date": reg_src.effective_date.isoformat() if reg_src.effective_date else None,
                    "url": reg_src.url,
                    "page": req_entity.page,
                    "section": req_entity.section,
                    "article": req_entity.article,
                    "clause": req_entity.clause,
                    "requirement_id": req_entity.requirement_id,
                    "requirement_version": req_entity.version,
                    "requirement_text": req_entity.requirement_text,
                    "document_hash": req_entity.document_hash,
                    "source_document_hash": reg_src.document_hash,
                    "retrieved_at": req_entity.retrieved_at.isoformat(),
                    "status": req_entity.status,
                    "language": req_entity.language,
                    "kb_version": KB_VERSION
                }

                # Build Vector Store Payload Chunk with Structured Provenance
                chunk_payload = {
                    "chunk_id": f"chunk-{req_entity.id}",
                    "compliance_criteria_id": str(crit.id),
                    "regulatory_requirement_id": str(req_entity.id),
                    "requirement_id": req_entity.requirement_id,
                    "source_code": ks.source_code,
                    "source_id": reg_src.source_id,
                    "source_title": reg_src.title,
                    "framework": reg_src.framework,
                    "source_type": reg_src.source_type.value,
                    "issuing_organization": reg_src.issuing_organization,
                    "jurisdiction": reg_src.jurisdiction,
                    "document_version": reg_src.document_version,
                    "article_section": crit.article_section,
                    "clause": req_entity.clause,
                    "risk_domain": crit.risk_domain.value,
                    "title": crit.title,
                    "content_text": f"{crit.title}\n{crit.requirement_text}",
                    "weight": float(crit.weight),
                    "provenance": provenance_payload
                }
                all_chunks_seed.append(chunk_payload)

        session.commit()
        print("Database transaction committed successfully with full provenance lineage!")

        # Write vector chunk seed file
        OUTPUT_VECTOR_SEED_FILE.write_text(json.dumps(all_chunks_seed, indent=2), encoding="utf-8")
        print(f"Generated Vector Store Chunk Seed File at: {OUTPUT_VECTOR_SEED_FILE} ({len(all_chunks_seed)} chunks with provenance).")

    except Exception as e:
        session.rollback()
        print(f"Error processing knowledge base: {e}")
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    process_and_seed_knowledge_base()
