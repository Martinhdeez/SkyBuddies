import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))  

class GeminiService: 
    def __init__(self): 
        self.client = client

    def recommend_countries(self, filters: dict) -> list: 
        prompt = self._build_prompt(filters)
        try: 
            response = self.client.models.generate_content(
                model='gemini-2.0-flash',  
                contents=prompt 
            )
            
            if response.text:
                return self._parse_response(response.text)
            else:
                print("Empty response from Gemini.")
                return None
        except Exception as e: 
            print(f"Error generating content: {e}")
            return None
    
    def _build_prompt(self, filters: dict) -> str:
        prompt = "Based on the following filters, recommend 10 countries to visit in order of best match:\n"
        for key, value in filters.items(): 
            prompt += f"- {key}: {value}\n"
        prompt += "\nPlease provide the recommendations in the following format, with a number before each country: "
        prompt += "`1. Spain\n2. Germany\n3. Italy ...` (where each country is preceded by its ranking number, starting from 1)."
        prompt += "\n\nThe countries should be ordered by best match with the filters provided."
        prompt += "\nPlease do not include any other text or explanation, just the list of countries in this exact format."
        prompt += " Do not include any other symbols, like dashes or bullets. Only numbers and country names."
        return prompt

    
    # format: 1. Spain\n2. Germany\n3. Italy...
    def _parse_response(self, response: str) -> list:
        try: 
            response = response.replace("-", "").strip()
            countries = response.split("\n")
            countries = [country.strip() for country in countries if country]  
            countries = [country.split(". ")[1] if ". " in country else country for country in countries]
            
            return countries
        except Exception as e:
            print(f"Error parsing response: {e}")
            return []
