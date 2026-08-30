# NIST AI 600-1 — Artificial Intelligence Risk Management Framework: Generative AI Profile
**Source Identifier**: `NIST_AI_600_1_GENAI`  
**Publishing Body**: National Institute of Standards and Technology (NIST)  
**Jurisdiction**: United States / International  
**Version**: NIST AI 600-1 (2024.07)  
**Category**: Core AI Governance / Risk Management  

---

## Section 1: Generative AI Risk Taxonomy & Threat Vectors

### Clause 1.1: Twelve Unique Generative AI Risk Vectors
Organizations deploying Foundation Models and Generative AI must evaluate the twelve specialized risk vectors identified in NIST AI 600-1:
1. Chemical, Biological, Radiological, or Nuclear (CBRN) information generation.
2. Cyberattack capability augmentation & automated exploit generation.
3. Facilitation of illegal Child Sexual Abuse Material (CSAM) or Non-Consensual Intimate Imagery (NCII).
4. Confabulation / Hallucination of factual inaccuracies with high perceived authority.
5. Dangerous, violent, or harmful content generation.
6. Information integrity degradation & coordinated synthetic disinformation campaigns.
7. Information security compromise & automated spear-phishing.
8. Intellectual Property (IP) infringement and training dataset copyright violations.
9. Privacy compromise via training data memorization and unmasked PII extraction.
10. System prompt injection, jailbreaking, and secondary instruction hijacking.
11. Value chain and third-party foundation model dependencies.
12. Bias, demographic disparity, and cultural representational harm.

### Clause 1.2: Content Provenance and Synthetic Data Integrity
Deployers of multimodal Generative AI systems must implement cryptographic provenance metadata and watermarking across all synthetic text, imagery, and audio outputs to prevent unauthorized spoofing and forensic unobservability.

---

## Section 2: Govern, Map, Measure, Manage (GOVERN / MAP / MEASURE / MANAGE) Actions

### Clause 2.1: Automated Red-Teaming & Benchmark Evaluation
Organizations must mandate continuous automated and human-in-the-loop red-teaming evaluating prompt vulnerability, toxic generation likelihood, and factual grounding precision across model updates.

### Clause 2.2: Contextual Guardrails & Retrieval Grounding
Generative AI applications utilized for compliance, legal, or financial advisement must enforce deterministic contextual boundary filters and Retrieval-Augmented Generation (RAG) grounding with verifiable citation lineage.
