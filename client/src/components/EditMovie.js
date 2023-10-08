import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './EditMovie.css'

function EditMovie() {
  const { movieId } = useParams();
  const history = useHistory();

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch('/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data.movies);
        const movieToEdit = data.movies.find((movie) => movie.id === parseInt(movieId));
        setSelectedMovie(movieToEdit);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, [movieId]);

  const handleDelete = (movie) => {
    fetch(`/api/movies/${movie.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Movie deleted successfully');
          const updatedMovies = movies.filter((m) => m.id !== movie.id);
          setMovies(updatedMovies);
          setSelectedMovie(null);
        } else {
          console.error('Failed to delete movie');
        }
      })
      .catch((error) => {
        console.error('Delete movie error:', error);
      });
  };

  return (
    <div className="edit-movie-container">
      <h2>Delete Movie</h2>
      <div>
        <h3>Select a movie to delete:</h3>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.title}{' '}
              <button onClick={() => handleDelete(movie)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EditMovie;
