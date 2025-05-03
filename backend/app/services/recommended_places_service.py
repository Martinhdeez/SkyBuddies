from typing import List
import httpx

class RecommendedPlacesService:
    def __init__(self): 
        self.base_url = "http://api.geonames.org/searchJSON"  

    async def get_recommended_places(self, city: str) -> List[str]:
        params = {
            "q": city,
            "maxRows": 10,  
            "lang": "es",   
            "username": "drako266", 
            "featureCode": "MT",  
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params)
            
            if response.status_code == 200:
                data = response.json()  
                return [place["name"] for place in data.get("geonames", [])]
            else:
                return []
        except Exception as e:
            print(f"Error fetching data from Geonames API: {e}")
            return []