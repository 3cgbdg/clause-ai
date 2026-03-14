from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client() -> AsyncClient:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_contract() -> str:
    return (
        "This Lease Agreement is entered into as of January 1, 2026, between Jane Smith "
        "(Landlord) and John Doe (Tenant). The Tenant agrees to rent the property located at "
        "123 Main Street, Dublin, Ireland for a term of 12 months, commencing February 1, 2026. "
        "Monthly rent shall be €1,200, due on the first of each month. "
        "The Tenant shall pay a security deposit of €2,400 prior to move-in. "
        "This agreement shall automatically renew for successive one-year terms unless either "
        "party provides 60 days written notice of termination prior to the end of the term. "
        "The Landlord reserves the right to enter the premises with 24 hours notice. "
        "Pets are not permitted without prior written consent of the Landlord."
    )

@pytest.fixture(autouse=True)
def reset_rate_limiter() -> None:
    from app.rate_limit import limiter
    limiter.reset()
