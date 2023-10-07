#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Movie, Genre, User, Review

def create_or_get_genre(genre_name):
    existing_genre = Genre.query.filter_by(name=genre_name).first()

    if existing_genre:
        return existing_genre
    else:
        new_genre = Genre(name=genre_name)
        db.session.add(new_genre)
        db.session.commit()
        return new_genre

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        action_genre = create_or_get_genre('Action')
        drama_genre = create_or_get_genre('Drama')
        comedy_genre = create_or_get_genre('Comedy')

        movies = []
        for _ in range(10):
            title = fake.catch_phrase()
            release_year = fake.year()
            description = fake.paragraph()
            movie = Movie(title=title, release_year=release_year, description=description)
            movie.genres.append(rc([action_genre, comedy_genre, drama_genre]))
            movies.append(movie)

        db.session.add_all(movies)
        db.session.commit()

        users = []
        reviews = []

        for _ in range(5):
            username = fake.user_name()
            email = fake.email()
            password_hash = 'hashed_password'

            user = User(username=username, email=email, password_hash=password_hash)
            users.append(user)

            review_text = fake.paragraph()
            rating = fake.pydecimal(min_value=1, max_value=5, right_digits=1)
            movie = rc(movies)

            review = Review(text=review_text, rating=rating, user=user, movie=movie)
            reviews.append(review)

        db.session.add_all(users + reviews)
        db.session.commit()

        print("Seed complete.")
