#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Movie, Review, Genre

# Views go here!

@app.route('/')
def index():
    return render_template('index.js')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
