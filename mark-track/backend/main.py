import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import initialize_app
from models.user import User, UserRegister
from dotenv import load_dotenv
import jwt

#fast api initialization
app = FastAPI()

#firebase initialization
try:
    initialize_app()
except ValueError:
    pass

@app.get("/")
async def read_root():
    return {"message": "Hello World"}


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT settings
load_dotenv(dotenv_path='./credentials/.env')
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_jwt_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

#register and login routes
@app.post("/register", response_model=User)
async def register(user_data: UserRegister):
    try:
        user = User.create_user(email=user_data.email, password=user_data.password)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login")
async def login(user_data: UserRegister):
    try:
        user = User.verify_user(email=user_data.email, password=user_data.password)
        token = create_jwt_token(user.email)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))