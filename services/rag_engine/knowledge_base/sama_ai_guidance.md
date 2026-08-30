# SAMA Artificial Intelligence and Technology Guidance for Financial Institutions
**Source Identifier**: `SAMA_AI_GUIDANCE_2024`  
**Publishing Body**: Saudi Central Bank (SAMA)  
**Version**: 2024.1  
**Category**: Finance Regulatory  

---

## Section 1: Governance, Accountability, and Oversight

### Clause 1.1: Board and Senior Management Responsibility
Financial institutions deploying AI and Machine Learning (ML) systems must ensure that ultimate accountability for AI outcomes remains with the Board of Directors and Executive Management. AI models shall not act as autonomous decision-makers without designated human management oversight.

### Clause 1.2: AI Governance Framework and Committee
Every bank and financial entity operating in the Kingdom of Saudi Arabia must establish an independent AI Governance Committee. This committee is responsible for approving high-risk AI deployments, reviewing model risk assessments, and ensuring alignment with SAMA regulations and national data privacy laws.

---

## Section 2: Model Risk Management & Validation

### Clause 2.1: Annual Independent Model Validation
All AI/ML models categorized as Tier 1 (Critical) or Tier 2 (High Risk)—including credit scoring, algorithmic trading, underwriting, and automated fraud detection—must undergo a mandatory annual independent model validation by an internal validation unit or accredited third-party auditor separate from the model development team.

### Clause 2.2: Model Lineage and Performance Monitoring
Financial institutions must maintain an immutable model registry documenting model lineage, training dataset provenance, feature selection logic, and algorithm versions. Performance drift metrics (e.g. Population Stability Index PSI > 0.25) must trigger automatic recalibration or model deactivation.

---

## Section 3: Explainability and Transparency

### Clause 3.1: Human-Interpretable Explanations for Credit & Adverse Decisions
Any AI system used for credit decisioning, loan approval, or insurance underwriting must provide actionable, human-interpretable explanations (using SHAP, LIME, or TreeSHAP) for adverse decisions or rejections, detailing the top contributing features to the applicant.

### Clause 3.2: Customer Disclosure
Financial institutions must explicitly disclose to customers whenever they are interacting with an automated AI system (e.g. chatbots, robo-advisors) or when an automated AI model has made a decision impacting their financial standing.

---

## Section 4: Fairness, Bias, and Ethics

### Clause 4.1: Demographic Bias Auditing & Disparate Impact
AI models must be audited quarterly for disparate impact across demographic, gender, and regional groups. Disparate impact ratios falling below 0.80 (the 4/5ths rule) constitute a non-compliant bias violation requiring immediate model suspension.

### Clause 4.2: Prohibition of Discriminatory Variables
AI models shall not utilize protected attributes (such as tribe, religion, or unapproved proxy indicators) in credit, insurance, or financial decisioning algorithms.

---

## Section 5: Cybersecurity, Data Protection, and Operational Resilience

### Clause 5.1: Alignment with SAMA Cyber Security Framework (CSF)
AI system infrastructure, API endpoints, and model weights must adhere to SAMA CSF controls. Model weights must be encrypted at rest (AES-256) and in transit (TLS 1.3).

### Clause 5.2: Human-in-the-Loop & Emergency Kill-Switch
All production financial AI systems must feature an automated, real-time emergency kill-switch capability enabling risk officers to instantly revert decisioning to a deterministic fallback system during model anomalies or cyber attacks.
