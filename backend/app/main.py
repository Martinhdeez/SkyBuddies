from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from routers import auth, users, groups, users_chat

app = FastAPI()

# Configurar CORS para permitir el acceso desde Angular (puerto 4200)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir all
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Permitir todos los encabezados
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/healthz", description="Health check", status_code=200)
async def healthz():
    return JSONResponse(
        content={"status": "OK"},
        status_code=200,
    )

app.include_router(auth.router) 
app.include_router(users.router)
app.include_router(groups.router)
app.include_router(users_chat.router)