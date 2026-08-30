# AI Guardian — Regulatory Classification & Applicability Engine Architecture Specification

## 1. Executive Summary

AI Guardian features a deterministic **Regulatory Classification and Applicability Engine** that sits between AI System Intake Profiling and the Multi-Agent Retrieval & Evaluation pipeline. Rather than uniformly applying every regulation in the knowledge base to every company, the engine dynamically determines which statutory laws, supervisory circulars, and technical standards apply to the assessed AI system, and provides transparent explainability for every inclusion and exclusion decision.

---

## 2. Assessment Intake Profile (14 Operational Dimensions)

The engine evaluates AI systems across 14 operational dimensions:

| # | Dimension | Description / Value Range | Impact on Applicability |
| :--- | :--- | :--- | :--- |
| **1** | `jurisdiction` | `Saudi Arabia (KSA)`, `European Union`, `United States`, `Singapore`, `Hong Kong`, `Global` | Filters national laws (SAMA, PDPL, EU AI Act, HKMA, MAS). Global standards (ISO, OECD) apply universally. |
| **2** | `sector` | `Banking & Finance`, `Healthcare`, `Telecommunications`, `Government`, `Cross-Sector` | Excludes domain-specific frameworks (e.g. SAMA CSF applies exclusively to Banking & Finance). |
| **3** | `organization_type` | `Commercial Bank`, `Fintech / Payments`, `Insurance`, `Brokerage`, `Enterprise SaaS` | Fine-tunes institution-specific compliance burdens. |
| **4** | `ai_use_case` | `Credit Scoring`, `Fraud Detection`, `AML`, `Chatbot / LLM`, `Algorithmic Trading` | Triggers specialized regulatory chapters (e.g. Credit scoring triggers Model Risk Management). |
| **5** | `system_purpose` | Natural language statement of operational scope & business objective | Used for semantic indexing and documentation validation. |
| **6** | `data_types` | `["National ID", "SIMAH History", "Income", "Biometrics", ...]` | Activates privacy and data minimization rules under Saudi PDPL & SAMA. |
| **7** | `sensitive_data` | `Boolean` (`True` / `False`) | Mandates Article 13 PDPL data retention & encryption controls. |
| **8** | `deployment_stage` | `Production`, `Validation`, `Staging`, `Development` | Production status mandates full compliance; pre-prod allows sandbox testing. |
| **9** | `production_status` | `Active in Production`, `Pre-Deployment Testing`, `Regulatory Sandbox` | Affects severity weighting and audit workpaper disclosures. |
| **10** | `decision_impact` | `High Impact (Binding Denial/Approval)`, `Medium Impact`, `Low Impact` | High impact requires mandatory human-in-the-loop oversight and appeals. |
| **11** | `affected_users` | `Retail Consumers`, `Internal Staff`, `Commercial Entities` | Consumer-facing models require explainable adverse action notices. |
| **12** | `human_oversight` | `Fully Autonomous`, `Human-in-the-loop`, `Human-on-the-loop` | Fully autonomous high-impact systems trigger critical governance gap alerts. |
| **13** | `third_party_components`| `Boolean` (`True` / `False`) | Activates third-party vendor risk controls (SAMA CSF Section 3, ISO 42001 A.8). |
| **14** | `risk_level` | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` | Calibrates audit rigor and remediation priority roadmaps. |

---

## 3. The 6-Stage Deterministic Applicability Pipeline

```text
Assessment Profile (14 Dimensions)
        ↓
Stage 1: Jurisdiction Detection & Filtering
        ↓
Stage 2: Sector & Industry Scope Matching
        ↓
Stage 3: Data & Privacy Trigger Evaluation
        ↓
Stage 4: AI Use Case & Operational Impact Evaluation
        ↓
Stage 5: Requirement-Level Rule Applicability Matrix
        ↓
Stage 6: Output Partitioning:
         ├─ Applicable Requirements (Proceeds to RAG Retrieval & Evaluation)
         └─ Excluded Requirements (Omitted from Scoring Denominator)
```

---

## 4. Transparent Explainability Architecture

Every requirement evaluated receives a structured decision payload:

```json
{
  "requirement_id": "REQ-SAMA-AI-5.3",
  "source_id": "SRC-SAMA-AI-2024",
  "framework": "SAMA AI and Technology Guidance for Banks",
  "clause": "Clause 5.3: Mandatory Human Intervention",
  "applicable": true,
  "confidence": 1.0,
  "applicability_reasons": [
    "✓ Jurisdiction Match: Saudi Central Bank (SAMA) jurisdiction applies to Saudi Arabia (KSA)",
    "✓ Sector Match: Financial Services regulation applied to Commercial Bank (Tier 1)",
    "✓ AI Use Case Trigger: Automated retail credit scoring & loan denial decisions require human review paths",
    "✓ Decision Impact: High Impact (Binding Financial Denial) in Production requires human-in-the-loop appeal mechanism"
  ],
  "exclusion_reasons": []
}
```

For excluded rules:

```json
{
  "requirement_id": "REQ-EU-AI-ACT-10",
  "source_id": "SRC-EU-AI-ACT",
  "framework": "EU Artificial Intelligence Act",
  "applicable": false,
  "confidence": 1.0,
  "applicability_reasons": [],
  "exclusion_reasons": [
    "✗ Excluded: Regulation jurisdiction (European Union) does not apply to assessed jurisdiction (Saudi Arabia / KSA)",
    "✗ Excluded: Assessed model does not place AI products on the EU market nor process EU citizens data"
  ]
}
```

---

## 5. Scoring Denominator Integrity

$$\text{Overall Compliance Score} = \frac{\sum_{i \in \text{Applicable Requirements}} \text{Score}_i \times \text{Weight}_i}{\sum_{i \in \text{Applicable Requirements}} \text{Weight}_i}$$

* Non-applicable requirements are **never penalized as non-compliant** and are **excluded from the score denominator**.
