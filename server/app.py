#!/usr/bin/env python3

# Standard library imports
import secrets

# Remote library imports
from flask import request, jsonify, session, redirect
from flask_restful import Resource
from flask_bcrypt import Bcrypt

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Movie, Review, Genre, movie_genre_association

# Views go here!

bcrypt = Bcrypt(app)

secret_key = secrets.token_hex(32)
app.secret_key = secret_key

def is_email_available(email):
    existing_user = User.query.filter_by(email=email).first()
    return existing_user is None

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(username=username, email=email, password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(message='Registration successful'), 201

@app.route('/api/check-username', methods=['POST'])
def check_username():
    data = request.get_json()
    username = data.get('username')

    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify({'message': 'Username already in use'}), 409
    else:
        return jsonify({'message': 'Username is available'}), 200

@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    if is_email_available(email):
        return jsonify({'message': 'Email is available'}), 200
    else:
        return jsonify({'message': 'Email is already in use'}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Login failed'}), 401
    
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify(message='Logout successful'), 200

@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = (
            Movie.query
            .join(movie_genre_association)
            .join(Genre)
            .all()
    )
    movie_data = []
    loggedInUserId = session.get('user_id')

    for movie in movies:
        reviews = Review.query.filter_by(movie_id=movie.id).all()
        review_data = []

        for review in reviews:
            user = User.query.get(review.user_id)
            if user:
                review_info = {
                    'id': review.id,
                    'text': review.text,
                    'rating': review.rating,
                    'user': {
                        'id': user.id,
                        'username': user.username
                    }
                }
                review_data.append(review_info)

        movie_info = {
            'id': movie.id,
            'title': movie.title,
            'reviews': review_data,
            'genres': [genre.name for genre in movie.genres]
        }
        movie_data.append(movie_info)

    return jsonify({'movies': movie_data, 'loggedInUserId': loggedInUserId})

@app.route('/api/movies/<int:movie_id>/add-review', methods=['POST'])
def add_review(movie_id):
    if 'user_id' not in session:
        return jsonify({'message': 'You must be logged in to add a review'}), 401

    user_id = session['user_id']

    data = request.get_json()
    review_text = data.get('text')
    review_rating = data.get('rating')

    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({'message': 'Movie not found'}), 404
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    new_review = Review(text=review_text, rating=review_rating, user_id=user_id, movie_id=movie_id)

    db.session.add(new_review)
    db.session.commit()

    response_data = {
        'message': 'Review added successfully',
        'review': {
            'id': new_review.id,
            'text': new_review.text,
            'rating': new_review.rating,
            'user': {
                'id': user.id,
                'username': user.username
            }
        }
    }

    return jsonify(response_data), 201

@app.route('/api/reviews/<int:review_id>', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def review_details(review_id):
    review = Review.query.get(review_id)

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if request.method == 'GET':

        if review.user_id != session.get('user_id'):
            return jsonify({'message': 'You are not authorized to view this review'}), 403

        review_info = {
            'id': review.id,
            'text': review.text,
            'rating': review.rating,
        }

        return jsonify(review_info)

    elif request.method == 'PATCH':

        if review.user_id != session.get('user_id'):
            return jsonify({'message': 'You are not authorized to edit this review'}), 403

        data = request.get_json()
        updated_text = data.get('text')
        updated_rating = data.get('rating')

        review.text = updated_text
        review.rating = updated_rating

        db.session.commit()

        return jsonify({'message': 'Review updated successfully'}), 200

    elif request.method == 'DELETE':

        if review.user_id != session.get('user_id'):
            return jsonify({'message': 'You are not authorized to delete this review'}), 403

        db.session.delete(review)
        db.session.commit()

        return jsonify({'message': 'Review deleted successfully'}), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)

