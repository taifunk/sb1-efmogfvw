from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

class RealEstateListing(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source: str  # e.g., "kv.ee", "city24.ee"
    listing_url: str
    price: float
    address: str
    area_m2: float
    rooms: Optional[int] = None
    listing_time: Optional[datetime] = None
    contact_info: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True