from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class FlyRoute(BaseModel):
    id: Optional[UUID] = Field(default=None, description="Unique identifier for the route")
    origin: str = Field(..., description="Origin city or airport IATA code")
    destination: str = Field(..., description="Destination city or airport IATA code")
    departure_time: datetime = Field(..., description="Departure time of the route")
    arrival_time: datetime = Field(..., description="Arrival time of the route")
    price: float = Field(..., description="Price of the route in USD")
    airline: Optional[str] = Field(None, description="Airline operating the route")
    eco_emissions: Optional[float] = Field(None, description="Eco emissions in kilograms")
    stops: Optional[int] = Field(default=0, description="Number of stops in the route")
    duration_minutes: Optional[int] = Field(default=None, description="Duration of the route in minutes")