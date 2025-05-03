from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class CarRoute(BaseModel):
    id: Optional[UUID] = Field(default=None, description="Unique identifier for the car hire route")
    origin: str = Field(..., description="Pick-up city or location IATA code")
    destination: Optional[str] = Field(None, description="Drop-off city or location IATA code (optional if same as origin)")
    pick_up_time: datetime = Field(..., description="Pick-up time for the car hire")
    drop_off_time: datetime = Field(..., description="Drop-off time for the car hire")
    price: float = Field(..., description="Price of the car hire in USD")
    vendor: Optional[str] = Field(None, description="Vendor providing the car hire (e.g., Hertz, Avis)")
    agent: Optional[str] = Field(None, description="Agent providing the car hire quote")
    car_type: Optional[str] = Field(None, description="Type of car (e.g., SUV, Sedan, etc.)")
    seats: Optional[int] = Field(default=None, description="Number of seats in the car")
    doors: Optional[int] = Field(default=None, description="Number of doors in the car")
    transmission: Optional[str] = Field(None, description="Transmission type (e.g., Automatic, Manual)")
    fuel_type: Optional[str] = Field(None, description="Fuel type (e.g., Petrol, Diesel, Electric)")
    deep_link: Optional[str] = Field(None, description="Deep link to book the car hire")

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "origin": "MIA",
                "destination": "MIA",
                "pick_up_time": "2025-12-15T10:00:00",
                "drop_off_time": "2025-12-20T10:00:00",
                "price": 150.0,
                "vendor": "Hertz",
                "agent": "Skyscanner",
                "car_type": "SUV",
                "seats": 5,
                "doors": 4,
                "transmission": "Automatic",
                "fuel_type": "Petrol",
                "deep_link": "https://www.skyscanner.com/carhire/booking-link"
            }
        }