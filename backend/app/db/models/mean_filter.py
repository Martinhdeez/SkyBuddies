from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from db.models.travel_filter import TravelFilter

class Climate(BaseModel): 
    warm: Optional[int] = Field(default=0, title="warm")
    cold: Optional[int] = Field(default=0, title="cold")
    tempered: Optional[int] = Field(default=0, title="tempered")
    
    def increase_climate_counter(self, climate_type: str):
        if climate_type == "warm":
            self.warm += 1
        elif climate_type == "cold":
            self.cold += 1
        elif climate_type == "tempered":
            self.tempered += 1
        else:
            raise ValueError("Invalid climate type")
        

class Food(BaseModel): 
    vegetarian: Optional[int] = Field(default=0, title="vegetarian")
    vegan: Optional[int] = Field(default=0, title="vegan")
    gluten_free: Optional[int] = Field(default=0, title="gluten_free")
    lactose_free: Optional[int] = Field(default=0, title="lactose_free")
    italian: Optional[int] = Field(default=0, title="italian")
    mediterranean: Optional[int] = Field(default=0, title="mediterranean")
    japanese: Optional[int] = Field(default=0, title="japanese")
    chinese: Optional[int] = Field(default=0, title="chinese")
    fast_food: Optional[int] = Field(default=0, title="fast_food")
    
    def increase_food_counter(self, food_type: str):
        if food_type == "vegetarian":
            self.vegetarian += 1
        elif food_type == "vegan":
            self.vegan += 1
        elif food_type == "gluten_free":
            self.gluten_free += 1
        elif food_type == "lactose_free":
            self.lactose_free += 1
        elif food_type == "italian":
            self.italian += 1
        elif food_type == "mediterranean":
            self.mediterranean += 1
        elif food_type == "japanese":
            self.japanese += 1
        elif food_type == "chinese":
            self.chinese += 1
        elif food_type == "fast_food":
            self.fast_food += 1
        else:
            raise ValueError("Invalid food type")

class Weather(BaseModel): 
    sunny: Optional[int] = Field(default=0, title="sunny")
    rainy: Optional[int] = Field(default=0, title="rainy")
    snowy: Optional[int] = Field(default=0, title="snowy")
    windy: Optional[int] = Field(default=0, title="windy")
    stormy: Optional[int] = Field(default=0, title="stormy")
    foggy: Optional[int] = Field(default=0, title="foggy")
    cloudy: Optional[int] = Field(default=0, title="cloudy")

    
    def increase_weather_counter(self, weather_type: str):
        if weather_type == "sunny":
            self.sunny += 1
        elif weather_type == "rainy":
            self.rainy += 1
        elif weather_type == "snowy":
            self.snowy += 1
        elif weather_type == "windy":
            self.windy += 1
        elif weather_type == "stormy":
            self.stormy += 1
        elif weather_type == "foggy":
            self.foggy += 1
        elif weather_type == "cloudy":
            self.cloudy += 1
        else:
            raise ValueError("Invalid weather type")

class Activities(BaseModel): 
    hiking: Optional[int] = Field(default=0, title="hiking")
    swimming: Optional[int] = Field(default=0, title="swimming")
    skiing: Optional[int] = Field(default=0, title="skiing")
    surfing: Optional[int] = Field(default=0, title="surfing")
    climbing: Optional[int] = Field(default=0, title="climbing")
    cycling: Optional[int] = Field(default=0, title="cycling")
    running: Optional[int] = Field(default=0, title="running")
    walking: Optional[int] = Field(default=0, title="walking")
    museums: Optional[int] = Field(default=0, title="museums")
    discos: Optional[int] = Field(default=0, title="discos")
    
    
    def increase_activities_counter(self, activity_type: str):
        if activity_type == "hiking":
            self.hiking += 1
        elif activity_type == "swimming":
            self.swimming += 1
        elif activity_type == "skiing":
            self.skiing += 1
        elif activity_type == "surfing":
            self.surfing += 1
        elif activity_type == "climbing":
            self.climbing += 1
        elif activity_type == "cycling":
            self.cycling += 1
        elif activity_type == "running":
            self.running += 1
        elif activity_type == "walking":
            self.walking += 1
        elif activity_type == "museums":
            self.museums += 1
        elif activity_type == "discos":
            self.discos += 1
        else:
            raise ValueError("Invalid activity type")

class Events(BaseModel): 
    concerts: Optional[int] = Field(default=0, title="concerts")
    festivals: Optional[int] = Field(default=0, title="festivals")
    exhibitions: Optional[int] = Field(default=0, title="exhibitions")
    sports_events: Optional[int] = Field(default=0, title="sports_events")
    local_events: Optional[int] = Field(default=0, title="local_events")
    parties: Optional[int] = Field(default=0, title="parties")
    
    def increase_events_counter(self, event_type: str):
        if event_type == "concerts":
            self.concerts += 1
        elif event_type == "festivals":
            self.festivals += 1
        elif event_type == "exhibitions":
            self.exhibitions += 1
        elif event_type == "sports_events":
            self.sports_events += 1
        elif event_type == "local_events":
            self.local_events += 1
        elif event_type == "parties":
            self.parties += 1
        else:
            raise ValueError("Invalid event type")

class Continents(BaseModel): 
    europe: Optional[int] = Field(default=0, title="europe")
    asia: Optional[int] = Field(default=0, title="asia")
    north_america: Optional[int] = Field(default=0, title="north_america")
    south_america: Optional[int] = Field(default=0, title="south_america")
    africa: Optional[int] = Field(default=0, title="africa")
    oceania: Optional[int] = Field(default=0, title="oceania")
    
    def increase_continents_counter(self, continent: str):
        if continent == "europe":
            self.europe += 1
        elif continent == "asia":
            self.asia += 1
        elif continent == "north_america":
            self.north_america += 1
        elif continent == "south_america":
            self.south_america += 1
        elif continent == "africa":
            self.africa += 1
        elif continent == "oceania":
            self.oceania += 1
        else:
            raise ValueError("Invalid continent type")

class Entorno(BaseModel): 
    urban: Optional[int] = Field(default=0, title="urban")
    rural: Optional[int] = Field(default=0, title="rural")
    beach: Optional[int] = Field(default=0, title="beach")
    mountain: Optional[int] = Field(default=0, title="mountain")
    desert: Optional[int] = Field(default=0, title="desert")
    forest: Optional[int] = Field(default=0, title="forest")
    island: Optional[int] = Field(default=0, title="island")
    
    def increase_entorno_counter(self, entorno_type: str):
        if entorno_type == "urban":
            self.urban += 1
        elif entorno_type == "rural":
            self.rural += 1
        elif entorno_type == "beach":
            self.beach += 1
        elif entorno_type == "mountain":
            self.mountain += 1
        elif entorno_type == "desert":
            self.desert += 1
        elif entorno_type == "forest":
            self.forest += 1
        elif entorno_type == "island":
            self.island += 1
        else:
            raise ValueError("Invalid entorno type")

class MeanFilter(BaseModel):
    climate: Optional[Climate] = Field(default=Climate(), title="climate")
    food: Optional[Food] = Field(default=Food(), title="food")
    weather: Optional[Weather] = Field(default=Weather(), title="weather")
    activities: Optional[Activities] = Field(default=Activities(), title="activities")
    events: Optional[Events] = Field(default=Events(), title="events")
    continents: Optional[Continents] = Field(default=Continents(), title="continents")
    entorno: Optional[Entorno] = Field(default=Entorno(), title="entorno")
    low_cost: Optional[int] = Field(default=0, title="low_cost")
    no_low_cost: Optional[int] = Field(default=0, title="no_low_cost")
    eco_travel: Optional[int] = Field(default=0, title="eco_travel")
    no_eco_travel: Optional[int] = Field(default=0, title="no_eco_travel")
    
    
    def increase_low_cost_counter(self):
            self.low_cost += 1
            
    def increase_no_low_cost_counter(self):
            self.no_low_cost += 1
    
    def increase_eco_travel_counter(self):
            self.eco_travel += 1
            
    def increase_no_eco_travel_counter(self):
            self.no_eco_travel += 1
       
    
    def to_travel_filter(self) -> TravelFilter:
        popular_climate = self.__calculate_climate_max()
        popular_food = self.__calculate_food_max()
        popular_weather = self.__calculate_weather_max()
        popular_activities = self.__calculate_activities_max()
        popular_events = self.__calculate_events_max()
        popular_continents = self.__calculate_continents_max()
        popular_entorno = self.__calculate_entorno_max()
   
        
        travel_filter = TravelFilter(user_id="")

        print(f"Popular Climate: {popular_climate}")
        print(f"Popular Food: {popular_food}")
        print(f"Popular Weather: {popular_weather}")
        print(f"Popular Activities: {popular_activities}")
        print(f"Popular Continents: {popular_continents}")
        print(f"Popular Entorno: {popular_entorno}")
        
        travel_filter.low_cost = (self.low_cost >= self.no_low_cost)
        travel_filter.eco_travel = (self.eco_travel >= self.no_eco_travel)
        
        
        if popular_climate == "warm":
            travel_filter.climate.warm = True
        elif popular_climate == "cold":
            travel_filter.climate.cold = True
        elif popular_climate == "tempered":
            travel_filter.climate.tempered = True
 
        if popular_food == "vegetarian":
            travel_filter.food.vegetarian = True
        elif popular_food == "vegan":
            travel_filter.food.vegan = True
        elif popular_food == "gluten_free":
            travel_filter.food.gluten_free = True
        elif popular_food == "lactose_free":
            travel_filter.food.lactose_free = True
        elif popular_food == "italian":
            travel_filter.food.italian = True
        elif popular_food == "mediterranean":
            travel_filter.food.mediterranean = True
        elif popular_food == "japanese":
            travel_filter.food.japanese = True
        elif popular_food == "chinese":
            travel_filter.food.chinese = True
        elif popular_food == "fast_food":
            travel_filter.food.fast_food = True
        if popular_weather == "sunny":
            travel_filter.weather.sunny = True
        elif popular_weather == "rainy":
            travel_filter.weather.rainy = True
        elif popular_weather == "snowy":
            travel_filter.weather.snowy = True
        elif popular_weather == "windy":
            travel_filter.weather.windy = True
        elif popular_weather == "stormy":
            travel_filter.weather.stormy = True
        elif popular_weather == "foggy":
            travel_filter.weather.foggy = True
        elif popular_weather == "cloudy":
            travel_filter.weather.cloudy = True
        if popular_activities == "hiking":
            travel_filter.activities.hiking = True
        elif popular_activities == "swimming":
            travel_filter.activities.swimming = True
        elif popular_activities == "skiing":
            travel_filter.activities.skiing = True
        elif popular_activities == "surfing":
            travel_filter.activities.surfing = True
        elif popular_activities == "climbing":
            travel_filter.activities.climbing = True
        elif popular_activities == "cycling":
            travel_filter.activities.cycling = True
        elif popular_activities == "running":
            travel_filter.activities.running = True
        elif popular_activities == "walking":
            travel_filter.activities.walking = True
        elif popular_activities == "museums":
            travel_filter.activities.museums = True
        elif popular_activities == "discos":
            travel_filter.activities.discos = True
        if popular_events == "concerts":
            travel_filter.events.concerts = True
        elif popular_events == "festivals":
            travel_filter.events.festivals = True
        elif popular_events == "exhibitions":
            travel_filter.events.exhibitions = True
        elif popular_events == "sports_events":
            travel_filter.events.sports_events = True
        elif popular_events == "local_events":
            travel_filter.events.local_events = True
        elif popular_events == "parties":
            travel_filter.events.parties = True
        if popular_continents == "europe":
            travel_filter.continents.europe = True
        elif popular_continents == "asia":
            travel_filter.continents.asia = True
        elif popular_continents == "north_america":
            travel_filter.continents.north_america = True
        elif popular_continents == "south_america":
            travel_filter.continents.south_america = True
        elif popular_continents == "africa":
            travel_filter.continents.africa = True
        elif popular_continents == "oceania":
            travel_filter.continents.oceania = True
        if popular_entorno == "urban":
            travel_filter.entorno.urban = True
        elif popular_entorno == "rural":
            travel_filter.entorno.rural = True
        elif popular_entorno == "beach":
            travel_filter.entorno.beach = True
        elif popular_entorno == "mountain":
            travel_filter.entorno.mountain = True
        elif popular_entorno == "desert":
            travel_filter.entorno.desert = True
        elif popular_entorno == "forest":
            travel_filter.entorno.forest = True
        elif popular_entorno == "island":
            travel_filter.entorno.island = True
        

        print(f"Travel Filter: {travel_filter.model_dump()}")
        return travel_filter

        
    
    def __calculate_climate_max(self):
        max_value = 0  
        for (clim, v) in dict(self.climate).items():
            if v > max_value:
                max_value = v
                popular = clim
        return popular
    
    def __calculate_food_max(self):
        max_value = 0
                    
        for (food, v) in dict(self.food).items():
            if v > max_value:
                max_value = v
                popular = food
        return popular
    
    def __calculate_weather_max(self):
        max_value = 0
                    
        for (weather, v) in dict(self.weather).items():
            if v > max_value:
                max_value = v
                popular = weather
        return popular
    
    def __calculate_activities_max(self):
        max_value = 0
                    
        for (activity, v) in dict(self.activities).items():
            if v > max_value:
                max_value = v
                popular = activity
        return popular
    
    def __calculate_events_max(self):
        max_value = 0
                    
        for (event, v) in dict(self.events).items():
            if v > max_value:
                max_value = v
                popular = event
        return popular
    
    def __calculate_continents_max(self):
        max_value = 0
                    
        for (continent, v) in dict(self.continents).items():
            if v > max_value:
                max_value = v
                popular = continent
        return popular
    
    def __calculate_entorno_max(self):
        max_value = 0
                    
        for (entorno, v) in dict(self.entorno).items():
            if v > max_value:
                max_value = v
                popular = entorno
        return popular
    

    