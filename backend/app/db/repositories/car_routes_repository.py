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
        self.base_url_create = "https://partners.api.skyscanner.net/apiservices/v1/carhire/live/search/create"
        self.base_url_poll = "https://partners.api.skyscanner.net/apiservices/v1/carhire/live/search/poll"

    def get_best_car_route(
        self,
        origin_city: str,
        destination_city: Optional[str],
        pick_up_time: datetime,
        drop_off_time: datetime,
        low_cost: bool,
        best_eco: bool,
        driver_age: int = 30,
    ) -> Optional[dict]:
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }

        # Cuerpo de la solicitud para la API de Skyscanner
        body = {
            "market": "US",  # Mercado
            "locale": "en-US",  # Idioma
            "currency": "USD",  # Moneda
            "pickUpDate": pick_up_time.strftime("%Y-%m-%dT%H:%M:%S"),  # Fecha y hora de recogida
            "dropOffDate": drop_off_time.strftime("%Y-%m-%dT%H:%M:%S"),  # Fecha y hora de devolución
            "pickUpLocation": {"iata": origin_city},  # Ubicación de recogida
            "dropOffLocation": {"iata": destination_city} if destination_city else None,  # Ubicación de devolución
            "driverAge": driver_age  # Edad del conductor
        }

        # Enviar solicitud al endpoint /create
        create_response = requests.post(self.base_url_create, json=body, headers=headers)
        if create_response.status_code != 200:
            raise HTTPException(status_code=create_response.status_code, detail=create_response.text)

        create_data = create_response.json()
        session_token = create_data.get("sessionToken")
        if not session_token:
            raise HTTPException(status_code=500, detail="Failed to create car hire search session.")

        # Enviar solicitud al endpoint /poll
        poll_url = f"{self.base_url_poll}/{session_token}"
        poll_response = requests.post(poll_url, headers=headers)
        if poll_response.status_code != 200:
            raise HTTPException(status_code=poll_response.status_code, detail=poll_response.text)

        poll_data = poll_response.json()
        quotes = poll_data.get("quotes", [])

        if not quotes:
            raise HTTPException(status_code=404, detail="No car hire quotes found matching the criteria")

        # Procesar las cotizaciones y devolver la mejor opción
        best_quote = None
        best_price = float("inf")

        for quote in quotes:
            price_str = quote.get("price", {}).get("amount", "0")
            try:
                price = float(price_str) / 1000
            except ValueError:
                continue

            if low_cost and price < best_price:
                best_price = price
                best_quote = quote

        if not best_quote:
            raise HTTPException(status_code=404, detail="No suitable car hire quote found")

        return {
            "origin": origin_city,
            "destination": destination_city,
            "pick_up_time": pick_up_time,
            "drop_off_time": drop_off_time,
            "price": best_price,
            "vendor": best_quote.get("vendor"),
            "agent": best_quote.get("agent"),
            "car_type": best_quote.get("car", {}).get("type"),
            "seats": best_quote.get("car", {}).get("seats"),
            "doors": best_quote.get("car", {}).get("doors"),
            "transmission": best_quote.get("car", {}).get("transmission"),
            "fuel_type": best_quote.get("car", {}).get("fuel"),
            "deep_link": best_quote.get("deepLink")
        }