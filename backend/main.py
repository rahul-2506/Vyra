from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import chat, weather, health, diagnosis, voice, memory, profile
from config.settings import settings
from services.db_service import init_db

app = FastAPI(title="Vyra API")

@app.on_event("startup")
async def startup_event():
    try:
        init_db()
        print("[Vyra] SQLite database initialized successfully")
    except Exception as e:
        print(f"[Vyra] Failed to initialize DB: {e}")
        
    if settings.GROQ_API_KEY:
        print("[Vyra] Groq configured successfully")
    else:
        print("[Vyra] GROQ_API_KEY missing")

# Enable CORS for localhost frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router, tags=["Chat"])
app.include_router(weather.router, tags=["Weather"])
app.include_router(health.router, tags=["Health"])
app.include_router(diagnosis.router, tags=["Diagnosis"])
app.include_router(voice.router, tags=["Voice"])
app.include_router(memory.router, tags=["Memory"])
app.include_router(profile.router, tags=["Profile"])

@app.get("/")
async def root():
    return {"message": "Welcome to Vyra API. Use /chat, /weather, /health, /crop-diagnosis, /voice-query, /farm-history, /daily-briefing, or /dashboard-summary endpoints."}