import streamlit as st
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import IntegrityError
import bcrypt
import jwt
import uuid
from datetime import datetime, timedelta

# Load secrets with local fallback
try:
    DATABASE_URL = st.secrets["DATABASE_URL"]
    JWT_SECRET = st.secrets.get("JWT_SECRET", "fallback-secret-for-dev")
except Exception:
    DATABASE_URL = "sqlite:///netenpoche.db"
    JWT_SECRET = "fallback-secret-for-dev"

# Convert postgres:// to postgresql:// for SQLAlchemy compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_pro = Column(Boolean, default=False, nullable=False) # Legacy compatibility
    tier = Column(String, default='gratuit', nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True)
    session_token = Column(String, nullable=True) # Legacy storage, replaced functionally by stateless JWTs
    data_json = Column(Text, default="{}")

@st.cache_resource
def get_engine():
    # Streamlit cache ensures we don't open 1000 Postgres connections on reload
    return create_engine(DATABASE_URL, pool_pre_ping=True)

def get_session():
    engine = get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()

def init_db():
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Fallback for old SHA256 hashes during migration if they don't start with bcrypt identifier
        if not hashed_password.startswith('$2b$'):
            import hashlib
            return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        return False

def generate_jwt_for_user(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=30) # 30 days expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def create_user(email, password):
    db = get_session()
    verification_token = uuid.uuid4().hex
    hashed_pw = hash_password(password)
    
    new_user = User(
        email=email,
        password_hash=hashed_pw,
        verification_token=verification_token,
        is_verified=False
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return True, verification_token
    except IntegrityError:
        db.rollback()
        return False, "Cet email est déjà utilisé."
    finally:
        db.close()

def verify_user(email, password):
    db = get_session()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and verify_password(password, user.password_hash):
            if not user.is_verified:
                return False, "Veuillez d'abord vérifier votre email en cliquant sur le lien reçu."
            return True, {"id": user.id, "tier": user.tier, "email": user.email}
        return False, "Email ou mot de passe incorrect."
    finally:
        db.close()

def verify_account_token(token):
    if not token:
        return False, "Lien invalide."
    db = get_session()
    try:
        user = db.query(User).filter(User.verification_token == token).first()
        if user:
            user.is_verified = True
            user.verification_token = None
            db.commit()
            return True, "Email vérifié avec succès ! Vous pouvez maintenant vous connecter."
        return False, "Ce lien de vérification est invalide ou expiré."
    finally:
        db.close()

def set_user_tier(user_id, tier='pro'):
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.tier = tier
            db.commit()
    finally:
        db.close()

def get_user_tier(user_id):
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return user.tier
        return 'gratuit'
    finally:
        db.close()

def update_session_token(user_id, token):
    # Backward compatibility stub, although JWTs don't strictly need DB storage
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.session_token = token
            db.commit()
    finally:
        db.close()

def get_user_by_token(token):
    if not token:
        return None
    
    # Check if token is a JWT
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, KeyError):
        # Fallback to old random string DB lookup for unmigrated sessions
        db = get_session()
        try:
            user = db.query(User).filter(User.session_token == token).first()
            if user:
                return {"id": user.id, "tier": user.tier, "email": user.email}
            return None
        finally:
            db.close()
            
    # Valid JWT -> Look up user
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return {"id": user.id, "tier": user.tier, "email": user.email}
        return None
    finally:
        db.close()

def save_user_data(user_id, data_json):
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.data_json = data_json
            db.commit()
    finally:
        db.close()

def get_user_data(user_id):
    db = get_session()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return user.data_json
        return None
    finally:
        db.close()

# Initialize on import
init_db()
