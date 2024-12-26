from pydantic import BaseModel
from typing import Optional
from enum import Enum

class PropertyType(str, Enum):
    APARTMENT = "apartment"
    HOUSE = "house"
    LAND = "land"

class SearchCriteria(BaseModel):
    location: str
    property_type: PropertyType
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_rooms: Optional[int] = None
    max_rooms: Optional[int] = None

class Config:
    # Scraping configuration
    MIN_DELAY: float = 2.0  # Minimum delay between requests
    MAX_DELAY: float = 5.0  # Maximum delay between requests
    RETRY_ATTEMPTS: int = 3
    RETRY_DELAY: int = 5
    
    # Default search parameters
    DEFAULT_SEARCH = SearchCriteria(
        location="Tallinn",
        property_type=PropertyType.APARTMENT,
        min_price=100000,
        max_price=150000,
        min_rooms=2,
        max_rooms=2
    )

    # URLs
    KV_EE_BASE_URL = "https://www.kv.ee/"
    
    # Database table name
    LISTINGS_TABLE = "real_estate_listings"