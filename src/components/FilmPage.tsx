import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FilmPage.css'; // Import CSS module for FilmPage
import { Film } from '../types/films';

const FilmPage: React.FC = () => {
  const { filmId } = useParams<{ filmId: string }>();
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      if (filmId) {
        try {
          const res = await fetch(`http://localhost:3000/films/${filmId}`);
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await res.json();
          // Map backend response to our Film interface.
          // Adjust the mapping based on your API response structure.
          const fetchedFilm: Film = {
            filmId: data.film.film_id,
            title: data.film.title,
            description: data.film.synopsis || '',
            productionDetails: {
              productionTeam: data.productionDetails, // This could include production team, authors, equipment, etc.
            },
            analysisDetails: data.analysisDetails || {},
            institutionalFinancialDetails: data.institutionalInfo || {},
            screeningsDetails: data.screenings || {},
          };
          setFilm(fetchedFilm);
        } catch (error: any) {
          console.error('Error fetching film details:', error.message);
        }
      }
    };

    fetchFilmDetails();
  }, [filmId]);

  if (!film) {
    return <div>Loading film details...</div>;
  }

  return (
    <div className="film-page-container">
      <header className="film-header">
        <h1 className="film-title">{film.title}</h1>
      </header>

      <section className="film-overview">
        <p className="film-description">{film.description}</p>
      </section>

      <section className="film-tabs-placeholder">
        {/* Placeholder for Tabs - we'll implement tabs later */}
        <div className="tab-navigation">
          <ul>
            <li><button>Production</button></li>
            <li><button>Analysis</button></li>
            <li><button>Institutions & Finance</button></li>
            <li><button>Screenings</button></li>
          </ul>
        </div>
        <div className="tab-content">
          {/* Content for tabs will go here */}
          <p>Tab content will be dynamically loaded here.</p>
        </div>
      </section>
    </div>
  );
};

export default FilmPage;
