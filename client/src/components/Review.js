import React, { useState } from 'react';

function Review({ onSubmit }) {
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reviewText);
    setReviewText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Enter your review"
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default Review;