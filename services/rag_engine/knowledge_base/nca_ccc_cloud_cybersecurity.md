# NCA Cloud Cybersecurity Controls (CCC-1:2020) for AI Infrastructure
**Source Identifier**: `NCA_CCC_2020`  
**Publishing Body**: National Cybersecurity Authority (NCA)  
**Jurisdiction**: Saudi Arabia (KSA)  
**Version**: CCC-1:2020  
**Category**: Core AI Governance / Cybersecurity  

---

## Section 1: Cloud Service Provider (CSP) Security & Sovereign Classification

### Clause 1.1: Sovereign Data Classification and Host Validation
Government agencies and critical national infrastructure entities deploying AI workloads must utilize Cloud Service Providers (CSPs) certified at Class C or higher by the Communications, Space and Technology Commission (CST) and compliant with NCA CCC-1:2020 sovereign controls.

### Clause 1.2: Virtual Machine & Container Isolation for AI Workloads
AI training and inference workloads executing on GPU/TPU clusters must enforce hardware-level container and hypervisor isolation, preventing memory leakage, cross-tenant lateral movement, or unauthorized host access.

---

## Section 2: Identity, Access & Cryptographic Key Governance

### Clause 2.1: Multi-Factor Authentication (MFA) & Least Privilege
Administrative access to cloud AI infrastructure, model repositories, vector databases, and weights must mandate hardware-token Multi-Factor Authentication (MFA) and granular Role-Based Access Control (RBAC).

### Clause 2.2: Cryptographic Key Sovereignty in Cloud AI
All encryption keys utilized for encrypting AI training datasets, vector stores, and model checkpoints must be generated, stored, and managed within FIPS 140-2 Level 3 compliant Hardware Security Modules (HSMs) located within the territorial boundaries of Saudi Arabia.
