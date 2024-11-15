import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from firebase_admin import initialize_app, auth
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import jwt

from models.login_data import LoginData

# FastAPI app initialization
app = FastAPI()

# Firebase initialization
try:
    initialize_app()
except ValueError:
    pass

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv(dotenv_path='./credentials/.env')
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_jwt_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


@app.post("/login")
async def login(data: LoginData):
    try:
        decoded_token = auth.verify_id_token(data.token,clock_skew_seconds=3)
        email = decoded_token.get("email")
        jwt_token = create_jwt_token(email)
        return {"access_token": jwt_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid Firebase token.")

@app.get("/")
async def read_root():
    return {"message": "If u sent a request to  / , this means the back is working fine."}
