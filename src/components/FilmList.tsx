import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FilmList.css'; // Import CSS module for FilmList
import { Film } from '../types/films';

interface FilmListProps {
  films?: Film[];
}

const FilmList: React.FC<FilmListProps> = ({ films: initialFilms }) => {
  const [films, setFilms] = useState<Film[]>(initialFilms || []);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch('http://localhost:3000/films');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        // Map API response to our Film interface:
        const filmsFromApi: Film[] = data.films.map((film: any) => ({
          filmId: film.film_id,
          title: film.title,
          description: film.synopsis || 'No description available',
        }));
        setFilms(filmsFromApi);
      } catch (error: any) {
        console.error('Error fetching films:', error.message);
      }
    };

    fetchFilms();
  }, []);

  return (
    <div className="film-list-container">
      <h1>Explore Films</h1>
      <div className="film-grid">
        {films.map((film) => (
          <div key={film.filmId} className="film-item">
            <Link to={`/film/${film.filmId}`} className="film-link">
              <h3>{film.title}</h3>
              <p className="film-description">{film.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilmList;
