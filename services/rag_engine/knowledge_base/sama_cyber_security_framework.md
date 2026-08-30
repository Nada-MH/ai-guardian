# SAMA Cyber Security Framework for Financial Institutions
**Source Identifier**: `SAMA_CSF_2022`  
**Publishing Body**: Saudi Central Bank (SAMA)  
**Version**: CS-2022-01  
**Category**: Finance Regulatory  

---

## Domain 1: Cyber Security Leadership and Governance

### Control 1.1: Cyber Security Governance for AI Systems
Financial institutions must integrate AI system assets—including model serving infrastructure, data pipelines, and API gateways—into the enterprise cybersecurity governance framework. The CISO or equivalent officer shall hold accountability for the security posture of all AI-driven services.

### Control 1.2: Information Security Policies for AI Operations
Security policies must explicitly address AI-specific risks including adversarial attacks on model inputs, data poisoning of training sets, prompt injection in large language model (LLM) integrations, and unauthorized model extraction or replication.

---

## Domain 2: Cyber Security Risk Management and Compliance

### Control 2.1: AI-Specific Threat Modeling
Financial institutions must conduct AI-specific threat modeling exercises at least annually, identifying adversarial vectors unique to machine learning workloads such as evasion attacks, model inversion, membership inference, and training data reconstruction.

### Control 2.2: Regulatory Compliance Mapping
AI system deployments must be mapped against all applicable regulatory obligations, including SAMA circulars, Saudi PDPL data protection requirements, and NCA Essential Cybersecurity Controls (ECC), with gaps documented and tracked to resolution.

---

## Domain 3: Cyber Security Operations and Technology

### Control 3.1: Secure AI Development Lifecycle (SAIDL)
AI model development must follow a Secure AI Development Lifecycle incorporating security reviews at each gate: data acquisition, feature engineering, model training, validation, deployment, and operational monitoring.

### Control 3.2: Access Control for AI Models and Data
Role-based access control (RBAC) must be enforced on model registries, training data stores, vector databases, and inference API endpoints. Privileged access to model weights and hyperparameters must require multi-factor authentication.

### Control 3.3: Logging and Monitoring of AI Inference Activity
All AI inference requests and responses must be logged with tamper-proof audit trails, including caller identity, input data fingerprint, output decision, timestamp, and latency. Anomaly detection must monitor for unusual inference volume or distribution shift.

### Control 3.4: Incident Response for AI Systems
The institution's incident response plan must include AI-specific playbooks addressing scenarios such as model compromise, adversarial data injection, unauthorized model access, and AI-driven fraud amplification.

---

## Domain 4: Third-Party Cyber Security

### Control 4.1: Vendor AI Security Assessment
Third-party AI vendors and cloud-hosted ML services must undergo cybersecurity risk assessment prior to onboarding. Assessments must evaluate data residency, encryption standards, access controls, and vulnerability management practices.

### Control 4.2: Contractual Security Requirements for AI Vendors
Contracts with AI service providers must include clauses mandating data encryption at rest (AES-256 minimum) and in transit (TLS 1.3), breach notification timelines (within 72 hours), right-to-audit provisions, and data deletion upon contract termination.
