import enum
from typing import List, TYPE_CHECKING
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.user import User
    from models.ai_system import AISystem
    from models.audit import AuditLog

class SectorType(str, enum.Enum):
    BANK = "bank"
    FINTECH = "fintech"
    INSURANCE = "insurance"
    INVESTMENT = "investment"
    PAYMENTS = "payments"

class Organization(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sector_type: Mapped[SectorType] = mapped_column(
        Enum(SectorType, name="sector_type_enum"),
        nullable=False,
        default=SectorType.BANK
    )
    jurisdiction: Mapped[str] = mapped_column(String(100), default="KSA", nullable=False)

    # Relationships
    users: Mapped[List["User"]] = relationship(
        "User", back_populates="organization", cascade="all, delete-orphan"
    )
    ai_systems: Mapped[List["AISystem"]] = relationship(
        "AISystem", back_populates="organization", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        "AuditLog", back_populates="organization"
    )

    def __repr__(self) -> str:
        return f"<Organization(id={self.id}, name='{self.name}', sector='{self.sector_type}')>"
