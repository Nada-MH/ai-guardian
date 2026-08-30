# AI Guardian — Deterministic Evidence Classification & Scoring Architecture Specification

## 1. Executive Summary

This specification defines the production-grade **Evidence State Classification & Deterministic Compliance Scoring Engine** for the AI Guardian platform.

### Core Architectural Principle
> **The LLM evaluates evidence and requirements; the Deterministic Engine computes all numeric compliance scores.**
> Under no circumstances does an LLM directly generate, deduct, or modify numeric compliance scores.

---

## 2. Evidence State Machine

Every regulatory requirement evaluated during an assessment is categorized into exactly one of five primary compliance evidence states:

```
                                  [ Assessment Intake ]
                                            │
                                            ▼
                           [ Deterministic Applicability Engine ]
                                            │
                        ┌───────────────────┴───────────────────┐
                        │                                       │
                 [ IN-SCOPE (True) ]                   [ OUT-OF-SCOPE (False) ]
                        │                                       │
                        ▼                                       ▼
           [ Compliance Evaluation Agent ]               NOT_APPLICABLE
                        │                         (Excluded from Denominator)
       ┌────────────────┼────────────────┬────────────────┐
       ▼                ▼                ▼                ▼
   COMPLIANT    PARTIALLY_COMPLIANT  NON_COMPLIANT  INSUFFICIENT_EVIDENCE
  (μ = 1.0)        (μ = 0.5)           (μ = 0.0)          (μ = 0.0)
                                                    (Flagged for Review;
                                                     NOT a proven violation)
```

### State Definitions & Operational Guardrails:
1. **`COMPLIANT`**:
   - Verification: Uploaded documents explicitly prove that mandatory technical and operational controls are fully implemented.
   - Base Multiplier ($\mu_r$): $1.00$.
2. **`PARTIALLY_COMPLIANT`**:
   - Verification: Evidence indicates policy or partial implementation exists, but operational verification (e.g. logs, API enforcement) is incomplete.
   - Base Multiplier ($\mu_r$): $0.50$.
3. **`NON_COMPLIANT`**:
   - Verification: Evidence actively demonstrates violation or contradictory practices (e.g. automated denial with no human appeal path).
   - Base Multiplier ($\mu_r$): $0.00$.
4. **`INSUFFICIENT_EVIDENCE`**:
   - **CRITICAL GUARDRAIL**: `INSUFFICIENT_EVIDENCE` is explicitly distinct from `NON_COMPLIANT`.
   - Distinguishes *"Evidence shows the requirement is violated"* from *"No sufficient evidence was provided to verify compliance"*.
   - Automatically sets `review_required = true` for human compliance underwriter workflow.
   - Base Multiplier ($\mu_r$): $0.00$ (with explicit missing evidence reporting).
5. **`NOT_APPLICABLE`**:
   - Verification: Filtered out by the 6-stage Deterministic Applicability Engine (Part 2).
   - Base Multiplier ($\mu_r$): Excluded completely from both numerator and denominator.

---

## 3. Evidence Strength Classification

Every citation and piece of evidence is classified into one of four strength tiers:
- **`STRONG`**: Direct technical verification (e.g. architecture diagrams, source code snippets, runtime execution logs, validated model cards).
- **`MODERATE`**: High-level operational documentation, bank policies, governance guidelines.
- **`WEAK`**: Ambiguous, indirect, or tangential references.
- **`NONE`**: No evidence found in uploaded documentation.

---

## 4. Deterministic Scoring Formulation

### 4.1 Configurable Category Weights ($W_c$)

| Financial AI Risk Domain ($c$) | Default Weight ($W_c$) | Rationale |
| :--- | :---: | :--- |
| **Privacy & Data Protection** | **20%** | Compliance with statutory mandates (PDPL, GDPR, NDMO). |
| **Cybersecurity & Resilience** | **15%** | SAMA CSF & NCA ECC compliance; encryption & API security. |
| **Fairness & Non-Discrimination** | **15%** | SDAIA AI Ethics; prevention of discriminatory lending. |
| **Transparency & Explainability**| **15%** | Adverse action notices, SHAP/LIME feature attributions. |
| **Human Oversight & Governance** | **15%** | SAMA Clause 5.3 mandatory human intervention in rejections. |
| **Model Risk Governance** | **10%** | SR 11-7 validation cycles, model tiering, documentation. |
| **Continuous Monitoring & Drift**| **10%** | PSI drift bounds, adversarial stress testing, degradation. |
| **Total** | **100%** | |

---

### 4.2 Raw Category Score ($\text{RCS}_c$)

$$\text{RCS}_c = \frac{\sum_{r \in \text{Applicable}_c} w_r \times \mu_r \times \gamma_r}{\sum_{r \in \text{Applicable}_c} w_r} \times 100$$

*Where:*
- $w_r$ = Regulatory weight of requirement $r$ (Standard = 1.0, Mandatory = 2.0).
- $\mu_r$ = Satisfaction multiplier ($\text{COMPLIANT}=1.0$, $\text{PARTIALLY}=0.5$, $\text{NON\_COMPLIANT}=0.0$, $\text{INSUFFICIENT}=0.0$).
- $\gamma_r$ = Evaluation confidence score ($0.0 \le \gamma_r \le 1.0$).

---

### 4.3 Explicit Deterministic Risk Penalties ($P_c$)

No LLM may arbitrarily deduct points. Deductions follow strict mathematical rules:

$$P_c = \min\left(35.0, 5.0 \cdot N_{\text{crit}} + 3.0 \cdot N_{\text{high}} + 1.5 \cdot N_{\text{med}} + 0.5 \cdot N_{\text{low}} + 1.0 \cdot N_{\text{insufficient}}\right)$$

*Where:*
- $N_{\text{crit}}$ = Number of Critical findings in category $c$ ($-5.0$ pts each).
- $N_{\text{high}}$ = Number of High findings in category $c$ ($-3.0$ pts each).
- $N_{\text{med}}$ = Number of Medium findings in category $c$ ($-1.5$ pts each).
- $N_{\text{low}}$ = Number of Low findings in category $c$ ($-0.5$ pts each).
- $N_{\text{insufficient}}$ = Number of Insufficient Evidence items in category $c$ ($-1.0$ pt each).
- Max penalty cap = $35.0$ pts per domain.

---

### 4.4 Adjusted Category Score ($\text{ACS}_c$)

$$\text{ACS}_c = \max\left(0.0, \min\left(100.0, \text{RCS}_c - P_c\right)\right)$$

---

### 4.5 Overall Compliance Score ($\text{OCS}$)

$$\text{OCS} = \frac{\sum_{c} W_c \times \text{ACS}_c}{\sum_{c} W_c}$$

---

### 4.6 Overall Risk Classification
- **`CRITICAL`**: $\text{OCS} < 50.0$ OR any mandatory criterion failure ($w_r \ge 2.0$ non-compliant).
- **`HIGH`**: $50.0 \le \text{OCS} < 70.0$.
- **`MEDIUM`**: $70.0 \le \text{OCS} < 85.0$.
- **`LOW`**: $\text{OCS} \ge 85.0$.

---

## 5. Cryptographic Reproducibility & Versioning

Every computed score generates an immutable `DeterministicScoreSnapshot`:
- `scoring_engine_version`: e.g. `v1.0.0-deterministic`
- `scoring_configuration_version`: e.g. `v2026.1-standard`
- `assessment_version`: e.g. `v1`
- `calculation_timestamp`: ISO 8601 UTC timestamp
- `input_hash`: SHA-256 digest computed over sorted input tuples:
  $$\text{Input Hash} = \text{SHA-256}\left(\text{JSON}\left(\text{sorted\_evaluations} + \text{config\_version} + \text{engine\_version}\right)\right)$$
