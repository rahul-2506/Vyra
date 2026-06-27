import os
import sys

# Add backend directory to sys.path so it can find modules like routes, config, services
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Export the FastAPI app so Vercel can find it
from backend.main import app
