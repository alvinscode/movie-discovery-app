import React, { useState } from 'react';

function Review({ onSubmit }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit(reviewText, rating);
    
    setReviewText('');
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Enter your review"
        required
      />
      <label>
        Rating:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
          min="0"
          max="5"
          step="0.1"
          required
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default Review;
