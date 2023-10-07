from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

user_favorite_genres = Table(
    'user_favorite_genres',
    db.Model.metadata,
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('genre_id', Integer, ForeignKey('genre.id'))
)

user_movies = Table(
    'user_movies',
    db.Model.metadata,
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('movie_id', Integer, ForeignKey('movie.id'))
)

movie_genre_association = Table(
    'movie_genre_association',
    db.Model.metadata,
    Column('movie_id', Integer, ForeignKey('movie.id')),
    Column('genre_id', Integer, ForeignKey('genre.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', backref='user')
    favorite_genres = relationship("Genre", secondary=user_favorite_genres, backref="users")
    rated_movies = relationship("Movie", secondary=user_movies, back_populates="rated_by_users")
    watched_movies = relationship("Movie", secondary=user_movies, viewonly=True, back_populates="watched_by_users")

    def __repr__(self):
        return f'<User {self.username}>'

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    average_rating = db.Column(db.Float, default=0)

    genres = relationship("Genre", secondary=movie_genre_association, backref="movies")
    reviews = db.relationship('Review', backref='movie')

    rated_by_users = relationship("User", secondary=user_movies, back_populates="rated_movies")
    watched_by_users = relationship("User", secondary=user_movies, viewonly=True, back_populates="watched_movies")
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
    name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Genre {self.name}>'