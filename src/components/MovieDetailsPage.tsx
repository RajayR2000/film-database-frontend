import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetailsPage.css';
import LoginModal from './LoginModal';
import movie_poster from '../assets/movie_poster.jpg';

interface MovieDetails {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  synopsis: string;
  production: {
    director: string;
    producer: string;
    cast: string[];
    cinematography: string;
    runtime: string;
  };
  screenings: {
    premieres: string;
    pastScreenings: string;
    upcomingEvents: string;
  };
  authors: { role: string; name: string; comment?: string }[];
  productionTeam: { department: string; name: string; role?: string; comment?: string }[];
  equipment: { equipment_name: string; description?: string; comment?: string }[];
  institutionalInfo: {
    productionCompany?: string;
    fundingCompany?: string;
    fundingComment?: string;
    source?: string;
  };
  documents: { document_type: string; file_url: string; comment?: string }[];
  gallery: string[];
}

interface MovieDetailsPageProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3001/films/${id}`, {
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '',
        },
      });
      if (res.status === 401) {
        setShowLoginModal(true);
        setMovie(null);
        return;
      } else if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      const fetchedMovie: MovieDetails = {
        id: data.film.film_id.toString(),
        title: data.film.title,
        year: data.film.release_year,
        posterUrl: data.film.posterUrl || movie_poster,
        synopsis: data.film.synopsis,
        production: {
          director: data.film.director || (data.authors?.find((a: any) => a.role === 'Filmmaker')?.name || 'Unknown'),
          producer: data.film.producer || (data.authors?.find((a: any) => a.role === 'Executive Producer')?.name || 'Unknown'),
          cast: data.actors ? data.actors.map((a: any) => a.actor_name) : [],
          cinematography: data.film.cinematography || '',
          runtime: data.film.runtime || '',
        },
        screenings: {
          premieres: data.productionDetails?.premieres || '',
          pastScreenings: data.productionDetails?.pastScreenings || '',
          upcomingEvents: data.productionDetails?.upcomingEvents || '',
        },
        authors: data.authors || [],
        productionTeam: data.productionTeam || [],
        equipment: data.equipment || [],
        institutionalInfo: data.institutionalInfo || {},
        documents: data.documents || [],
        gallery: data.film.gallery || [],
      };
      setMovie(fetchedMovie);
    } catch (error: any) {
      console.error('Error fetching film details:', error.message);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    fetchMovieDetails();
  }, [id, isLoggedIn, fetchMovieDetails]);

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    // Re-check login state (it should be true now if login was successful)
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
    fetchMovieDetails();
  };

  if (!id) {
    return <div>Error: No movie ID provided</div>;
  }
  if (showLoginModal || !isLoggedIn) {
    return <LoginModal onClose={handleLoginModalClose} />;
  }
  if (!movie) return <div>Loading...</div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'production':
        return (
          <div className="tab-content">
            <p><strong>Director:</strong> {movie.production.director}</p>
            <p><strong>Producer:</strong> {movie.production.producer}</p>
            <p><strong>Cast:</strong> {movie.production.cast.join(', ')}</p>
            <p><strong>Cinematography:</strong> {movie.production.cinematography}</p>
            <p><strong>Runtime:</strong> {movie.production.runtime}</p>
          </div>
        );
      case 'screening':
        return (
          <div className="tab-content">
            <p><strong>Premieres:</strong> {movie.screenings.premieres}</p>
            <p><strong>Past Screenings:</strong> {movie.screenings.pastScreenings}</p>
            <p><strong>Upcoming Events:</strong> {movie.screenings.upcomingEvents}</p>
          </div>
        );
      case 'synopsis':
        return (
          <div className="tab-content">
            <p>{movie.synopsis}</p>
          </div>
        );
      case 'gallery':
        return (
          <div className="tab-content gallery">
            {movie.gallery.map((img: string, index: number) => (
              <img key={index} src={img} alt={`Still ${index + 1}`} className="gallery-image" />
            ))}
          </div>
        );
      case 'team':
        return (
          <div className="tab-content">
            <h3>Film Authors</h3>
            {movie.authors.length ? (
              <ul>
                {movie.authors.map((author, idx) => (
                  <li key={idx}>
                    {author.role}: {author.name} {author.comment && `(${author.comment})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No film authors available.</p>
            )}
            <h3>Production Team</h3>
            {movie.productionTeam.length ? (
              <ul>
                {movie.productionTeam.map((member, idx) => (
                  <li key={idx}>
                    {member.department}: {member.name} {member.role && `- ${member.role}`}
                    {member.comment && ` (${member.comment})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No production team data available.</p>
            )}
            <h3>Equipment</h3>
            {movie.equipment.length ? (
              <ul>
                {movie.equipment.map((eq, idx) => (
                  <li key={idx}>
                    {eq.equipment_name} {eq.description && `- ${eq.description}`} {eq.comment && `(${eq.comment})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No equipment data available.</p>
            )}
          </div>
        );
      case 'institution':
        return (
          <div className="tab-content">
            <p><strong>Production Company:</strong> {movie.institutionalInfo.productionCompany || 'N/A'}</p>
            <p><strong>Funding Company:</strong> {movie.institutionalInfo.fundingCompany || 'N/A'}</p>
            <p><strong>Funding Comment:</strong> {movie.institutionalInfo.fundingComment || 'N/A'}</p>
            <p><strong>Source:</strong> {movie.institutionalInfo.source || 'N/A'}</p>
          </div>
        );
      case 'documents':
        return (
          <div className="tab-content">
            {movie.documents.length ? (
              <ul>
                {movie.documents.map((doc, idx) => (
                  <li key={idx}>
                    <strong>{doc.document_type}</strong>: <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View Document</a>
                    {doc.comment && ` - ${doc.comment}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="movie-details-page">
      <div className="hero-section">
        <img src={movie.posterUrl} alt={movie.title} className="hero-poster" />
        <div className="hero-info">
          <h1 className="hero-title">{movie.title}</h1>
          <p className="hero-year">{movie.year}</p>
        </div>
      </div>
      <div className="tabs">
      <button
          className={`tab-button ${activeTab === 'synopsis' ? 'active' : ''}`}
          onClick={() => setActiveTab('synopsis')}
        >
          Synopsis
          </button>
        <button
          className={`tab-button ${activeTab === 'production' ? 'active' : ''}`}
          onClick={() => setActiveTab('production')}
        >
          Production
        </button>
        <button
          className={`tab-button ${activeTab === 'screening' ? 'active' : ''}`}
          onClick={() => setActiveTab('screening')}
        >
          Screenings
        </button>
        <button
          className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </button>
        <button
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Production
        </button>
        <button
          className={`tab-button ${activeTab === 'institution' ? 'active' : ''}`}
          onClick={() => setActiveTab('institution')}
        >
          Institutions & Finance
        </button>
        <button
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>
      <div className="tab-panel">{renderTabContent()}</div>
    </div>
  );
};

export default MovieDetailsPage;
