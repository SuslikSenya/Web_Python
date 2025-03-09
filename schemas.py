from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    role: str


class BookCreate(BaseModel):
    title: str
    author_id: int = 1
