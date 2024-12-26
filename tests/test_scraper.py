import pytest
from src.scraper import StealthScraper
from src.config import SearchCriteria, PropertyType
from src.models import RealEstateListing

@pytest.mark.asyncio
async def test_scraper_initialization():
    scraper = StealthScraper()
    assert scraper is not None

@pytest.mark.asyncio
async def test_search_url_building():
    scraper = StealthScraper()
    criteria = SearchCriteria(
        location="Tallinn",
        property_type=PropertyType.APARTMENT,
        min_price=100000,
        max_price=150000
    )
    url = scraper._build_search_url(criteria)
    assert "Tallinn" in url
    assert "apartment" in url
    assert "100000" in url
    assert "150000" in url

@pytest.mark.asyncio
async def test_random_delay():
    scraper = StealthScraper()
    import time
    start = time.time()
    await scraper._random_delay()
    duration = time.time() - start
    assert 2.0 <= duration <= 5.0