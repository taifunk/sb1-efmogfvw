from supabase import create_client, Client
import os
from loguru import logger
from models import RealEstateListing
from typing import List

class Database:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing Supabase credentials")
        self.client: Client = create_client(url, key)

    async def insert_listings(self, listings: List[RealEstateListing]) -> None:
        """Insert multiple listings into the database."""
        try:
            data = [listing.model_dump() for listing in listings]
            result = await self.client.table("real_estate_listings").insert(data).execute()
            logger.info(f"Successfully inserted {len(listings)} listings")
            return result
        except Exception as e:
            logger.error(f"Error inserting listings: {e}")
            raise