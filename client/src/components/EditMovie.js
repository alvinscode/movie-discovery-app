import React, { useState, useEffect } from 'react';

function EditMovie() {
  const [movies, setMovies] = useState([]);
  const [editableMovieId, setEditableMovieId] = useState(null);
  const [editedMovieTitle, setEditedMovieTitle] = useState('');

  useEffect(() => {
    // Fetch all movies from the server when the component mounts
    fetch('/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        return response.json();
      })
      .then((data) => setMovies(data.movies))
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setMovies([]);
      });
  }, []);

  // Function to update a movie's title
  const updateMovieTitle = (movieId) => {
    // Send a PATCH request to the server to update the movie title
    fetch(`/api/movies/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editedMovieTitle }),
    })
      .then((response) => {
        if (response.ok) {
          // Update the title in the movies array
          setMovies((prevMovies) =>
            prevMovies.map((movie) =>
              movie.id === movieId
                ? { ...movie, title: editedMovieTitle }
                : movie
            )
          );

          // Clear the editable state
          setEditableMovieId(null);
        } else {
          console.error('Failed to update movie title');
        }
      })
      .catch((error) => {
        console.error('Update movie title error:', error);
      });
  };

  // Function to delete a movie by ID
  const deleteMovie = (movieId) => {
    // Send a DELETE request to the server to delete the movie
    fetch(`/api/movies/${movieId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted movie from the movies array
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie.id !== movieId)
          );
        } else {
          console.error('Failed to delete movie');
        }
      })
      .catch((error) => {
        console.error('Delete movie error:', error);
      });
  };

  return (
    <div>
      <h2>Edit Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {editableMovieId === movie.id ? (
              <div>
                <input
                  type="text"
                  value={editedMovieTitle}
                  onChange={(e) => setEditedMovieTitle(e.target.value)}
                />
                <button onClick={() => updateMovieTitle(movie.id)}>Save</button>
              </div>
            ) : (
              <div>
                {movie.title}
                <button onClick={() => setEditableMovieId(movie.id)}>Edit</button>
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditMovie;
