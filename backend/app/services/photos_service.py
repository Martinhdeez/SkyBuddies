from db.models.photo import Photo
from datetime import datetime
from serpapi import GoogleSearch
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("SERPAPI_API_KEY")

class PhotosService:
    def __init__(self):
        pass

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
            print("API Response:", results)  
            images = results.get("images_results", [])
            
            if not images:
                raise ValueError("No images found for the specified monument.")

            first_image = images[0]
            image_url = first_image.get("original") or first_image.get("thumbnail")
            source_page = first_image.get("link")  
            title = first_image.get("title")  

            if not image_url:
                raise ValueError("No valid image URL found.")

            return Photo(
                url=image_url,
                title=title or f"Image of {monument}",
                source_page=source_page or "Unknown source",
                scraped_at=datetime.now()
            )

        except Exception as e:
            print(f"Error retrieving photo: {e}")
            raise ValueError(f"Internal server error: {e}")