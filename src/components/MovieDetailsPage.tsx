import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/MovieDetailsPage.css';
import LoginModal from './LoginModal';
import movie_poster from '../assets/movie_poster.jpg';

interface Actor {
  actorName: string;
  characterName?: string;
  comment?: string;
}

interface Screening {
  screening_id: number;
  screening_date: string;
  organizers: string;
  location_id: number;
  comment: string | null;
  source: string;
  film_rights: string | null;
  format: string | null;
  audience: string | null;
}

interface InstitutionalInfo {
  productionCompany: string;
  fundingCompany: string;
  fundingComment: string;
  source: string;
}

interface ProductionDetails {
  postProductionStudio: string;
  productionComments: string;
  productionTimeframe: string;
  shootingLocationId: number;
}

interface MovieDetails {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  synopsis: string;
  production: {
    director: string;
    producer: string;
    cast: Actor[];
    runtime: string;
  };
  productionDetails: ProductionDetails;
  screenings: Screening[];
  authors: { role: string; name: string; comment?: string }[];
  productionTeam: { department: string; name: string; role?: string; comment?: string }[];
  equipment: { equipment_name: string; description?: string; comment?: string }[];
  institutionalInfo: InstitutionalInfo;
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

      // Map the backend response to our MovieDetails interface.
      const fetchedMovie: MovieDetails = {
        id: data.film.film_id.toString(),
        title: data.film.title,
        year: data.film.release_year,
        posterUrl: data.film.posterUrl || movie_poster,
        synopsis: data.film.synopsis,
        production: {
          director: data.film.director || (data.authors?.find((a: any) => a.role === 'Filmmaker')?.name || 'Unknown'),
          producer: data.film.producer || (data.authors?.find((a: any) => a.role === 'Executive Producer')?.name || 'Unknown'),
          cast: data.actors
            ? data.actors.map((a: any) => ({
                actorName: a.actor_name,
                characterName: a.character_name,
                comment: a.comment,
              }))
            : [],
          runtime: data.film.runtime || '',
        },
        productionDetails: {
          postProductionStudio: data.productionDetails?.post_production_studio || '',
          productionComments: data.productionDetails?.production_comments || '',
          productionTimeframe: data.productionDetails?.production_timeframe || '',
          shootingLocationId: data.productionDetails?.shooting_location_id || 0,
        },
        screenings: data.screenings || [],
        authors: data.authors || [],
        productionTeam: data.productionTeam || [],
        equipment: data.equipment || [],
        institutionalInfo: {
          productionCompany: data.institutionalInfo?.production_company || 'N/A',
          fundingCompany: data.institutionalInfo?.funding_company || 'N/A',
          fundingComment: data.institutionalInfo?.funding_comment || 'N/A',
          source: data.institutionalInfo?.source || 'N/A',
        },
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
            <h3>Production Credits</h3>
            <p><strong>Director:</strong> {movie.production.director}</p>
            <p><strong>Producer:</strong> {movie.production.producer}</p>
            <p><strong>Runtime:</strong> {movie.production.runtime}</p>
            <h4>Cast</h4>
            {movie.production.cast.length ? (
              <ul>
                {movie.production.cast.map((actor, idx) => (
                  <li key={idx}>
                    <p><strong>Actor:</strong> {actor.actorName}</p>
                    {actor.characterName && (
                      <p><strong>Character:</strong> {actor.characterName}</p>
                    )}
                    {actor.comment && (
                      <p><strong>Comment:</strong> {actor.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No cast details available.</p>
            )}
            <h3>Production Details</h3>
            <p>
              <strong>Post Production Studio:</strong> {movie.productionDetails.postProductionStudio}
            </p>
            <p>
              <strong>Production Comments:</strong> {movie.productionDetails.productionComments}
            </p>
            <p>
              <strong>Production Timeframe:</strong> {movie.productionDetails.productionTimeframe}
            </p>
            {/* <p>
              <strong>Shooting Location ID:</strong> {movie.productionDetails.shootingLocationId}
            </p> */}
          </div>
        );
      case 'screening':
        return (
          <div className="tab-content">
            {movie.screenings.length ? (
              <ul>
                {movie.screenings.map((screening) => (
                  <li key={screening.screening_id}>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(screening.screening_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Organizers:</strong> {screening.organizers}
                    </p>
                    <p>
                      <strong>Source:</strong> {screening.source}
                    </p>
                    {screening.comment && (
                      <p>
                        <strong>Comment:</strong> {screening.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No screening details available.</p>
            )}
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
            {movie.gallery.length ? (
              movie.gallery.map((img: string, index: number) => (
                <img key={index} src={img} alt={`Still ${index + 1}`} className="gallery-image" />
              ))
            ) : (
              <p>No gallery images available.</p>
            )}
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
                    <p>
                      <strong>Role:</strong> {author.role}
                    </p>
                    <p>
                      <strong>Name:</strong> {author.name}
                    </p>
                    {author.comment && (
                      <p>
                        <strong>Comment:</strong> {author.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No film authors available.</p>
            )}
            <h3>Production Team</h3>
            {movie.productionTeam.length ? (
              // Group team members by department.
              Object.entries(
                movie.productionTeam.reduce((groups, member) => {
                  if (!groups[member.department]) {
                    groups[member.department] = [];
                  }
                  groups[member.department].push(member);
                  return groups;
                }, {} as { [department: string]: typeof movie.productionTeam })
              ).map(([department, members]) => (
                <div key={department}>
                  <h4>{department}</h4>
                  <ul>
                    {members.map((member, idx) => (
                      <li key={idx}>
                        <p>
                          <strong>Name:</strong> {member.name}
                        </p>
                        {member.role && (
                          <p>
                            <strong>Role:</strong> {member.role}
                          </p>
                        )}
                        {member.comment && (
                          <p>
                            <strong>Comment:</strong> {member.comment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No production team data available.</p>
            )}
            <h3>Equipment</h3>
            {movie.equipment.length ? (
              <ul>
                {movie.equipment.map((eq, idx) => (
                  <li key={idx}>
                    <p>
                      <strong>Equipment Name:</strong> {eq.equipment_name}
                    </p>
                    {eq.description && (
                      <p>
                        <strong>Description:</strong> {eq.description}
                      </p>
                    )}
                    {eq.comment && (
                      <p>
                        <strong>Comment:</strong> {eq.comment}
                      </p>
                    )}
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
            <p>
              <strong>Production Company:</strong> {movie.institutionalInfo.productionCompany}
            </p>
            <p>
              <strong>Funding Company:</strong> {movie.institutionalInfo.fundingCompany}
            </p>
            <p>
              <strong>Funding Comment:</strong> {movie.institutionalInfo.fundingComment}
            </p>
            <p>
              <strong>Source:</strong> {movie.institutionalInfo.source}
            </p>
          </div>
        );
      case 'documents':
        return (
          <div className="tab-content">
            {movie.documents.length ? (
              <ul>
                {movie.documents.map((doc, idx) => (
                  <li key={idx}>
                    <p>
                      <strong>Document Type:</strong> {doc.document_type}
                    </p>
                    <p>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    </p>
                    {doc.comment && (
                      <p>
                        <strong>Comment:</strong> {doc.comment}
                      </p>
                    )}
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
        <button className={`tab-button ${activeTab === 'synopsis' ? 'active' : ''}`} onClick={() => setActiveTab('synopsis')}>
          Synopsis
        </button>
        <button className={`tab-button ${activeTab === 'production' ? 'active' : ''}`} onClick={() => setActiveTab('production')}>
          Production
        </button>
        <button className={`tab-button ${activeTab === 'screening' ? 'active' : ''}`} onClick={() => setActiveTab('screening')}>
          Screenings
        </button>
        <button className={`tab-button ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
          Gallery
        </button>
        <button className={`tab-button ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          Crew & Equipment
        </button>
        <button className={`tab-button ${activeTab === 'institution' ? 'active' : ''}`} onClick={() => setActiveTab('institution')}>
          Institutions & Finance
        </button>
        <button className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          Documents
        </button>
      </div>
      <div className="tab-panel">{renderTabContent()}</div>
    </div>
  );
};

export default MovieDetailsPage;
