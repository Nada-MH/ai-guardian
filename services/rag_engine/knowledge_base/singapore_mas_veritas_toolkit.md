# Monetary Authority of Singapore (MAS) Veritas Toolkit 2.0 for Responsible AI
**Source Identifier**: `MAS_VERITAS_TOOLKIT_2`  
**Publishing Body**: Monetary Authority of Singapore (MAS)  
**Jurisdiction**: Singapore / International Finance  
**Version**: 2.0 (2023.11)  
**Category**: Finance Regulatory  

---

## Section 1: FEAT Principles Operationalization (Fairness, Ethics, Accountability, Transparency)

### Clause 1.1: Quantitative Fairness Assessment & Metric Selection
Financial institutions must systematically evaluate AI decision models (e.g. credit approvals, insurance claims, fraud detection) using quantitative fairness metrics tailored to the specific business context, including:
- Demographic Parity / Disparate Impact for equitable representation.
- Equal Opportunity / True Positive Rate parity for non-discriminatory benefit allocation.
- Predictive Equality / False Positive Rate parity for equitable penalty distribution.

### Clause 1.2: Justification of Unintentional Discrimination
Where an AI model demonstrates statistical disparity across demographic groups, the institution must document a comprehensive, legally defensible business and risk justification demonstrating that the disparity is necessary, proportionate, and unresolvable via alternative non-discriminatory modeling techniques.

---

## Section 2: Transparency, Explainability & Multi-Stakeholder Accountabilities

### Clause 2.1: Granular Local and Global Explainability
Institutions must deploy dual-level explainability frameworks: Global Interpretability for model risk auditors to understand overall feature importance, and Local Explainability for affected customers to receive clear, individual rationales for specific automated credit or claims decisions.

### Clause 2.2: Continuous Traceability and End-to-End Governance Audit Logs
All data preparation steps, model training hyper-parameters, validation test results, and production decision logs must be maintained in an immutable audit repository enabling independent retrospective auditability.
