from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    # Option 1: Simple string storage for feeds:
    feeds = db.Column(db.Text, default="")  
    # Option 2: Create a relationship with a Feed model for more structure.
