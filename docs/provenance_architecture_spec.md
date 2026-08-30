# AI Guardian — Regulatory Source Provenance Layer Architecture Specification

## 1. Overview & Objective

The **Regulatory Source Provenance Layer** guarantees that every regulatory requirement, compliance criterion, and audit finding within AI Guardian maintains structured, cryptographically verifiable, and immutable traceability.

```
+---------------------------------------------------------------------------------------------------+
|                                 8-POINT TRACEABILITY CHAIN                                        |
+-------------------+--------------------+--------------------+--------------------+----------------+
| 1. Finding ID     | 2. Requirement ID  | 3. Source Document | 4. Exact Clause    | 5. Evidence Doc|
|    (e.g. F-001)   | (REQ-SAMA-AI-5.3)  | (sama_ai_guidance) | (Clause 5.3)       | (Model_Spec)   |
+-------------------+--------------------+--------------------+--------------------+----------------+
| 6. Evidence Loc   | 7. Retrieved At    | 8. KB Version      |                                     |
|    (Page 4 / §4.1)| (2026-08-20T03:00) | (v1.4.2-provenance)|                                     |
+-------------------+--------------------+--------------------+-------------------------------------+
```

---

## 2. Canonical Regulatory Source Data Model

Every regulatory source in AI Guardian is stored according to the canonical schema:

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `source_id` | `VARCHAR(100)` | Unique canonical identifier | `SRC-SAMA-AI-2024` |
| `framework` | `VARCHAR(255)` | Full framework title | `SAMA AI and Technology Guidance for Banks` |
| `source_type` | `ENUM(SourceType)` | Legal authority level | `REGULATORY_GUIDANCE` |
| `title` | `VARCHAR(255)` | Official title | `SAMA AI Guidance for Financial Institutions` |
| `issuing_organization` | `VARCHAR(255)` | Supervisory body | `Saudi Central Bank (SAMA)` |
| `jurisdiction` | `VARCHAR(100)` | Geographical / statutory reach | `Saudi Arabia (KSA)` |
| `sector` | `VARCHAR(100)` | Applicable sector | `Banking & Finance` |
| `document_version` | `VARCHAR(50)` | Enacted version | `2024.1` |
| `publication_date` | `DATE` | Date issued | `2024-01-15` |
| `effective_date` | `DATE` | Date enforceable | `2024-06-01` |
| `url` | `VARCHAR(500)` | Official regulatory portal URL | `https://www.sama.gov.sa/...` |
| `document_hash` | `CHAR(64)` | SHA-256 hash of canonical content | `8f434346648f6b96df89dda901c5176...` |
| `retrieved_at` | `TIMESTAMP` | Ingestion timestamp | `2026-08-20T03:00:00Z` |
| `status` | `ENUM` | Lifecycle status | `ACTIVE`, `SUPERSEDED`, `DRAFT` |
| `language` | `VARCHAR(10)` | ISO language code | `en`, `ar` |

---

## 3. Seven Distinct Source Types

Legal authorities are not treated as equivalent. Each source type has distinct legal weight, hierarchy ranking, and validation rules:

1. **`LAW`**: Primary statutory legislation (e.g. Saudi Personal Data Protection Law — Royal Decree M/19, EU AI Act).
2. **`REGULATION`**: Mandatory regulatory rules issued by supervisory authorities (e.g. SAMA Cyber Security Framework, SAMA Open Banking).
3. **`REGULATORY_GUIDANCE`**: Interpretive guidance & supervisory expectations (e.g. SAMA AI Guidance, Model Risk Management SR 11-7).
4. **`STANDARD`**: Formal technical international standards (e.g. ISO/IEC 42001:2023, ISO/IEC 23894:2023).
5. **`FRAMEWORK`**: National or industry governance frameworks (e.g. NIST AI RMF 1.0, NDMO Data Governance, ITU Y.3172).
6. **`ETHICS_PRINCIPLE`**: Ethical charters & principles (e.g. SDAIA AI Ethics Principles, UNESCO AI Ethics, OECD Principles).
7. **`INTERNAL_POLICY`**: Organization-specific policies & charters (e.g. FinTrust Model Governance Policy).

---

## 4. Independent Requirement Versioning Schema

When a regulatory requirement or clause changes, AI Guardian performs an **immutable version bump** rather than overwriting historical audit data:

```sql
-- Conceptual Schema
CREATE TABLE regulatory_requirements (
    id UUID PRIMARY KEY,
    requirement_id VARCHAR(100) NOT NULL,    -- e.g. "REQ-SAMA-AI-5.3"
    source_id UUID REFERENCES regulatory_sources(id),
    page INT,
    section VARCHAR(100),
    article VARCHAR(100),
    clause VARCHAR(100),
    requirement_text TEXT NOT NULL,
    version INT NOT NULL DEFAULT 1,
    previous_version_id UUID REFERENCES regulatory_requirements(id),
    is_current_version BOOLEAN NOT NULL DEFAULT TRUE,
    document_hash CHAR(64) NOT NULL,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);
```

When an amendment occurs:
1. `existing_req.is_current_version = FALSE` and `existing_req.status = 'SUPERSEDED'`.
2. New row inserted with `version = existing_req.version + 1`, `previous_version_id = existing_req.id`, and `is_current_version = TRUE`.
3. Historical audit workpapers referencing `v1` remain 100% intact and verifiable!

---

## 5. RAG Engine & Multi-Agent Anti-Hallucination Directives

1. **Chunk Provenance Payload**: Every chunk indexed by `services/rag_engine/` carries the full `provenance` dictionary.
2. **Strict Citation Directives**: Agents are constrained by system prompts never to generate citations without a verified source record in the retrieved context.
3. **Unverified Fallback**: If provenance metadata is absent, the citation is strictly tagged:
   ```
   "citation_reference": "Source verification unavailable"
   "provenance_status": "UNVERIFIED"
   ```

---

## 6. Frontend Provenance Components

- `apps/web/src/components/findings/ProvenanceBadge.tsx`: Visual badge for each source type.
- `apps/web/src/components/findings/SourceProvenanceModal.tsx`: Complete canonical metadata drawer with cryptographic SHA-256 hash copying.
- `apps/web/src/components/findings/FindingProvenanceCard.tsx`: Expandable card displaying the full 8-point traceability chain.
