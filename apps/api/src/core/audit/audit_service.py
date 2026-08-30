"""
AI Guardian — Enterprise Audit Trail Service
Provides tamper-evident, append-only cryptographic audit logging,
AI execution tracking, and human override enforcement.
"""

import sys
import uuid
import hashlib
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Union

# Add database models path
DB_MODELS_PATH = Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"
if str(DB_MODELS_PATH) not in sys.path:
    sys.path.insert(0, str(DB_MODELS_PATH))

from models.audit import AuditEventRecord, AuditEventType, ActorType

logger = logging.getLogger("ai_guardian.audit_service")

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

class AuditTrailService:
    """
    Enterprise-Grade Append-Only Audit Trail Engine.
    Enforces cryptographic SHA-256 hash chaining across all sequential events.
    """

    def __init__(self):
        self._in_memory_ledger: List[Dict[str, Any]] = []
        self._last_event_hash: str = GENESIS_HASH
        self._sequence_counter: int = 0

    @property
    def latest_hash(self) -> str:
        return self._last_event_hash

    @property
    def sequence_count(self) -> int:
        return self._sequence_counter

    def create_secure_reference(self, data: Union[str, Dict[str, Any], bytes]) -> str:
        """
        Creates a secure cryptographic reference (SHA-256 digest) for raw sensitive payloads
        such as borrower PII, raw credit prompts, or private model weights.
        """
        if isinstance(data, dict):
            serialized = json.dumps(data, sort_keys=True, default=str).encode("utf-8")
        elif isinstance(data, str):
            serialized = data.encode("utf-8")
        else:
            serialized = data
        return f"urn:sha256:{hashlib.sha256(serialized).hexdigest()}"

    def compute_event_hash(
        self,
        previous_hash: str,
        sequence_number: int,
        event_type: str,
        actor_name: str,
        system_component: str,
        summary: str,
        project_id: Optional[str] = None,
        assessment_id: Optional[str] = None,
        previous_state: Optional[Dict[str, Any]] = None,
        new_state: Optional[Dict[str, Any]] = None,
        ai_execution_data: Optional[Dict[str, Any]] = None,
        human_override_data: Optional[Dict[str, Any]] = None,
        timestamp: Optional[str] = None
    ) -> str:
        """Calculates canonical SHA-256 hash for an audit record."""
        canonical_dict = {
            "prev_hash": previous_hash,
            "seq": sequence_number,
            "event_type": event_type,
            "actor_name": actor_name,
            "system_component": system_component,
            "project_id": str(project_id) if project_id else None,
            "assessment_id": str(assessment_id) if assessment_id else None,
            "summary": summary,
            "previous_state": previous_state,
            "new_state": new_state,
            "ai_execution_data": ai_execution_data,
            "human_override_data": human_override_data,
            "timestamp": timestamp
        }
        serialized = json.dumps(canonical_dict, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def record_event(
        self,
        event_type: Union[AuditEventType, str],
        actor_name: str,
        actor_type: Union[ActorType, str] = ActorType.USER,
        actor_id: Optional[str] = None,
        system_component: str = "SYSTEM_CORE",
        summary: str = "",
        project_id: Optional[str] = None,
        project_name: Optional[str] = None,
        assessment_id: Optional[str] = None,
        assessment_version: Optional[int] = None,
        previous_state: Optional[Dict[str, Any]] = None,
        new_state: Optional[Dict[str, Any]] = None,
        ai_execution_data: Optional[Dict[str, Any]] = None,
        human_override_data: Optional[Dict[str, Any]] = None,
        severity: str = "INFO",
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Appends an immutable audit event to the ledger with sequential cryptographic hash chaining.
        """
        self._sequence_counter += 1
        seq = self._sequence_counter
        ts = timestamp or datetime.now(timezone.utc).isoformat()

        evt_type_str = event_type.value if isinstance(event_type, AuditEventType) else str(event_type)
        act_type_str = actor_type.value if isinstance(actor_type, ActorType) else str(actor_type)

        event_hash = self.compute_event_hash(
            previous_hash=self._last_event_hash,
            sequence_number=seq,
            event_type=evt_type_str,
            actor_name=actor_name,
            system_component=system_component,
            summary=summary,
            project_id=project_id,
            assessment_id=assessment_id,
            previous_state=previous_state,
            new_state=new_state,
            ai_execution_data=ai_execution_data,
            human_override_data=human_override_data,
            timestamp=ts
        )

        event_dict = {
            "event_id": f"evt-{uuid.uuid4().hex[:12]}",
            "sequence_number": seq,
            "event_type": evt_type_str,
            "severity": severity,
            "system_component": system_component,
            "actor": {
                "actor_id": actor_id or "usr-system",
                "actor_name": actor_name,
                "actor_type": act_type_str,
                "ip_address": ip_address,
                "user_agent": user_agent
            },
            "timestamp": ts,
            "project_id": project_id,
            "project_name": project_name,
            "assessment_id": assessment_id,
            "assessment_version": assessment_version,
            "summary": summary,
            "previous_state": previous_state,
            "new_state": new_state,
            "ai_execution_data": ai_execution_data,
            "human_override_data": human_override_data,
            "event_hash": event_hash,
            "previous_event_hash": self._last_event_hash,
            "chain_verified": True
        }

        self._in_memory_ledger.append(event_dict)
        self._last_event_hash = event_hash

        logger.info(f"Audit event recorded: seq={seq}, type={evt_type_str}, hash={event_hash[:8]}...")
        return event_dict

    def record_ai_execution(
        self,
        agent_name: str,
        agent_version: str,
        model_provider: str,
        model_name: str,
        model_version: str,
        prompt_version: str,
        knowledge_base_version: str,
        input_data: Union[str, Dict[str, Any]],
        output_data: Union[str, Dict[str, Any]],
        retrieval_configuration: Optional[Dict[str, Any]] = None,
        execution_status: str = "SUCCESS",
        project_id: Optional[str] = None,
        project_name: Optional[str] = None,
        assessment_id: Optional[str] = None,
        assessment_version: Optional[int] = None,
        latency_ms: Optional[float] = None,
        token_count: Optional[Dict[str, int]] = None,
        summary: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Records an AI Execution event with secure cryptographic input/output references
        without logging sensitive customer or credit scoring raw data.
        """
        input_ref = self.create_secure_reference(input_data)
        output_ref = self.create_secure_reference(output_data)

        retrieval_cfg = retrieval_configuration or {
            "top_k": 5,
            "similarity_threshold": 0.78,
            "reranking_enabled": True,
            "dense_weight": 0.70
        }

        ai_payload = {
            "agent_name": agent_name,
            "agent_version": agent_version,
            "model_provider": model_provider,
            "model_name": model_name,
            "model_version": model_version,
            "prompt_version": prompt_version,
            "retrieval_configuration": retrieval_cfg,
            "knowledge_base_version": knowledge_base_version,
            "input_reference": input_ref,
            "output_reference": output_ref,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "execution_status": execution_status,
            "latency_ms": latency_ms,
            "token_count": token_count or {"prompt_tokens": 1240, "completion_tokens": 380, "total_tokens": 1620}
        }

        desc = summary or f"{agent_name} ({model_name}) executed compliance evaluation."

        return self.record_event(
            event_type=AuditEventType.AGENT_EXECUTED,
            actor_name=f"Agent: {agent_name}",
            actor_type=ActorType.AGENT,
            actor_id=f"agent-{agent_name.lower().replace(' ', '-')}",
            system_component="AGENT_ORCHESTRATOR",
            summary=desc,
            project_id=project_id,
            project_name=project_name,
            assessment_id=assessment_id,
            assessment_version=assessment_version,
            ai_execution_data=ai_payload,
            severity="INFO"
        )

    def record_human_override(
        self,
        finding_id: str,
        requirement_id: str,
        original_status: str,
        new_status: str,
        reason: str,
        user_name: str,
        user_id: Optional[str] = None,
        user_role: str = "Chief Compliance Officer",
        project_id: Optional[str] = None,
        project_name: Optional[str] = None,
        assessment_id: Optional[str] = None,
        assessment_version: Optional[int] = None,
        external_evidence_id: Optional[str] = None,
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Enforces mandatory human override protocols when a compliance officer
        adjusts an automated AI finding result.
        """
        if not reason or len(reason.strip()) < 10:
            raise ValueError("Human override requires a substantive rationale (min 10 characters).")
        if not user_name:
            raise ValueError("Human override requires an authenticated user identity.")
        if original_status == new_status:
            raise ValueError("New status must differ from the original status in an override event.")

        ts = timestamp or datetime.now(timezone.utc).isoformat()

        override_payload = {
            "finding_id": finding_id,
            "requirement_id": requirement_id,
            "original_status": original_status,
            "new_status": new_status,
            "reason": reason.strip(),
            "user": user_name,
            "user_role": user_role,
            "timestamp": ts,
            "external_evidence_id": external_evidence_id
        }

        prev_state = {"finding_id": finding_id, "status": original_status}
        new_state = {"finding_id": finding_id, "status": new_status, "override_by": user_name}

        summary = f"Human Override: {user_name} ({user_role}) changed {requirement_id} from {original_status} to {new_status}."

        return self.record_event(
            event_type=AuditEventType.HUMAN_OVERRIDE,
            actor_name=user_name,
            actor_type=ActorType.USER,
            actor_id=user_id or "usr-compliance-lead",
            system_component="WEB_UI_REVIEW_PORTAL",
            summary=summary,
            project_id=project_id,
            project_name=project_name,
            assessment_id=assessment_id,
            assessment_version=assessment_version,
            previous_state=prev_state,
            new_state=new_state,
            human_override_data=override_payload,
            severity="HIGH",
            timestamp=ts
        )

    def verify_ledger_integrity(self, ledger: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Cryptographically verifies the append-only hash chain across all events in sequence.
        Detects any unauthorized mutation, deletion, or out-of-order alteration.
        """
        events = ledger if ledger is not None else self._in_memory_ledger
        if not events:
            return {
                "is_valid": True,
                "total_events": 0,
                "verified_hashes": 0,
                "broken_at_sequence": None,
                "error": None
            }

        expected_prev_hash = GENESIS_HASH

        for idx, event in enumerate(events):
            seq = event.get("sequence_number", idx + 1)
            stored_prev_hash = event.get("previous_event_hash")
            stored_hash = event.get("event_hash")

            # 1. Verify previous hash chaining
            if stored_prev_hash != expected_prev_hash:
                return {
                    "is_valid": False,
                    "total_events": len(events),
                    "verified_hashes": idx,
                    "broken_at_sequence": seq,
                    "error": f"Chain link broken at event #{seq}: previous_hash {stored_prev_hash} does not match expected {expected_prev_hash}"
                }

            # 2. Recompute current event hash
            computed_hash = self.compute_event_hash(
                previous_hash=stored_prev_hash,
                sequence_number=seq,
                event_type=event.get("event_type"),
                actor_name=event.get("actor", {}).get("actor_name") if isinstance(event.get("actor"), dict) else str(event.get("actor_name")),
                system_component=event.get("system_component", ""),
                summary=event.get("summary", ""),
                project_id=event.get("project_id"),
                assessment_id=event.get("assessment_id"),
                previous_state=event.get("previous_state"),
                new_state=event.get("new_state"),
                ai_execution_data=event.get("ai_execution_data"),
                human_override_data=event.get("human_override_data"),
                timestamp=event.get("timestamp")
            )

            if computed_hash != stored_hash:
                return {
                    "is_valid": False,
                    "total_events": len(events),
                    "verified_hashes": idx,
                    "broken_at_sequence": seq,
                    "error": f"Payload tamper detected at event #{seq}: computed hash {computed_hash} != stored {stored_hash}"
                }

            expected_prev_hash = stored_hash

        return {
            "is_valid": True,
            "total_events": len(events),
            "verified_hashes": len(events),
            "broken_at_sequence": None,
            "error": None,
            "root_hash": expected_prev_hash
        }

    def get_events(
        self,
        event_type: Optional[str] = None,
        actor_id: Optional[str] = None,
        actor_type: Optional[str] = None,
        project_id: Optional[str] = None,
        assessment_id: Optional[str] = None,
        severity: Optional[str] = None,
        system_component: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Filters in-memory ledger by multi-dimensional audit parameters."""
        filtered = self._in_memory_ledger

        if event_type and event_type != "ALL":
            filtered = [e for e in filtered if e.get("event_type") == event_type]
        if actor_type and actor_type != "ALL":
            filtered = [e for e in filtered if e.get("actor", {}).get("actor_type") == actor_type]
        if actor_id:
            filtered = [e for e in filtered if e.get("actor", {}).get("actor_id") == actor_id]
        if project_id:
            filtered = [e for e in filtered if e.get("project_id") == project_id]
        if assessment_id:
            filtered = [e for e in filtered if e.get("assessment_id") == assessment_id]
        if severity and severity != "ALL":
            filtered = [e for e in filtered if e.get("severity") == severity]
        if system_component and system_component != "ALL":
            filtered = [e for e in filtered if e.get("system_component") == system_component]
        if search_query:
            q = search_query.lower()
            filtered = [
                e for e in filtered
                if q in e.get("summary", "").lower()
                or q in e.get("event_type", "").lower()
                or q in e.get("actor", {}).get("actor_name", "").lower()
                or q in str(e.get("project_name", "")).lower()
            ]

        return filtered


audit_trail_service = AuditTrailService()
