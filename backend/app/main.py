from fastapi import FastAPI
from starlette.responses import JSONResponse

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

