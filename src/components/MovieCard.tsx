import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MovieCard.css';

interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-overlay">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
