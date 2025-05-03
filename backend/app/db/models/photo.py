from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional

class Photo(BaseModel):
    url: HttpUrl  
    title: Optional[str]  
    source_page: Optional[HttpUrl] 
    scraped_at: datetime  
    tags: Optional[list[str]] = []  