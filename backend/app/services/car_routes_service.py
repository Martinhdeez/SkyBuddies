from typing import Optional
from db.models.car_route import CarRoute
from db.repositories.car_routes_repository import CarRoutesRepository
from datetime import datetime

class CarRoutesService: 
    def __init__(self): 
        self.car_routes_repository = CarRoutesRepository()
    
    async def get_best_car_route(
        self,
        origin_city: str,
        destination_city: Optional[str],
        pick_up_time: datetime,
        drop_off_time: datetime,
        low_cost: bool,
        best_eco: bool = False,
        driver_age: int = 30
    ) -> Optional[CarRoute]:
        
        try:
            best_route_data = self.car_routes_repository.get_best_car_route(
                origin_city=origin_city,
                destination_city=destination_city,
                pick_up_time=pick_up_time,
                drop_off_time=drop_off_time,
                low_cost=low_cost,
                best_eco=best_eco,
                driver_age=driver_age
            )

            if not best_route_data:
                return None

            return CarRoute(**best_route_data)

        except Exception as e:
            print(f"Error fetching best car route: {e}")
            return None