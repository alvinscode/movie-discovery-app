import React, { useEffect, useState } from 'react';
import Review from './Review';

function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
}

function Home({ isLoggedIn }) {
  const [movies, setMovies] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [expandedMovies, setExpandedMovies] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [editedRating, setEditedRating] = useState(0);

  useEffect(() => {
    fetch('/api/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies);
        setLoggedInUserId(data.loggedInUserId);
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
          const updatedMovies = movies.map((movie) => {
            if (movie.id === movieId) {
              movie.reviews.push(data.review);
            }
            return movie;
          });
          setMovies(updatedMovies);
        })
        .catch((error) => {
          console.error('Review submission error:', error);
        });
    }
  };

  const handleEditReview = (reviewId) => {
    const reviewToEdit = editingReview || movies.flatMap(movie => movie.reviews).find(review => review.id === reviewId);

    if (reviewToEdit) {
      setEditingReview(reviewToEdit);
      setEditedText(reviewToEdit.text);
      setEditedRating(reviewToEdit.rating);
    }
  };

  const handleSaveEditedReview = () => {
    if (editingReview) {
      const updatedReview = {
        text: editedText,
        rating: editedRating,
      };

      fetch(`/api/reviews/${editingReview.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      })
        .then((response) => {
          if (response.status === 200) {
            const updatedMovies = movies.map((movie) => {
              const updatedReviews = movie.reviews.map((review) => {
                if (review.id === editingReview.id) {
                  return { ...review, text: editedText, rating: editedRating };
                }
                return review;
              });
              return { ...movie, reviews: updatedReviews };
            });

            setMovies(updatedMovies);
            setEditingReview(null);
            setEditedText('');
            setEditedRating(0);
          } else {
            throw new Error('Review update failed');
          }
        })
        .catch((error) => {
          console.error('Review update error:', error);
        });
    }
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          setMovies((prevMovies) => {
            const updatedMovies = [...prevMovies];
            updatedMovies.forEach((movie) => {
              movie.reviews = movie.reviews.filter((review) => review.id !== reviewId);
            });
            return updatedMovies;
          });
        } else {
          throw new Error('Review deletion failed');
        }
      })
      .catch((error) => {
        console.error('Review deletion error:', error);
      });
  };

  const toggleMovieExpansion = (movieId) => {
    setExpandedMovies((prevExpandedMovies) => {
      if (prevExpandedMovies.includes(movieId)) {
        return prevExpandedMovies.filter((id) => id !== movieId);
      } else {
        return [...prevExpandedMovies, movieId];
      }
    });
  };

  return (
    <div>
      {movies && movies.length > 0 ? (
        <div>
          {movies.map((movie) => (
            <div key={movie.id}>
              <h2
                style={{ cursor: 'pointer' }}
                onClick={() => toggleMovieExpansion(movie.id)}
              >
                {movie.title} (Avg. Rating: {calculateAverageRating(movie.reviews)})
              </h2>
              {expandedMovies.includes(movie.id) && (
                <div>
                  {movie.reviews && movie.reviews.length > 0 ? (
                    <div>
                      <h3>Reviews:</h3>
                      <ul>
                        {movie.reviews.map((review) => (
                          <li key={review.id}>
                            {editingReview && editingReview.id === review.id ? (
                              <div>
                                <textarea
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                />
                                <label>
                                  Rating:
                                  <input
                                    type="number"
                                    value={editedRating}
                                    onChange={(e) => setEditedRating(Number(e.target.value))}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                  />
                                </label>
                                <button onClick={handleSaveEditedReview}>Save</button>
                              </div>
                            ) : (
                              <div>
                                {review.text}
                                <p>Rating: {review.rating}</p>
                                <p>User: {review.user.username}</p>
                                {isLoggedIn && review.user.id === loggedInUserId && (
                                  <div>
                                    <button onClick={() => handleEditReview(review.id)}>Edit</button>
                                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No reviews available</p>
                  )}
                  {isLoggedIn && (
                    <button onClick={() => handleAddReview(movie.id)}>Add Review</button>
                  )}
                  {showReviewForm && isLoggedIn && (
                    <Review
                      onSubmit={(reviewText, rating) =>
                        handleSubmitReview(reviewText, rating, selectedMovieId)
                      }
                    />
                  )}
                </div>
              )}
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
