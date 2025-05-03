from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class Climate(BaseModel): 
    warm: Optional[bool] = Field(default=False, title="warm")
    cold: Optional[bool] = Field(default=False, title="cold")
    tempered: Optional[bool] = Field(default=False, title="tempered")

class Food(BaseModel): 
    vegetarian: Optional[bool] = Field(default=False, title="vegetarian")
    vegan: Optional[bool] = Field(default=False, title="vegan")
    gluten_free: Optional[bool] = Field(default=False, title="gluten_free")
    lactose_free: Optional[bool] = Field(default=False, title="lactose_free")
    italian: Optional[bool] = Field(default=False, title="italian")
    mediterranean: Optional[bool] = Field(default=False, title="mediterranean")
    japanese: Optional[bool] = Field(default=False, title="japanese")
    chinese: Optional[bool] = Field(default=False, title="chinese")
    fast_food: Optional[bool] = Field(default=False, title="fast_food")

class Weather(BaseModel): 
    sunny: Optional[bool] = Field(default=False, title="sunny")
    rainy: Optional[bool] = Field(default=False, title="rainy")
    snowy: Optional[bool] = Field(default=False, title="snowy")
    windy: Optional[bool] = Field(default=False, title="windy")
    stormy: Optional[bool] = Field(default=False, title="stormy")
    foggy: Optional[bool] = Field(default=False, title="foggy")
    cloudy: Optional[bool] = Field(default=False, title="cloudy")
    stormy: Optional[bool] = Field(default=False, title="stormy")

class Activities(BaseModel): 
    hiking: Optional[bool] = Field(default=False, title="hiking")
    swimming: Optional[bool] = Field(default=False, title="swimming")
    skiing: Optional[bool] = Field(default=False, title="skiing")
    surfing: Optional[bool] = Field(default=False, title="surfing")
    climbing: Optional[bool] = Field(default=False, title="climbing")
    cycling: Optional[bool] = Field(default=False, title="cycling")
    running: Optional[bool] = Field(default=False, title="running")
    walking: Optional[bool] = Field(default=False, title="walking")
    museums: Optional[bool] = Field(default=False, title="museums")
    discos: Optional[bool] = Field(default=False, title="discos")

class Events(BaseModel): 
    concerts: Optional[bool] = Field(default=False, title="concerts")
    festivals: Optional[bool] = Field(default=False, title="festivals")
    exhibitions: Optional[bool] = Field(default=False, title="exhibitions")
    sports_events: Optional[bool] = Field(default=False, title="sports_events")
    local_events: Optional[bool] = Field(default=False, title="local_events")
    parties: Optional[bool] = Field(default=False, title="parties")

class Continents(BaseModel): 
    europe: Optional[bool] = Field(default=False, title="europe")
    asia: Optional[bool] = Field(default=False, title="asia")
    north_america: Optional[bool] = Field(default=False, title="north_america")
    south_america: Optional[bool] = Field(default=False, title="south_america")
    africa: Optional[bool] = Field(default=False, title="africa")
    oceania: Optional[bool] = Field(default=False, title="oceania")

class Entorno(BaseModel): 
    urban: Optional[bool] = Field(default=False, title="urban")
    rural: Optional[bool] = Field(default=False, title="rural")
    beach: Optional[bool] = Field(default=False, title="beach")
    mountain: Optional[bool] = Field(default=False, title="mountain")
    desert: Optional[bool] = Field(default=False, title="desert")
    forest: Optional[bool] = Field(default=False, title="forest")
    island: Optional[bool] = Field(default=False, title="island")

class TravelFilter(BaseModel):
    id: Optional[str] = Field(default=None, title="id")
    climate: Optional[Climate] = Field(default=None, title="climate")
    food: Optional[Food] = Field(default=None, title="food")
    weather: Optional[Weather] = Field(default=None, title="weather")
    activities: Optional[Activities] = Field(default=None, title="activities")
    events: Optional[Events] = Field(default=None, title="events")
    continents: Optional[Continents] = Field(default=None, title="continents")
    entorno: Optional[Entorno] = Field(default=None, title="entorno")
    city: Optional[str] = Field(default=None, title="city")
    updated_at: datetime = Field(default=datetime.now(), title="updated_at")
    created_at: datetime = Field(default=datetime.now(), title="created_at")

    class Config:
        from_attributes = True