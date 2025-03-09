from fastapi import Depends, APIRouter, HTTPException
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy.orm import Session

from models import User, Book
from schemas import UserCreate, BookCreate

user_router = APIRouter(tags=['Users'], prefix='/user')
book_router = APIRouter(tags=['Books'], prefix='/book')


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@user_router.post('/create_user/')
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(username=user.username, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {'Status': 200, "message": f"User '{new_user.username}' was created successfully"}


@user_router.get('/get_all_users/')
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@book_router.get('/get_all_books/')
def get_all_books(db: Session = Depends(get_db)):
    return db.query(Book).all()


@book_router.post('/create_book/')
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(title=book.title, author_id=book.author_id)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return {'Status': 200, "message": f"Book '{new_book.title}' was created successfully"}


@book_router.delete('/delete_book/')
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {'Status': 200, "message": "Book was deleted successfully"}


@book_router.put('/update_book/')
def update_book(book_id: int, new_book: BookCreate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    book.title = new_book.title
    book.author_id = new_book.author_id

    db.commit()
    db.refresh(book)

    return {'Status': 200, "message": "Book was updated successfully"}
