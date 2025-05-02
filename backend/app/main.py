from fastapi import FastAPI
from starlette.responses import JSONResponse
from routers import auth, users

app = FastAPI()

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
