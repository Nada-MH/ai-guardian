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

from connection import SessionLocal, engine
from models import (
    Base, KnowledgeSource, ComplianceCriteria, KnowledgeCategory, RiskDomain,
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
    "MAS_VERITAS_TOOLKIT_2": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Monetary Authority of Singapore (MAS)",
        "jurisdiction": "Singapore (MAS)",
        "sector": "Banking & Finance",
        "document_version": "2.0 (2023.11)",
        "publication_date": date(2023, 11, 15),
        "effective_date": date(2023, 11, 15),
        "url": "https://www.mas.gov.sg/veritas",
        "framework": "MAS Veritas Toolkit 2.0 for Responsible AI",
    },
    "CMA_ALGO_TRADING_AI": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Capital Market Authority (CMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2024.2",
        "publication_date": date(2024, 3, 1),
        "effective_date": date(2024, 6, 1),
        "url": "https://cma.org.sa/en/RulesRegulations",
        "framework": "Saudi CMA Algorithmic & High-Frequency AI Trading Framework",
    },
    "SAMA_CLOUD_OUTSOURCING_AI": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2023.2",
        "publication_date": date(2023, 6, 15),
        "effective_date": date(2023, 9, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/Outsourcing.aspx",
        "framework": "SAMA Outsourcing & Cloud Computing Framework for AI",
    },
    "SAMA_ANTI_FRAUD_AI": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2024.1",
        "publication_date": date(2024, 2, 10),
        "effective_date": date(2024, 5, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/AntiFraud.aspx",
        "framework": "SAMA Counter-Fraud, Financial Crime & Biometric AI Directive",
    },
    "FSB_IOSCO_AI_MARKET_CONDUCT": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "Financial Stability Board (FSB) / IOSCO",
        "jurisdiction": "International",
        "sector": "Banking & Finance",
        "document_version": "2024.1",
        "publication_date": date(2024, 4, 20),
        "effective_date": date(2024, 4, 20),
        "url": "https://www.fsb.org/publications",
        "framework": "FSB & IOSCO Guidance on AI in Financial Markets",
    },
    "EBA_AI_GUIDELINES_BANKING": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "European Banking Authority (EBA)",
        "jurisdiction": "European Union",
        "sector": "Banking & Finance",
        "document_version": "EBA/GL/2023/08",
        "publication_date": date(2023, 8, 10),
        "effective_date": date(2023, 10, 1),
        "url": "https://www.eba.europa.eu/guidelines",
        "framework": "EBA Guidelines on AI in Banking & Credit Risk",
    },
    "UK_FCA_PRA_AI_SUPERVISION": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "UK Financial Conduct Authority (FCA) / PRA",
        "jurisdiction": "United Kingdom",
        "sector": "Banking & Finance",
        "document_version": "2024 Update",
        "publication_date": date(2024, 5, 12),
        "effective_date": date(2024, 5, 12),
        "url": "https://www.fca.org.uk/firms/artificial-intelligence",
        "framework": "UK FCA & PRA Supervisory Approach to AI in Financial Services",
    },
    "SAUDI_PDPL_EXEC_REGS_2024": {
        "source_type": SourceType.LAW,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2024.1",
        "publication_date": date(2024, 1, 10),
        "effective_date": date(2024, 3, 1),
        "url": "https://sdaia.gov.sa/en/SDAIA/about/Pages/PDPL.aspx",
        "framework": "Saudi PDPL Executive Regulations & Cross-Border Transfer Rules",
    },
    "SDAIA_GENAI_DEEPFAKE_2024": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2024.1",
        "publication_date": date(2024, 4, 1),
        "effective_date": date(2024, 4, 1),
        "url": "https://sdaia.gov.sa/en/Guidelines/Deepfakes.aspx",
        "framework": "SDAIA Generative AI, LLM & Synthetic Media Ethics Code",
    },
    "SAUDI_NSDAI_STRATEGY": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "Saudi Data & AI Authority (SDAIA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2024",
        "publication_date": date(2020, 10, 21),
        "effective_date": date(2020, 10, 21),
        "url": "https://sdaia.gov.sa/nsdai",
        "framework": "National Strategy for Data & AI (NSDAI) Governance Mandates",
    },
    "NCA_CCC_2020": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "National Cybersecurity Authority (NCA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "CCC-1:2020",
        "publication_date": date(2020, 2, 1),
        "effective_date": date(2020, 2, 1),
        "url": "https://nca.gov.sa/en/regulations/ccc",
        "framework": "NCA Cloud Cybersecurity Controls (CCC-1:2020) for AI",
    },
    "ZATCA_AI_E_INVOICING": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Zakat, Tax and Customs Authority (ZATCA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2024.1",
        "publication_date": date(2023, 1, 1),
        "effective_date": date(2023, 1, 1),
        "url": "https://zatca.gov.sa/en/E-Invoicing",
        "framework": "ZATCA Electronic Invoicing & Tax AI Governance Standard",
    },
    "ISO_IEC_22989_24028": {
        "source_type": SourceType.STANDARD,
        "issuing_organization": "International Organization for Standardization (ISO)",
        "jurisdiction": "International (ISO/IEC)",
        "sector": "Cross-Sector",
        "document_version": "2022/2020",
        "publication_date": date(2022, 7, 1),
        "effective_date": date(2022, 7, 1),
        "url": "https://www.iso.org/standard/74296.html",
        "framework": "ISO/IEC 22989 & 24028: AI Trustworthiness, Concepts & Robustness",
    },
    "NIST_AI_600_1_GENAI": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "National Institute of Standards and Technology (NIST)",
        "jurisdiction": "United States / Global",
        "sector": "Cross-Sector",
        "document_version": "2024.07",
        "publication_date": date(2024, 7, 26),
        "effective_date": date(2024, 7, 26),
        "url": "https://www.nist.gov/publications/generative-ai-profile",
        "framework": "NIST AI 600-1 Generative AI Profile & Risk Management",
    },
    "IEEE_7000_ETHICAL_AI": {
        "source_type": SourceType.STANDARD,
        "issuing_organization": "Institute of Electrical and Electronics Engineers (IEEE)",
        "jurisdiction": "International (IEEE)",
        "sector": "Cross-Sector",
        "document_version": "7000-2021",
        "publication_date": date(2021, 9, 15),
        "effective_date": date(2021, 9, 15),
        "url": "https://standards.ieee.org/ieee/7000/6908/",
        "framework": "IEEE 7000-2021 Standard Model for Addressing Ethical Concerns in AI",
    },
    "SAMA_KEY_GOVERNANCE_PRINCIPLES": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2021/2024 Update",
        "publication_date": date(2021, 8, 1),
        "effective_date": date(2021, 8, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/Governance.aspx",
        "framework": "SAMA Key Principles of Governance in Financial Institutions",
    },
    "SAMA_BCM_FRAMEWORK": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2022.1",
        "publication_date": date(2022, 4, 1),
        "effective_date": date(2022, 6, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/BCM.aspx",
        "framework": "SAMA Business Continuity Management (BCM) Framework",
    },
    "SAMA_ERM_FRAMEWORK": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2023.1",
        "publication_date": date(2023, 1, 15),
        "effective_date": date(2023, 1, 15),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/RiskManagement.aspx",
        "framework": "SAMA Enterprise Risk Management (ERM) Framework",
    },
    "SAMA_AML_CFT_RULES": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2023.2",
        "publication_date": date(2023, 5, 20),
        "effective_date": date(2023, 5, 20),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/AML.aspx",
        "framework": "SAMA Anti-Money Laundering & Counter-Terrorist Financing Rules",
    },
    "SAMA_CONSUMER_PROTECTION": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2023.1",
        "publication_date": date(2023, 2, 1),
        "effective_date": date(2023, 2, 1),
        "url": "https://www.sama.gov.sa/en-US/ConsumerProtection/Pages/default.aspx",
        "framework": "SAMA Consumer Protection Principles & Responsible Lending",
    },
    "SAMA_INTERNAL_AUDIT_FRAMEWORK": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Saudi Central Bank (SAMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Banking & Finance",
        "document_version": "2022.1",
        "publication_date": date(2022, 9, 1),
        "effective_date": date(2022, 9, 1),
        "url": "https://www.sama.gov.sa/en-US/RulesInstructions/Pages/InternalAudit.aspx",
        "framework": "SAMA Internal Audit Framework for Financial Institutions",
    },
    "SAUDI_IA_GOVERNANCE_RULES": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Insurance Authority (IA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Insurance & Reinsurance",
        "document_version": "2024.1",
        "publication_date": date(2024, 1, 1),
        "effective_date": date(2024, 1, 1),
        "url": "https://ia.gov.sa/regulations",
        "framework": "Saudi Insurance Authority (IA) Governance & Solvency Rules",
    },
    "CMA_CORPORATE_GOVERNANCE_REGS": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "Capital Market Authority (CMA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Capital Markets & Listed Entities",
        "document_version": "2023.2",
        "publication_date": date(2023, 1, 18),
        "effective_date": date(2023, 1, 18),
        "url": "https://cma.org.sa/en/RulesRegulations/Pages/default.aspx",
        "framework": "Saudi CMA Corporate Governance Regulations",
    },
    "NCA_CSCC_2019": {
        "source_type": SourceType.REGULATION,
        "issuing_organization": "National Cybersecurity Authority (NCA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Critical National Infrastructure",
        "document_version": "CSCC-1:2019",
        "publication_date": date(2019, 3, 1),
        "effective_date": date(2019, 3, 1),
        "url": "https://nca.gov.sa/en/regulations/cscc",
        "framework": "NCA Critical Systems Cybersecurity Controls (CSCC-1:2019)",
    },
    "NCA_RISK_MGMT_TCC": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "National Cybersecurity Authority (NCA)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "TCC-1:2020",
        "publication_date": date(2020, 5, 1),
        "effective_date": date(2020, 5, 1),
        "url": "https://nca.gov.sa/en/regulations/tcc",
        "framework": "NCA Cybersecurity Risk Management & Telework Controls",
    },
    "NDMO_DATA_CLASSIFICATION_STD": {
        "source_type": SourceType.FRAMEWORK,
        "issuing_organization": "National Data Management Office (NDMO)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2.1 (2023.03)",
        "publication_date": date(2023, 3, 1),
        "effective_date": date(2023, 3, 1),
        "url": "https://ndmo.gov.sa/standards/classification",
        "framework": "NDMO National Data Classification & Metadata Standards",
    },
    "SAUDI_NAZAHA_INTEGRITY_GOV": {
        "source_type": SourceType.REGULATORY_GUIDANCE,
        "issuing_organization": "Oversight and Anti-Corruption Authority (Nazaha)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "2023.1",
        "publication_date": date(2023, 6, 1),
        "effective_date": date(2023, 6, 1),
        "url": "https://nazaha.gov.sa",
        "framework": "Saudi Nazaha Corporate Integrity & Whistleblower Standard",
    },
    "SAUDI_NEW_COMPANIES_LAW": {
        "source_type": SourceType.LAW,
        "issuing_organization": "Ministry of Commerce (MoC)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Corporate & Commercial",
        "document_version": "Royal Decree M/132 (2023)",
        "publication_date": date(2023, 1, 19),
        "effective_date": date(2023, 1, 19),
        "url": "https://mc.gov.sa/en/Regulations/Pages/CompaniesLaw.aspx",
        "framework": "Saudi Ministry of Commerce New Companies Law Governance",
    },
    "SAUDI_GAC_COMPETITION_RULES": {
        "source_type": SourceType.LAW,
        "issuing_organization": "General Authority for Competition (GAC)",
        "jurisdiction": "Saudi Arabia (KSA)",
        "sector": "Cross-Sector",
        "document_version": "Royal Decree M/75 (2023)",
        "publication_date": date(2023, 3, 1),
        "effective_date": date(2023, 3, 1),
        "url": "https://gac.gov.sa/en/regulations",
        "framework": "Saudi General Authority for Competition Compliance Standard",
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
    
    all_chunks_seed = []
    md_files = list(KNOWLEDGE_BASE_DIR.glob("*.md"))
    print(f"Found {len(md_files)} regulatory markdown documents in knowledge base.")

    for file_path in md_files:
        source_info, clauses = parse_markdown_regulatory_file(file_path)
        if not source_info:
            continue

        print(f"[{source_info['source_type'].value:19}] {source_info['source_id']}: Parsed {len(clauses)} versioned requirements.")

        for clause in clauses:
            req_id_str = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{source_info['source_id']}:{clause['requirement_id']}"))
            crit_id_str = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"crit:{source_info['source_id']}:{clause['article_section']}"))

            provenance_payload = {
                "source_id": source_info["source_id"],
                "framework": source_info["framework"],
                "source_type": source_info["source_type"].value,
                "title": source_info["title"],
                "issuing_organization": source_info["issuing_organization"],
                "jurisdiction": source_info["jurisdiction"],
                "sector": source_info["sector"],
                "document_version": source_info["document_version"],
                "publication_date": source_info["publication_date"].isoformat() if source_info.get("publication_date") else None,
                "effective_date": source_info["effective_date"].isoformat() if source_info.get("effective_date") else None,
                "url": source_info["url"],
                "page": clause["page"],
                "section": clause["section"],
                "article": clause["article"],
                "clause": clause["clause"],
                "requirement_id": clause["requirement_id"],
                "requirement_version": 1,
                "requirement_text": clause["requirement_text"],
                "document_hash": clause["document_hash"],
                "source_document_hash": source_info["document_hash"],
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "status": "ACTIVE",
                "language": "en",
                "kb_version": KB_VERSION
            }

            chunk_payload = {
                "chunk_id": f"chunk-{req_id_str}",
                "compliance_criteria_id": crit_id_str,
                "regulatory_requirement_id": req_id_str,
                "requirement_id": clause["requirement_id"],
                "source_code": source_info["source_code"],
                "source_id": source_info["source_id"],
                "source_title": source_info["title"],
                "framework": source_info["framework"],
                "source_type": source_info["source_type"].value,
                "issuing_organization": source_info["issuing_organization"],
                "jurisdiction": source_info["jurisdiction"],
                "document_version": source_info["document_version"],
                "article_section": clause["article_section"],
                "clause": clause["clause"],
                "risk_domain": clause["risk_domain"].value,
                "title": clause["title"],
                "content_text": f"{clause['title']}\n{clause['requirement_text']}",
                "weight": float(clause["weight"]),
                "provenance": provenance_payload
            }
            all_chunks_seed.append(chunk_payload)

    # Write vector chunk seed file
    OUTPUT_VECTOR_SEED_FILE.write_text(json.dumps(all_chunks_seed, indent=2), encoding="utf-8")
    print("=" * 80)
    print(f"[SUCCESS] Generated Vector Store Chunk Seed File at: {OUTPUT_VECTOR_SEED_FILE}")
    print(f"Total Ingested Clauses: {len(all_chunks_seed)} chunks across {len(md_files)} regulatory frameworks.")
    print("=" * 80)

if __name__ == "__main__":
    from datetime import timezone
    process_and_seed_knowledge_base()
