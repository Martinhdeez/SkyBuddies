import os
from dotenv import load_dotenv

load_dotenv()

def configure_smtp():
    smtp_port = os.getenv("SMTP_PORT")
    
    return {
        "server": os.getenv("SMTP_SERVER"),
        "port": int(smtp_port) if smtp_port and smtp_port.isdigit() else 587,  
        "email": os.getenv("SMTP_EMAIL"),
        "password": os.getenv("SMTP_PASSWORD"),
    }

