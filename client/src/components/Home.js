import React, { useEffect, useState } from 'react';
import Review from './Review';

function Home({ isLoggedIn }) {
  const [movies, setMovies] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    fetch('/api/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const handleAddReview = (movieId) => {
    setSelectedMovieId(movieId);
    setShowReviewForm(true);
  };

  const handleSubmitReview = (reviewText, rating, movieId) => {
    if (selectedMovieId !== null) {
      const reviewData = {
        text: reviewText,
        rating: rating, 
      };

    fetch(`/api/movies/${movieId}/add-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error('Review submission failed');
        }
      })
      .then((data) => {
        console.log('Review submitted successfully:', data);
        setShowReviewForm(false);
        setSelectedMovieId(null);
      })
      .catch((error) => {
        console.error('Review submission error:', error);
      });
    }
  };

  return (
    <div>
      {movies && movies.length > 0 ? (
        <div>
          {movies.map((movie) => (
            <div key={movie.id}>
              <h2>{movie.title}</h2>
              {movie.reviews && movie.reviews.length > 0 ? (
                <div>
                  <h3>Reviews:</h3>
                  <ul>
                    {movie.reviews.map((review) => (
                      <li key={review.id}>
                        {review.text}
                        <p>User: {review.user.username}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No reviews available</p>
              )}
              {isLoggedIn ? (
                <button onClick={() => handleAddReview(movie.id)}>Add Review</button>
              ) : null}
              {showReviewForm && isLoggedIn ? (
                <Review onSubmit={(reviewText, rating) => handleSubmitReview(reviewText, rating, selectedMovieId)} />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p>No movies available</p>
      )}
    </div>
  );
}

export default Home;
