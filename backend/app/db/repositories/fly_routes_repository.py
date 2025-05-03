from pydantic import BaseModel
import uuid
from typing import List, Optional
from db.repositories.repository import Repository
from db.client import fly_routes_collection
from helpers.dict2model import convert_fly_route_to_model
from datetime import datetime
import requests
from dotenv import load_dotenv
import os       
import time
from fastapi import HTTPException
from helpers.conversor import city_2_iata

load_dotenv()
api_key = os.getenv("API_KEY_SKY")

class FlyRoutesRepository(Repository):
    def __init__(self):
        super().__init__(fly_routes_collection, convert_fly_route_to_model)
        self.base_url = "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create"

    def get_best_fly_route_with_retry(self, origin_city, destination_city, travel_time, low_cost, best_eco, group_members, retries=3):
        for attempt in range(retries):
            try:
                return self.get_best_fly_route(
                    origin_city, destination_city, travel_time, low_cost, best_eco, group_members
                )
            except HTTPException as e:
                if attempt < retries - 1 and "404" in str(e.detail):
                    print(f"Retrying... Attempt {attempt + 1}")
                    time.sleep(1) 
                else:
                    raise HTTPException(status_code=404, detail="No route found matching the criteria") from e

    def get_best_fly_route(
            self,
            origin_city: str,
            destination_city: str,
            travel_time: datetime,
            low_cost: bool,
            best_eco: bool,
            group_members: int) -> Optional[dict]:

        origin_city_iata = city_2_iata(origin_city)
        destination_city_iata = city_2_iata(destination_city)
        print("Origin city IATA code:", origin_city_iata)
        print("Destination city IATA code:", destination_city_iata)
        if not origin_city_iata or not destination_city_iata:
            raise HTTPException(status_code=400, detail="Invalid city name provided.")

        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

        body = {
            "query": {
                "market": "US",
                "locale": "en-US",
                "currency": "USD",
                "query_legs": [
                    {
                        "origin_place_id": {"iata": origin_city_iata},
                        "destination_place_id": {"iata": destination_city_iata},
                        "date": {"year": travel_time.year, "month": travel_time.month, "day": travel_time.day}
                    }
                ],
                "cabin_class": "CABIN_CLASS_ECONOMY",
                "adults": group_members if group_members > 0 else 1,
            }
        }

        response = requests.post(self.base_url, json=body, headers=headers)
        
        if response.status_code != 200:
            print(f"Error: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail=response.text)

        data = response.json()
        itineraries = data.get("content", {}).get("results", {}).get("itineraries", {})

        if not itineraries:
            print("No itineraries found in the API response.")
            raise HTTPException(status_code=404, detail="No route found matching the criteria")

        best_itinerary = None
        best_score = float("inf")

        for itinerary_id, itinerary in itineraries.items():
            pricing_options = itinerary.get("pricingOptions", [])
            eco_emissions = itinerary.get("ecoContenderDelta", {}).get("emissionsKg", 0)

            if not pricing_options:
                print(f"No pricing options for itinerary {itinerary_id}. Skipping.")
                continue

            price_str = pricing_options[0].get("price", {}).get("amount", "0")
            try:
                price = float(price_str) / 1000  
            except ValueError:
                print(f"Invalid price format for itinerary {itinerary_id}: {price_str}")
                continue

            score = 0
            if low_cost:
                score += price
            if best_eco:
                score += eco_emissions  

            if score < best_score:
                best_score = score
                best_itinerary = {
                    "origin": origin_city_iata,
                    "destination": destination_city_iata,
                    "price": price,
                    "emissionsKg": eco_emissions,
                    "details": itinerary
                }

        if not best_itinerary:
            print("No valid itinerary found after processing.")
            if itineraries:
                best_itinerary = {
                    "origin": origin_city_iata,
                    "destination": destination_city_iata,
                    "price": None,
                    "emissionsKg": None,
                    "details": next(iter(itineraries.values()))
                }
                print("Fallback to the first available itinerary:", best_itinerary)
            else:
                raise HTTPException(status_code=404, detail="No route found matching the criteria")
        else:
            print("Best itinerary found:", best_itinerary)

        return best_itinerary