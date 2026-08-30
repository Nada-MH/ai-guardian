import logging
from typing import Dict, Any
from src.llm_client import GroqLLMClient

logger = logging.getLogger("ai_guardian.agents.base")

class BaseAgent:
    """Base class for all specialized AI Guardian compliance agents."""

    def __init__(self, agent_name: str, system_prompt: str):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.llm_client = GroqLLMClient()

    def execute(self, user_prompt: str, model: str = None) -> Dict[str, Any]:
        """Execute agent task via Groq LLM Client."""
        logger.info(f"Executing agent: {self.agent_name}")
        return self.llm_client.generate_json(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            model=model
        )
