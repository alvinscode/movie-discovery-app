from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', backref='user')
    favorite_genres = db.relationship('Genre', backref='users')

    def __repr__(self):
        return f'<User {self.username}>'
    
class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    average_rating = db.Column(db.Float, default=0)

    users = db.relationship('User', backref='movies')
    genres = db.relationship('Genre', backref='movies')
    reviews = db.relationship('Review', backref='movie')

    def __repr__(self):
        return f'<Movie {self.title}>'
    
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)

    def __repr__(self):
        return f'<Review by {self.user_id} for {self.movie_id}>'
    
class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    def __repr__(self):
        return f'<Genre {self.name}>'