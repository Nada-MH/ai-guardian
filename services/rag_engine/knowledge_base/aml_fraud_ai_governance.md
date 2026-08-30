# AML, Fraud Detection, and Financial Crime AI Governance Guidance
**Source Identifier**: `AML_FRAUD_AI_GOV`  
**Publishing Body**: FATF / SAMA  
**Version**: FATF Guidance 2024  
**Category**: Finance Regulatory  

---

## Section 1: AI in Anti-Money Laundering (AML) Compliance

### Clause 1.1: AI-Assisted Transaction Monitoring Governance
AI and ML models used for suspicious transaction monitoring must be governed under the institution's AML compliance framework, with documented model risk assessments, validation reports, and regulatory approval where mandated.

### Clause 1.2: False Positive and False Negative Management
Financial institutions must establish thresholds and monitoring dashboards for AI model false positive rates (excessive alerts burdening compliance teams) and false negative rates (missed suspicious transactions), with governance triggers for model recalibration when thresholds are breached.

### Clause 1.3: Explainability of AML Alert Generation
AI-generated AML alerts must be accompanied by human-readable explanations detailing the transaction patterns, behavioral signals, and risk factors that triggered the alert, enabling compliance analysts to make informed investigation decisions.

---

## Section 2: AI-Powered Fraud Detection

### Clause 2.1: Real-Time Fraud Detection Model Governance
Real-time AI fraud detection models must maintain sub-100ms inference latency while producing auditable decision logs. Model updates must follow a staged deployment process with shadow-mode testing before production activation.

### Clause 2.2: Adversarial Robustness in Fraud Models
Fraud detection AI systems must be tested against adversarial attack vectors including transaction structuring to evade detection, synthetic identity fraud patterns, and coordinated fraud ring behaviors. Robustness testing must be conducted quarterly.

---

## Section 3: Data Privacy in Financial Crime AI

### Clause 3.1: Lawful Processing for AML Purposes
Processing of personal financial data by AI systems for AML and counter-terrorism financing (CTF) purposes is permissible under statutory authority without individual consent, provided that data is processed solely for compliance purposes and not repurposed for marketing or commercial analytics.

### Clause 3.2: Data Retention Limits for Financial Crime AI
Transaction data and AI model inference logs used for financial crime detection must be retained for the statutory minimum period (7 years under SAMA regulations), after which data must be securely purged with documented destruction certificates.

---

## Section 4: Regulatory Reporting and Audit

### Clause 4.1: Suspicious Activity Report (SAR) Documentation
When an AI system generates or contributes to a Suspicious Activity Report (SAR) filing, the report must document the AI model's role in alert generation, the evidence chain, and the compliance officer's independent judgment confirming the filing decision.

### Clause 4.2: Regulatory Examination Readiness
Financial institutions must maintain documentation sufficient for regulatory examiners to independently evaluate the AI model's design, training methodology, validation results, and operational performance in financial crime detection.
