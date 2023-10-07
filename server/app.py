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
from models import User, Movie, Review, Genre

# Views go here!

bcrypt = Bcrypt(app)

secret_key = secrets.token_hex(32)
app.secret_key = secret_key

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


if __name__ == '__main__':
    app.run(port=5555, debug=True)

