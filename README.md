# Movie Discovery App

This application is made to mainly serve as a place where people can collaborate
and share their favorite movies and what they think of them. It was made with
simplicity in mind so that it can be very adaptable for many uses. This app
was made with movies in mind, but it can easily be a place where books, games,
or even music is reviewed. Simply create an account and post your favorite
movie and write a review about it, or it is still possible to read and view
the reviews of others without making an account.

## Installation

```bash
# Clone the repository
git clone git@github.com:alvinscode/movie-discovery-app.git

# Navigate to the project directory
cd movie-discovery-app

# Install dependencies for backend server
pipenv install
pipenv shell

# Run backend server:
python server/app.py

# Install dependencies for the frontend client
npm install --prefix client

# Run React app
npm start --prefix client
```

## Important Files

- Home.js would be the most important file in this project, as the majority
of the app is based here. The user will be able to view a list of all movies
in the database, leave and edit reviews. The review functionality of this app
is the most sophisticated, as it allows the user to create, read, update, and
delete reviews that they have posted.

- NavBar.js will handle the logging in and out of the user, with a link a
login form built into the NavBar itself. Inside the login form will be a
link to the register form, which will only be available to access if the
user has not logged in.

- Once logged in, the last two important forms are AddMovie.js and EditMovie.js.
AddMovie.js will allow the user to add additional movies to the movie database,
and EditMovie.js will allow the user to delete movies from the database.

- app.py will handle all the backend routes for the app. The communication from
frontend to backend is all done here, from registering a username,logging in, 
to posting a review. 

## Usage

This application consists of a homepage, which contains a list of movies (they 
are randomly generated). Next to the movie title, the genre of the movie is shown
as well as the average rating of all the reviews for the movie. To view written
reviews of the movie, click on the movie title. If you are logged in, you can
choose to leave a review on the movie, or edit your existing reviews of the
movie. When logged in, you will also gain the ability to add additional movies
as well as delete movies from the list.

## Contributor's Guide

If you encounter a bug or have a feature request, please [open an issue](https://github.com/alvinscode/movie-discovery-app/issues).

To contribute code, follow these steps:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them.
- Push your changes to your fork.
- Submit a pull request to the original repository.

## License

This project is licensed under the [Learn.co and Flatiron School LLC Educational Content License](https://learn.co/content-license).
