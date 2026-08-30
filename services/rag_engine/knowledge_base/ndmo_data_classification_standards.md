# NDMO National Data Classification & Metadata Standards
**Source Identifier**: `NDMO_DATA_CLASSIFICATION_STD`  
**Publishing Body**: National Data Management Office (NDMO) / SDAIA  
**Jurisdiction**: Saudi Arabia (KSA)  
**Version**: 2.1 (2023.03)  
**Category**: Saudi GRC & Data Governance  

---

## Section 1: Four-Tier National Data Classification Policy

### Clause 1.1: Mandatory 4-Tier Security Classification
All data generated, collected, or processed by public entities, banks, and critical private sector organizations must be tagged with one of the four national classification tiers:
1. **Top Secret (غاية في السرية)**: Unauthorized disclosure causes exceptionally grave harm to national security or vital economic interests.
2. **Secret (سري)**: Unauthorized disclosure causes serious harm to national interests, financial markets, or state functions.
3. **Restricted (مقيد)**: Disclosure causes limited harm to organizational reputation, proprietary trade secrets, or individual privacy.
4. **Public (عام)**: Data designated for unrestricted public access and open data publication.

### Clause 1.2: Cryptographic Key Separation Based on Classification
Data classified as "Secret" or "Top Secret" must be stored in physically segregated, air-gapped, or cryptographically isolated databases using distinct encryption keys, with access restricted strictly on a need-to-know basis verified via biometric MFA.

---

## Section 2: Data Quality Management & Metadata Indexing

### Clause 2.1: Data Quality Dimensions & Automated Profiling
Entities must enforce continuous data quality monitoring across six core dimensions: Accuracy, Completeness, Consistency, Timeliness, Validity, and Uniqueness. Automated data profiling scripts must validate training datasets for machine learning models against these dimensions.

### Clause 2.2: Enterprise Data Catalog & Lineage Traceability
Entities must maintain an automated Enterprise Data Catalog documenting business terms, technical schemas, data owners, classification labels, and end-to-end data lineage from source extraction to AI model inference.
