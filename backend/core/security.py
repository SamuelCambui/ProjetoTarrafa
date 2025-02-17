from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from backend.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRATION_TIME = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRATION_TIME = timedelta(days=1)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def generate_jwt_token(payload: dict, time: timedelta):
    expiration = datetime.now(timezone.utc) + time
    payload.update({"exp": expiration})

    access_token = jwt.encode(claims=payload, key=settings.JWT_SECRET_KEY, algorithm="HS256")
    return access_token

def decode_jwt_token(token: str):
    payload = jwt.decode(token=token, key=settings.JWT_SECRET_KEY, algorithms="HS256")
    return payload