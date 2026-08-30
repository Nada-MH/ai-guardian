import os
from pydantic_settings import BaseSettings
from typing import Optional

class AgentConfig(BaseSettings):
    """Configuration settings for Groq LLM API and Agent Orchestration."""

    # Groq API Configuration (Free Tier, 800+ tokens/sec)
    GROQ_API_KEY: Optional[str] = None
    PRIMARY_MODEL: str = "llama-3.3-70b-versatile"
    REASONING_MODEL: str = "deepseek-r1-distill-llama-70b"
    FAST_MODEL: str = "llama-3.1-8b-instant"

    # Fallback Open-Source / Local Provider Configuration
    LLM_PROVIDER: str = "groq"  # "groq" | "ollama" | "openai"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.3:70b"

    # Orchestration Settings
    AGENT_MAX_RETRIES: int = 3
    AGENT_TIMEOUT_SECONDS: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True

agent_config = AgentConfig()
