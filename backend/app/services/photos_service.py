import requests
from bs4 import BeautifulSoup
from db.models.photo import Photo
from datetime import datetime

class PhotosService:
    def __init__(self):
        self.search_engine_url = "https://www.google.com/search"  
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def get_photos(self, monument: str) -> list[Photo]:
        params = {
            "q": f"{monument} tourist",
            "tbm": "isch"  
        }

        try:
            response = requests.get(self.search_engine_url, headers=self.headers, params=params)
            response.raise_for_status()  

            soup = BeautifulSoup(response.text, "html.parser")
            image_elements = soup.find_all("img")  

            photos = []
            for img in image_elements[:10]:  
                img_url = img.get("src")
                if img_url:
                    photo = Photo(
                        url=img_url,
                        title=f"Image of {monument}",
                        source_page=response.url,
                        scraped_at=datetime.now()
                    )
                    photos.append(photo)

            return photos

        except Exception as e:
            print(f"Error during web scraping: {e}")
            return []