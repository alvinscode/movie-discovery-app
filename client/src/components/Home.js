import React, { useEffect, useState } from 'react';

function Home() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('/api/movies')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setMovies(data);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, []);

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
