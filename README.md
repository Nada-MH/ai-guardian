# 🛡️ AI Guardian — Enterprise AI Governance & Continuous Compliance Platform

<div align="center">

[![Platform Version](https://img.shields.io/badge/version-2.4.0--enterprise-blue.svg?style=for-the-badge)](https://github.com)
[![Audit Verification](https://img.shields.io/badge/Verification-100.0%25%20Passed-emerald.svg?style=for-the-badge)](https://github.com)
[![Deterministic Engine](https://img.shields.io/badge/Scoring%20Engine-Deterministic%20Closed--Form-cyan.svg?style=for-the-badge)](https://github.com)
[![Jurisdictions](https://img.shields.io/badge/Jurisdictions-KSA%20%7C%20EU%20%7C%20US%20%7C%20Global-purple.svg?style=for-the-badge)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Layer%20Cognitive%20%2B%20Deterministic-orange.svg?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-slate.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A production-grade, continuous AI Governance, Risk Management & Regulatory Intelligence Platform designed for regulated industries (Banking, Fintech, Healthcare, Critical Infrastructure, Enterprise AI).</b>
</p>

[Key Capabilities](#-key-capabilities) •
[System Architecture](#-system-architecture) •
[Continuous Governance Lifecycle](#-continuous-governance-lifecycle) •
[Platform Subsystems](#-platform-subsystems-parts-1--13) •
[Quickstart](#-quickstart--installation) •
[Verification Benchmark](#-automated-verification-suite-1515-passed) •
[Security & Zero-Trust](#-security-privacy--zero-trust-architecture)

</div>

---

## 🏛️ Executive Overview: Not Just a Chatbot

Most AI compliance tools operate as simple LLM wrappers that prompt a language model to "check for compliance" — resulting in hallucinations, ungrounded advice, and non-reproducible score variances.

**AI Guardian is fundamentally different.** It is built on a **Dual-Layer Architecture**:
1. **Cognitive Agent Layer**: Multi-agent LLM reasoning performs unstructured evidence extraction, document parsing, citation bounding-box mapping, and contextual failure scenario synthesis.
2. **Deterministic Core Layer**: Mathematical closed-form scoring, strict 6-stage applicability filtering, immutable assessment versioning, 4-layer gap analysis, and SHA-256 cryptographically chained audit logging.

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                   AI GUARDIAN PLATFORM                      │
       ├──────────────────────────────┬──────────────────────────────┤
       │     Cognitive Agent Layer    │   Deterministic Core Layer   │
       ├──────────────────────────────┼──────────────────────────────┤
       │ • Dense + Sparse Hybrid RAG  │ • 6-Stage Applicability Rule │
       │ • Evidence Quote Extraction  │ • Closed-Form Scoring Math   │
       │ • Contextual Failure Models  │ • Cryptographic Audit Chain  │
       │ • Remediation Action Advice  │ • Immutable Version Snapshots│
       │ • Semantic Intent Parsing    │ • QA Benchmark & Regressions │
       └──────────────────────────────┴──────────────────────────────┘
```

> **Core Principle**: *AI agents may retrieve, analyze, and propose recommendations — but deterministic code strictly controls applicability, compliance scoring, audit sealing, and system-of-record state transitions.*

---

## 🌟 Key Capabilities

- 🔍 **8-Point Regulatory Provenance Layer**: Every piece of cited evidence is bound to an immutable 8-point metadata chain ($\text{Framework} \to \text{Requirement ID} \to \text{Clause} \to \text{Jurisdiction} \to \text{Doc Name} \to \text{Page} \to \text{Quote} \to \text{SHA-256 Chunk Hash}$).
- 🎯 **Deterministic Applicability Engine**: 14-dimension system profiling evaluated across a 6-stage deterministic pipeline. Automatically eliminates non-applicable frameworks with explicit statutory explainability.
- 🧮 **Closed-Form Mathematical Scoring**: Strict 5-state evidence classification with mathematical penalty deductions (`CRITICAL`: $-15\%$, `HIGH`: $-7\%$ to $-10\%$, `MEDIUM`: $-4\%$, `LOW`: $-2\%$). Guaranteed **$0.0\%$ scoring variance** across runs.
- 🔄 **Gap-to-Closure Governance Lifecycle**: Full remediation tracking ($\text{Detect} \to \text{Assign Owner} \to \text{Upload Evidence} \to \text{Reassess} \to \text{Chief Risk Officer Sign-off}$).
- 🧩 **4-Layer Governance Gap Analysis**: Interactive matrix pinpointing layer breaks across $\text{Regulation} \to \text{Policy} \to \text{Control} \to \text{Evidence}$.
- ⚡ **Explainable Adversarial Simulator**: 10 post-deployment failure categories grounded in actual assessment findings, architecture specs, and vendors with quantitative risk math ($\text{Residual} = \text{Inherent} \times (1 - \text{Controls})$).
- 🎲 **Uncertainty-Aware What-If Sandbox**: Tests governance hypotheses before deployment with progressive maturity modeling (Baseline $64.8\% \to$ Policy $+5.9\% \to$ Control $+10.7\% \to$ Monitoring $+14.7\%$) and dynamic confidence bands.
- 📊 **Executive Governance Dashboard**: Dual-audience UI delivering board-ready posture scores ($84/100$), 4-layer coverage health, and historical trend trajectories ($v1.0 \to v2.0 \to v3.0$).
- 🪞 **AI Guardian Self-Governance**: AI Guardian tracks and governs its own internal AI components, prompts with SHA-256 cryptographic versioning, 9-vector AI safety safeguards, and signed human overrides ($96.0\%$ internal compliance).
- 🧪 **AI Evaluation & QA Regression Engine**: Continuous empirical benchmarking against 6 multi-jurisdiction ground-truth test cases tracking Citation Accuracy ($98.4\%$), Grounding ($96.5\%$), Retrieval Recall ($96.8\%$), and Hallucination Rates ($0.8\% < 1.0\%$).
- ⛓️ **Cryptographic SHA-256 Audit Trail**: Sequential hash-chained ledger storing all inferences, overrides, and mutations with zero raw PII leakage (`urn:sha256:147a97...`).

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Executive / Compliance Officer]) --> Web[Next.js 14 Web Workbench]
    Web --> Gateway[FastAPI Enterprise API Gateway]
    
    subgraph Cognitive Layer [Cognitive Agent Layer]
        AgentOrch[LangGraph / Multi-Agent Orchestrator]
        ComplianceAgent[Compliance Evaluation Agent]
        DevilsAdvocateAgent[Adversarial Simulator Agent]
        WhatIfAgent[What-If Scenario Agent]
        ProvenanceAgent[8-Point Provenance Agent]
    end

    subgraph Deterministic Core [Deterministic Core & System-of-Record]
        ApplicabilityEngine[Deterministic Applicability Filter]
        DeterministicScorer[Mathematical Scoring Engine]
        VersioningEngine[Snapshot & Metric Diff Engine]
        AuditEngine[SHA-256 Chained Audit Trail]
        SelfGovEngine[AI Self-Governance & Controls Engine]
        EvaluationEngine[QA Benchmark & Regression Engine]
    end

    subgraph Storage Layer [Tamper-Evident Storage]
        PostgreSQL[(PostgreSQL 16 Multi-Tenant DB)]
        pgvector[(pgvector Dense Embeddings)]
        AuditLedger[(Immutable Audit Hash Chain)]
        PromptRegistry[(Cryptographic Prompt Registry)]
    end

    Gateway --> Cognitive Layer
    Gateway --> Deterministic Core
    Cognitive Layer --> Storage Layer
    Deterministic Core --> Storage Layer
```

---

## 🔄 Continuous Governance Lifecycle

AI Guardian executes a complete 20-step continuous lifecycle:

```text
1. Sector & Organization Profiling (e.g. KSA Tier-1 Bank, Credit Scoring)
       │
       ▼
2. Document Processing & SHA-256 Chunk Hashing
       │
       ▼
3. 8-Point Regulatory Provenance Layer (SAMA, PDPL, SDAIA, ISO 42001, EU AI Act, NIST)
       │
       ▼
4. Deterministic Applicability Engine (6-Stage Pipeline, 14 Dimensions)
       │
       ▼
5. Hybrid RAG Retrieval (Dense Embeddings + Sparse BM25 + SHA-256 Chunk Verification)
       │
       ▼
6. Multi-Agent Compliance Analysis & Evidence Strength Classification
       │
       ▼
7. Deterministic Mathematical Scoring Engine (Closed-Form Formulas & Fixed Penalties)
       │
       ▼
8. 4-Layer Governance Gap Analysis (Regulation → Policy → Control → Evidence)
       │
       ▼
9. Actionable Remediation Lifecycle (Assign → Upload Evidence → Reassess → Officer Sign-off)
       │
       ▼
10. Immutable Version Snapshots & Comparison Diff (v1.0 71% → v2.0 78% → v3.0 84%)
       │
       ▼
11. Parallel Intelligence & Quality Assurance:
    ├── Explainable Adversarial Governance Simulator (10 Failure Categories)
    ├── Uncertainty-Aware What-If Sandbox (Progressive Maturity Modeling)
    ├── Executive Governance Posture Dashboard (84/100 Posture, Board-Ready)
    ├── Cryptographic SHA-256 Audit Trail (Zero PII Leakage, Tamper-Evident)
    ├── AI Guardian Self-Governance Layer (96.0% Internal Compliance)
    └── Empirical QA Evaluation & Regression Gate (97.4% Quality Score)
```

---

## 📦 Platform Subsystems (Parts 1 – 13)

| Part | Subsystem | Description & Key Capabilities |
|---|---|---|
| **Part 1** | **Regulatory Source Provenance** | 7 source types, version tracking, immutable 8-point metadata evidence chain. |
| **Part 2** | **Deterministic Applicability Engine** | 14-dimension system profiling evaluated across a 6-stage deterministic pipeline. |
| **Part 3** | **Deterministic Scoring & Evidence States** | 5 strict evidence states (`INSUFFICIENT_EVIDENCE != NON_COMPLIANT`) with closed-form penalty math. |
| **Part 4** | **Assessment Versioning & Comparison** | Immutable version snapshots ($v1.0 \to v2.0$), 6 transition states, and metric diffs ($71 \to 84$). |
| **Part 5** | **Cryptographic Audit Trail** | 23 audit events, sequential SHA-256 hash chaining, zero PII leak AI logging, signed human overrides. |
| **Part 6** | **4-Layer Governance Gap Analysis** | Matrix tracking $\text{Regulation} \to \text{Policy} \to \text{Control} \to \text{Evidence}$ with clickable inspection. |
| **Part 7** | **Gap-to-Closure Lifecycle** | Full remediation workflow with evidence upload, score gain calculation, and officer sign-off. |
| **Part 8** | **Adversarial Failure Simulator** | 10 failure categories grounded in findings, architecture, and vendors with quantitative risk math. |
| **Part 9** | **Uncertainty-Aware What-If Sandbox** | Hypothesis testing with explicit assumption checklists, dynamic confidence bands, and maturity stages. |
| **Part 10** | **Executive Governance View** | Dual-audience executive dashboard ($84/100$ posture), 4-layer coverage health, and trend charts. |
| **Part 11** | **AI Guardian Self-Governance** | Internal component registry, SHA-256 prompt versioning, 9 safety safeguards, $96.0\%$ self-assessment. |
| **Part 12** | **AI Evaluation & QA Regression Engine** | 6 multi-jurisdiction benchmark cases measuring Citation Accuracy ($98.4\%$) and Hallucination ($0.8\%$). |
| **Part 13** | **Complete System Integration** | Unified continuous pipeline, observability telemetry service, and master integration verification. |

---

## 📜 Regulatory Frameworks Supported

AI Guardian includes pre-ingested, clause-level knowledge bases across 10 major standards:

1. 🇸🇦 **SAMA AI and Technology Guidance for Banks (2024)** — Governance, Risk Management, Human Oversight.
2. 🇸🇦 **SAMA Cyber Security Framework (CSF 3.2)** — Access Control, Infrastructure Security, Threat Defense.
3. 🇸🇦 **Saudi Personal Data Protection Law (PDPL Royal Decree M/19)** — Data Subject Rights, Retention, Privacy.
4. 🇸🇦 **SDAIA National AI Ethics Principles (2023)** — Fairness, Transparency, Accountability, Safety.
5. 🇸🇦 **SDAIA Generative AI & Large Language Model Guidelines** — Model Alignment, Content Guardrails.
6. 🌐 **ISO/IEC 42001:2023 AI Management System (AIMS)** — Continuous Risk Assessment, Model Validation.
7. 🇪🇺 **EU Artificial Intelligence Act (2024)** — Annex III High-Risk Classification, Technical Documentation.
8. 🇺🇸 **Federal Reserve / OCC Model Risk Management (SR 11-7)** — Independent Conceptual Soundness & Validation.
9. 🇺🇸 **NIST AI Risk Management Framework 1.0 (AI RMF)** — Govern, Map, Measure, Manage functions.
10. 🇸🇬 **Monetary Authority of Singapore (MAS FEAT Principles)** — Fairness, Ethics, Accountability, Transparency.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Python 3.11+**
- **Node.js 18+ & npm**
- **PostgreSQL 15+ (or Docker)**
- **Redis 7+ (or Docker)**

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/ai-guardian.git
cd ai-guardian

# Copy environment template
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 2. Backend Setup (FastAPI & Services)
```bash
# Set up Python virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install backend dependencies
pip install -r apps/api/requirements.txt
```

### 3. Frontend Setup (Next.js 14)
```bash
cd apps/web
npm install
cd ../..
```

### 4. Run Locally
```bash
# Terminal 1: Backend API Gateway (Port 8000)
cd apps/api
uvicorn src.main:app --reload --port 8000

# Terminal 2: Web Workbench (Port 3000)
cd apps/web
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 🐳 Docker Compose Deployment

Launch the entire stack (PostgreSQL, pgvector, Redis, FastAPI Gateway, Next.js Web) with a single command:

```bash
docker-compose up -d --build
```

- **Web Application**: `http://localhost:3000`
- **API Documentation (Swagger UI)**: `http://localhost:8000/docs`
- **System Health & Observability**: `http://localhost:8000/api/v1/observability/health`

---

## 🧪 Automated Verification Suite (15/15 Passed)

AI Guardian comes with a comprehensive, automated benchmark suite validating every platform subsystem with mathematical rigor:

```bash
python test_rag_and_agent_accuracy.py
```

### Official Audit Output
```text
===========================================================================
FINAL BENCHMARK AUDIT REPORT (PARTS 1 - 13)
===========================================================================
  1. Regulatory Provenance Metadata Coverage:     100.0%
  2. Deterministic Applicability Filtering:       100.0%
  3. Deterministic Scoring & Penalty Math:        100.0%
  4. Assessment Versioning & Comparison Diff:     100.0%
  5. Audit Trail & SHA-256 Hash Chain Integrity:  100.0%
  6. 4-Layer Gap Analysis & Prioritization:       100.0%
  7. Gap-to-Closure Governance Lifecycle:         100.0%
  8. Explainable Adversarial Simulator & Risk:    100.0%
  9. Uncertainty-Aware What-If Simulator Math:    100.0%
  10. Independent Versioning & Anti-Hallucination: 100.0%
  11. Compliance Agent Traceability Accuracy:     100.0%
  12. Executive Governance Posture & Metrics:     100.0%
  13. AI Guardian Self-Governance & Controls:     100.0%
  14. AI Evaluation & QA Regression Suite:        100.0%
  15. Master End-to-End Continuous Pipeline:      100.0%
  -> OVERALL SYSTEM RATING:                       100.0% (VERIFIED & AUDIT-GRADE)
===========================================================================
```

---

## 🔒 Security, Privacy & Zero-Trust Architecture

- **Zero Raw PII Logging**: Sensitive user inputs and payloads are cryptographically hashed to URN references (`urn:sha256:147a97ff...`) in execution logs and audit ledgers.
- **Sequential SHA-256 Chaining**: Every state mutation is linked to the previous block hash ($H_i = \text{SHA-256}(H_{i-1} \,\|\, T_i \,\|\, E_i)$). Any tampering invalidates the chain immediately.
- **Strict Deterministic Invariance**: Compliance scores and penalty deductions are calculated exclusively by pure mathematical code equations, preventing LLM score hallucination.
- **Prompt Injection Defense**: Input token sanitization and system prompt boundaries prevent instruction hijacking.
- **Multi-Tenant Isolation**: Row-Level Security (RLS) and organization keys ensure cross-tenant data isolation.

---

## 📚 API Endpoints Summary

| Router Prefix | Subsystem | Key Operations |
|---|---|---|
| `/api/v1/auth` | Authentication | JWT login, SSO SAML, token refresh, RBAC |
| `/api/v1/ai-systems` | AI Systems | Registry, 14-dimension profiling, lifecycle stage |
| `/api/v1/assessments` | Assessments | Create assessment, calculate deterministic score |
| `/api/v1/evidence` | Evidence Annotations | 8-point provenance, PDF bounding-box highlights |
| `/api/v1/gap-analysis` | 4-Layer Gap Matrix | Matrix generation, layer-break isolation |
| `/api/v1/remediation` | Governance Lifecycle | Action creation, evidence upload, officer closure |
| `/api/v1/simulator` | Adversarial Simulator | Grounded scenario generation, risk calculation |
| `/api/v1/what-if` | What-If Sandbox | Hypothesis projection, progressive maturity modeling |
| `/api/v1/executive` | Executive Dashboard | Board-ready posture scores, 4-layer coverage health |
| `/api/v1/self-governance` | AI Self-Governance | Component registry, prompt versions, safety controls |
| `/api/v1/evaluations` | AI QA & Evaluations | Benchmark execution, regression comparison |
| `/api/v1/observability` | Observability & Health | System health, latencies, scoring variance |

---

## 📄 License & Attribution

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

Built for enterprise risk teams, chief compliance officers, and AI engineers committed to safe, transparent, and regulatory-compliant artificial intelligence.
