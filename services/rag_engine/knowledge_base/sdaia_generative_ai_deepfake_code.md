# SDAIA Generative AI, LLM & Synthetic Media Ethics Code
**Source Identifier**: `SDAIA_GENAI_DEEPFAKE_2024`  
**Publishing Body**: Saudi Data & AI Authority (SDAIA)  
**Jurisdiction**: Saudi Arabia (KSA)  
**Version**: 2024.1  
**Category**: Core AI Governance / Regulatory Guidance  

---

## Section 1: Transparency, Watermarking & Synthetic Media Disclosure

### Clause 1.1: Mandatory Machine-Readable Watermarking
All Generative AI systems operating in the Kingdom that generate synthetic text, high-resolution imagery, audio, or video content must embed robust, tamper-resistant, machine-readable cryptographic watermarks (compliant with C2PA / Coalition for Content Provenance and Authenticity standards).

### Clause 1.2: Explicit Consumer Synthetic Content Disclosure
Deployers of customer-facing Generative AI interfaces, voicebots, or automated conversational agents must explicitly and prominently display a clear disclaimer informing users that the content or audio they are interacting with is AI-generated.

---

## Section 2: Safety Alignment, Hallucination Defense & Jailbreak Guardrails

### Clause 2.1: Robust Jailbreak Defense & Adversarial Red-Teaming
Before deploying Large Language Models (LLMs) into production, organizations must conduct adversarial prompt injection, jailbreak testing, and automated red-teaming to ensure models cannot be manipulated into generating illegal content, hate speech, malicious software, or unverified financial/medical claims.

### Clause 2.2: Arabic Cultural Alignment & Hallucination Mitigation
LLM applications serving Saudi citizens must demonstrate high linguistic fidelity in Modern Standard Arabic and Saudi dialects. Generative AI retrieval pipelines (RAG) must enforce verifiable citation grounding to reduce factual hallucination rates below 1.0%.
