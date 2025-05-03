from db.models.photo import Photo
from datetime import datetime
from serpapi import GoogleSearch
from dotenv import load_dotenv
import os
from pathlib import Path


dotenv_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path)
api_key = os.getenv("SERPAPI_API_KEY")

class PhotosService:
    def __init__(self):
        print(f"Loaded API key: {api_key}")


    def get_photo(self, monument: str) -> Photo:
        params = {
            "q": monument,
            "tbm": "isch",
            "hl": "en",
            "gl": "us",  
            "engine": "google_images",
            "api_key": api_key
        }

        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            print(results)
            images = results.get("images_results", [])
            
            if not images:
                raise ValueError("No images found for the monument.")

            first_image = images[0]
            image_url = first_image.get("original") or first_image.get("thumbnail")

            if not image_url:
                raise ValueError("No valid image URL found.")

            return Photo(
                url=image_url,
                monument=monument,
                created_at=datetime.utcnow()
            )

        except Exception as e:
            print(f"Error retrieving photo: {e}")
            return None