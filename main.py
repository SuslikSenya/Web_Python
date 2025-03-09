from fastapi import FastAPI, Request, Depends
import uvicorn
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from endpoints import user_router, book_router, get_db, get_all_users
from sqlalchemy.orm import Session

from models import User

app = FastAPI(debug=True)

templates = Jinja2Templates(directory="templates")


@app.get('/')
async def read_root(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return templates.TemplateResponse(request, "index.html", {"users": users})


app.include_router(user_router)
app.include_router(book_router)

if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
