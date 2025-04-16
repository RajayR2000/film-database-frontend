import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  comment: string | null;
  source: string;
  film_rights: string | null;
  format: string | null;
  audience: string | null;
  screeningCity: string;
  screeningCountry: string;
}

interface InstitutionalInfo {
  institutional_city: string;
  institutional_country: string;
  productionCompany: string;
  fundingCompany: string;
  fundingComment: string;
  source: string;
}

interface ProductionDetails {
  postProductionStudio: string;
  productionComments: string;
  productionTimeframe: string;
  shootingCity: string;
  shootingCountry: string;
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
  authors: { role: string; name: string; comment?: string }[];
  productionTeam: { department: string; name: string; role?: string; comment?: string }[];
  equipment: { equipment_name: string; description?: string; comment?: string }[];
  institutionalInfo: InstitutionalInfo;
  documents: { document_type: string; file_url: string; comment?: string }[];
  gallery: string[];
  av_annotate_link: string;
  screenings: Screening[];
}

interface MovieDetailsPageProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

type Tab = 
  | 'synopsis' 
  | 'filmProduction' 
  | 'institution' 
  | 'screening' 
  | 'gallery' 
  | 'avLink';

const tabLabels: Record<Tab, string> = {
  synopsis: 'Synopsis',
  filmProduction: 'Film Production',
  institution: 'Institutional & Financial',
  screening: 'Film Screenings',
  gallery: 'Gallery',
  avLink: 'AV Annotate Link',
};

const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'synopsis'|'filmProduction'|'institution'|'screening'|'gallery'|'avLink'>('synopsis');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const fetchMovieDetails = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3001/films/${id}`, {
        headers: {
          Authorization: localStorage.getItem('accessToken')
            ? `Bearer ${localStorage.getItem('accessToken')}`
            : '-',
        },
      });
      if (res.status === 401) {
        setShowLoginModal(true);
        setMovie(null);
        return;
      }
      if (!res.ok) {
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
          director: data.film.director || 'Unknown',
          producer: data.film.producer || 'Unknown',
          cast: (data.actors || []).map((a: any) => ({
            actorName: a.actor_name,
            characterName: a.character_name,
            comment: a.comment,
          })),
          runtime: data.film.runtime || '-',
        },
        productionDetails: {
          postProductionStudio: data.productionDetails?.post_production_studio || '-',
          productionComments: data.productionDetails?.production_comments || '-',
          productionTimeframe: data.productionDetails?.production_timeframe || '-',
          shootingCity: data.productionDetails?.shooting_city || '-',
          shootingCountry: data.productionDetails?.shooting_country || '-',
        },
        authors: data.authors || [],
        productionTeam: data.productionTeam || [],
        equipment: data.equipment || [],
        institutionalInfo: {
          productionCompany: data.institutionalInfo?.production_company || '-',
          fundingCompany: data.institutionalInfo?.funding_company || '-',
          fundingComment: data.institutionalInfo?.funding_comment || '-',
          source: data.institutionalInfo?.source || '-',
          institutional_city: data.institutionalInfo?.institutional_city || '-',
          institutional_country: data.institutionalInfo?.institutional_country || '-',
        },
        documents: data.documents || [],
        gallery: data.film.gallery || [],
        av_annotate_link: data.film.av_annotate_link || 'No Links Available',
        screenings: (data.screenings || []).map((s: any) => ({
          screening_id: s.screening_id,
          screening_date: s.screening_date,
          organizers: s.organizers,
          comment: s.comment,
          source: s.source,
          film_rights: s.film_rights,
          format: s.format,
          audience: s.audience,
          screeningCity: s.screening_city || '-',
          screeningCountry: s.screening_country || '-',
        })),
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
  const handleSuccessfulLogin = () => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
    fetchMovieDetails();
  };

  if (!id) {
    return <div>Error: No movie ID provided</div>;
  }
  if (showLoginModal || !isLoggedIn) {
    return <LoginModal onLoginSuccess={handleSuccessfulLogin} onReturnHome={handleLoginModalClose} />;
  }
  if (!movie) {
    return <div>Loading...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'synopsis':
        return <div className="tab-content"><p>{movie.synopsis}</p></div>;

        case 'filmProduction':
  // Group production team by department → role → members[]
  const teamByDept = movie.productionTeam.reduce(
    (acc, m) => {
      const dept = m.department || 'Other';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(m);
      return acc;
    },
    {} as Record<string, typeof movie.productionTeam>
  );

  return (
    <div className="tab-content">
      <h2>Film Production</h2>

      {/* AUTHORS */}
      <section className="grouped-dl-section">
        <h3>Authors</h3>
        {movie.authors.length ? (
          <dl className="two-col-dl">
            {movie.authors.map((a, i) => (
              <React.Fragment key={i}>
                <dt>{a.role}</dt>
                <dd>
                  {a.name}
                  {a.comment && <span className="dl-comment"> — {a.comment}</span>}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        ) : (
          <p>No author information.</p>
        )}
      </section>

      {/* PRODUCTION TEAM */}
      <section className="grouped-dl-section">
        <h3>Production Team</h3>
        {Object.entries(teamByDept).map(([dept, members]) => (
          <div key={dept}>
            <h4>{dept}</h4>
            <dl className="two-col-dl">
              {members.map((m, idx) => (
                <React.Fragment key={idx}>
                  <dt>{m.role || '-'}</dt>
                  <dd>
                    {m.name}
                    {m.comment && <span className="dl-comment"> — {m.comment}</span>}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        ))}
        {!movie.productionTeam.length && <p>No production team data.</p>}
      </section>

      {/* ACTORS */}
      <section className="grouped-dl-section">
        <h3>Actors</h3>
        {movie.production.cast.length ? (
          <dl className="two-col-dl">
            {movie.production.cast.map((c, i) => (
              <React.Fragment key={i}>
                <dt>{c.actorName}</dt>
                <dd>
                  {c.characterName && <><strong>as</strong> {c.characterName}</>}
                  {c.comment && <span className="dl-comment"> — {c.comment}</span>}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        ) : (
          <p>No actors listed.</p>
        )}
      </section>

      {/* EQUIPMENT */}
      <section className="grouped-dl-section">
        <h3>Equipment</h3>
        {movie.equipment.length ? (
          <dl className="two-col-dl">
            {movie.equipment.map((e, i) => (
              <React.Fragment key={i}>
                <dt>{e.equipment_name}</dt>
                <dd>
                  {e.description && <span>{e.description}</span>}
                  {e.comment && <span className="dl-comment"> — {e.comment}</span>}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        ) : (
          <p>No equipment data.</p>
        )}
      </section>

      {/* PRODUCTION DATE & PLACE */}
      <section className="grouped-dl-section">
        <h3>Production Date & Place</h3>
        <dl className="two-col-dl">
          <dt>Time Frame</dt>
          <dd>{movie.productionDetails.productionTimeframe || '-'}</dd>
          <dt>City</dt>
          <dd>{movie.productionDetails.shootingCity || '-'}</dd>
          <dt>Country</dt>
          <dd>{movie.productionDetails.shootingCountry || '-'}</dd>
          <dt>Post‑Production Studio</dt>
          <dd>{movie.productionDetails.postProductionStudio || '-'}</dd>
          <dt>Comments</dt>
          <dd>{movie.productionDetails.productionComments || '-'}</dd>
        </dl>
      </section>
    </div>
  );

  case 'institution':
    return (
      <div className="tab-content">
        <h2>Institutional & Financial Info</h2>
        <section className="grouped-dl-section">
          <dl className="two-col-dl">
            <dt>Production Company</dt>
            <dd>{movie.institutionalInfo.productionCompany || '-'}</dd>
  
            <dt>Funding Company</dt>
            <dd>{movie.institutionalInfo.fundingCompany || '-'}</dd>
  
            <dt>Funding Comment</dt>
            <dd>{movie.institutionalInfo.fundingComment || '-'}</dd>
  
            <dt>City</dt>
            <dd>{movie.institutionalInfo.institutional_city || '-'}</dd>
  
            <dt>Country</dt>
            <dd>{movie.institutionalInfo.institutional_country || '-'}</dd>
  
            <dt>Source</dt>
            <dd>
              {movie.institutionalInfo.source?.startsWith('http') ? (
                <a
                  href={movie.institutionalInfo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              ) : (
                movie.institutionalInfo.source || '-'
              )}
            </dd>
          </dl>
        </section>
      </div>
    );
  

        case 'screening':
          return (
            <div className="tab-content">
              <h2>Film Screenings</h2>
              {movie.screenings.length > 0 ? (
                <div className="table-responsive">
                  <table className="screenings-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Organizers</th>
                        <th>Source</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movie.screenings.map((s) => (
                        <tr key={s.screening_id}>
                          <td>{new Date(s.screening_date).toLocaleDateString()}</td>
                          <td>{s.screeningCity}</td>
                          <td>{s.screeningCountry}</td>
                          <td>{s.organizers}</td>
                          <td>
                            {s.source.startsWith('http') ? (
                              <a href={s.source} target="_blank" rel="noopener noreferrer">
                                Link
                              </a>
                            ) : (
                              s.source
                            )}
                          </td>
                          <td>{s.comment || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No screening details available.</p>
              )}
            </div>
          );
        

      case 'gallery':
        return (
          <div className="tab-content gallery">
            {movie.gallery.length ? (
              movie.gallery.map((img, i) => (
                <img key={i} src={img} alt={`Still ${i+1}`} className="gallery-image" />
              ))
            ) : <p>No gallery images available.</p>}
          </div>
        );

      case 'avLink':
        return (
          <div className="tab-content">
            {movie.av_annotate_link ? (
              <a href={movie.av_annotate_link} target="_blank" rel="noopener noreferrer">
                {movie.av_annotate_link}
              </a>
            ) : <p>No AV Annotate link available.</p>}
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
        {(Object.keys(tabLabels) as Tab[]).map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : '-'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className="tab-panel">{renderTabContent()}</div>
    </div>
  );
};

export default MovieDetailsPage;
