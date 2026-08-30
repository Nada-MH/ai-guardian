# SAMA Outsourcing and Cloud Computing Framework for AI Workloads
**Source Identifier**: `SAMA_CLOUD_OUTSOURCING_AI`  
**Publishing Body**: Saudi Central Bank (SAMA)  
**Jurisdiction**: Saudi Arabia (KSA)  
**Version**: 2023.2  
**Category**: Finance Regulatory  

---

## Section 1: Materiality Assessment & Third-Party AI Governance

### Clause 1.1: Materiality Classification of AI Cloud Services
Financial institutions must conduct a formal materiality assessment prior to engaging any cloud service provider (CSP) or third-party AI platform (including Foundation Model APIs and SaaS AI tools). Any AI workload supporting core banking operations, credit decisioning, customer onboarding, fraud detection, or financial transaction processing is classified as a "Material Outsourcing Arrangement" requiring prior SAMA non-objection.

### Clause 1.2: Third-Party AI Vendor Due Diligence
Due diligence on third-party AI vendors must rigorously assess algorithmic explainability, cybersecurity posture, training data provenance, financial viability, sub-processor dependencies, and disaster recovery capabilities. Financial institutions cannot delegate regulatory accountability to third-party AI suppliers.

---

## Section 2: Data Sovereignty, Cloud Localization & Cryptographic Isolation

### Clause 2.1: In-Kingdom Data Localization for AI Training & Inference
All customer financial data, biometric templates, transaction records, and personally identifiable information (PII) processed by AI systems must reside strictly within certified data centers located physically in the Kingdom of Saudi Arabia (KSA). Processing or transferring financial AI training data to offshore cloud environments without explicit SAMA regulatory approval is strictly prohibited.

### Clause 2.2: Tenant Isolation and Bring-Your-Own-Key (BYOK) Encryption
Financial institutions utilizing multi-tenant public cloud AI services must enforce strict cryptographic boundary isolation. Sensitive customer data and AI model embeddings must be encrypted at rest and in transit using hardware security module (HSM) keys managed exclusively by the financial institution (BYOK / HYOK).

---

## Section 3: Business Continuity, Exit Strategies & Audit Rights

### Clause 3.1: Comprehensive Exit Strategy & Model Portability
Financial institutions must formulate and annually test a viable exit strategy for critical third-party AI models to mitigate vendor lock-in. The strategy must guarantee data extraction, model weight repatriation, and seamless migration to an alternative provider or on-premises fallback within ninety (90) days without operational disruption.

### Clause 3.2: Unrestricted Regulatory and Internal Audit Rights
All cloud and AI outsourcing contracts must explicitly grant SAMA inspectors, external auditors, and internal audit teams unrestricted, on-demand physical and digital audit access to facilities, model logs, source code, and training pipelines.
