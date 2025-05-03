from pydantic import BaseModel
import uuid
from typing import List, Optional
from db.repositories.repository import Repository
from db.client import car_routes_collection
from helpers.dict2model import convert_car_route_to_model
from datetime import datetime
import requests
from dotenv import load_dotenv
import os
from fastapi import HTTPException

load_dotenv()
api_key = os.getenv("API_KEY_SKY")

class CarRoutesRepository(Repository):
    def __init__(self):
        super().__init__(car_routes_collection, convert_car_route_to_model)
        self.base_url_create = "https://partners.api.skyscanner.net/apiservices/v1/carhire/indicative/search"

    def get_best_car_route(
        self,
        market: str,
        locale: str,
        currency: str,
        pick_up_time: datetime,
        drop_off_time: datetime,
        pick_up_location: str,
        driver_age: int,
        low_cost: bool,
        best_eco: bool,
        drop_off_location: Optional[str] = None
    ) -> Optional[dict]:
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

        body = {
            "market": market, 
            "locale": locale,
            "currency": currency,  
            "pickUpDropOffLocation": pick_up_location
        }

       
        try:
            response = requests.post(self.base_url_search, json=body, headers=headers)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)

            data = response.json()
            quotes = data.get("quotes", [])

            if not quotes:
                raise HTTPException(status_code=404, detail="No car hire quotes found matching the criteria")


            best_quote = None
            best_score = float("inf")  

            for quote in quotes:
                price = quote.get("price", {}).get("amount", 0)
                emissions = quote.get("eco", {}).get("emissionsKg", 0)  
                score = 0
                if low_cost:
                    score += price
                if best_eco:
                    score += emissions

                if score < best_score:
                    best_score = score
                    best_quote = quote

            if not best_quote:
                raise HTTPException(status_code=404, detail="No suitable car hire quote found")

            return {
                "pick_up_location": pick_up_location,
                "drop_off_location": drop_off_location if drop_off_location else pick_up_location,
                "pick_up_time": pick_up_time,
                "drop_off_time": drop_off_time,
                "price": best_quote.get("price", {}).get("amount", 0),
                "vendor": best_quote.get("vendor"),
                "car_type": best_quote.get("car", {}).get("type"),
                "seats": best_quote.get("car", {}).get("seats"),
                "doors": best_quote.get("car", {}).get("doors"),
                "transmission": best_quote.get("car", {}).get("transmission"),
                "fuel_type": best_quote.get("car", {}).get("fuel"),
                "eco_emissions": best_quote.get("eco", {}).get("emissionsKg", 0),
                "deep_link": best_quote.get("deepLink")
            }

        except Exception as e:
            print(f"Error fetching car hire quotes: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")