from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.user import UserCreate, UserRead
from ..models.user import User
from ..core.security import hash_password, verify_password, create_access_token
from ..db.session import get_db

router = APIRouter()

@router.post("/register", response_model=UserRead)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # check existing
    q = select(User).where(User.email == user_in.email)
    res = await db.execute(q)
    existing = res.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(email=user_in.email, hashed_password=hash_password(user_in.password), full_name=user_in.full_name)
    db.add(user)
    try:
        await db.commit()
    except Exception as exc:
        # handle unique constraint race and other integrity errors
        from sqlalchemy.exc import IntegrityError
        await db.rollback()
        if isinstance(exc, IntegrityError):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        raise
    await db.refresh(user)
    return user

@router.post("/token")
async def login(form_data: UserCreate, db: AsyncSession = Depends(get_db)):
    q = select(User).where(User.email == form_data.email)
    res = await db.execute(q)
    user = res.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer"}
