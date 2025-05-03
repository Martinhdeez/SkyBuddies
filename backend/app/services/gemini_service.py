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
                return response.text
            else:
                print("Empty response from Gemini.")
                return None
        except Exception as e: 
            print(f"Error generating content: {e}")
            return None
    
    def _build_prompt(self, filters: dict) -> str:
        prompt = "Based on the following filters, recommend 10 countries to visit in order of best match:"
        for key, value in filters.items(): 
            prompt += f"\n- {key}: {value}"
        prompt += "\n\nPlease provide the recommendations only in a list format exactly "
        "like this: ['Spain', 'Germany', 'Italy', ...] (without any other message)."
        "In the list, the firsts countries should be the best match."
        prompt += "\n\nPlease do not include any other text or explanation, just the list of countries. (don't include \n)"
        prompt += "The match should be based on the filters provided."
        return prompt