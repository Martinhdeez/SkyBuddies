from typing import List
from fastapi import HTTPException
import httpx

class RecommendedPlacesService:
    def __init__(self): 
        self.base_url = "http://api.geonames.org/searchJSON"  

    async def get_recommended_places(self, city: str) -> List[str]:
        params = {
            "q": city,
            "maxRows": 10,  
            "lang": "en",   
            "username": "drako266", 
            "featureCode": "MNMT",  
            "style": "FULL"
        }

        try:
            print("antes AsyncClient")
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params)
            print("despues AsyncClient")
            if (response.status_code == 201 or response.status_code == 200):
                data = response.json()  
                print(data)
                return [place["name"] for place in data.get("geonames", [])]
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error fetching data from Geonames API: {response.text}",
                )
        except Exception as e:
            print(f"Error fetching data from Geonames API: {e}")
            return []