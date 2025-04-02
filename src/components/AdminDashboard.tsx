import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';

// Minimal Film interface for list display
interface Film {
  film_id: number;
  title: string;
  release_year: number;
  runtime: string;
  synopsis: string;
}

// The full payload format for the film form
interface FilmFormData {
  title: string;
  release_year: string;
  runtime: string;
  synopsis: string;
  productionDetails: {
    production_timeframe: string;
    shooting_location_id: string;
    post_production_studio: string;
    production_comments: string;
  };
  authors: {
    screenwriter: string;
    screenwriter_comment: string;
    filmmaker: string;
    filmmaker_comment: string;
    executive_producer: string;
    executive_producer_comment: string;
  };
  productionTeam: Array<{
    department: string;
    name: string;
    role: string;
    comment: string;
  }>;
  actors: string;
  equipment: {
    equipment_name: string;
    description: string;
    comment: string;
  };
  documents: {
    document_type: string;
    file_url: string;
    comment: string;
  };
  institutionalInfo: {
    production_company: string;
    funding_company: string;
    funding_comment: string;
    source: string;
    funding_location_id: string;
  };
  screenings: {
    screening_date: string;
    location_id: string;
    organizers: string;
    format: string;
    audience: string;
    film_rights: string;
    comment: string;
    source: string;
  };
}

const defaultFormData: FilmFormData = {
  title: '',
  release_year: '',
  runtime: '',
  synopsis: '',
  productionDetails: {
    production_timeframe: '',
    shooting_location_id: '',
    post_production_studio: '',
    production_comments: '',
  },
  authors: {
    screenwriter: '',
    screenwriter_comment: '',
    filmmaker: '',
    filmmaker_comment: '',
    executive_producer: '',
    executive_producer_comment: '',
  },
  productionTeam: [],
  actors: '',
  equipment: {
    equipment_name: '',
    description: '',
    comment: '',
  },
  documents: {
    document_type: '',
    file_url: '',
    comment: '',
  },
  institutionalInfo: {
    production_company: '',
    funding_company: '',
    funding_comment: '',
    source: '',
    funding_location_id: '',
  },
  screenings: {
    screening_date: '',
    location_id: '',
    organizers: '',
    format: '',
    audience: '',
    film_rights: '',
    comment: '',
    source: '',
  },
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<FilmFormData>(defaultFormData);

  // Fetch films for update and delete modes
  const fetchFilms = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/films`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) throw new Error('Error fetching films');
      const data = await res.json();
      setFilms(data.films);
    } catch (error: any) {
      console.error('Error fetching films:', error);
      setMessage(error.message);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update top-level keys in the form
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // For nested object inputs (e.g., productionDetails)
  const handleNestedInputChange = (
    group: keyof FilmFormData,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [group]: { ...(formData[group] as object), [e.target.name]: e.target.value },
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  // Unified submit handler for Add and Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = selectedFilm
      ? `${API_BASE_URL}/films/${selectedFilm.film_id}`
      : `${API_BASE_URL}/films`;
    const method = selectedFilm ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(selectedFilm ? 'Failed to update film' : 'Failed to add film');
      setMessage(selectedFilm ? 'Film updated successfully!' : 'Film added successfully!');
      setSelectedFilm(null);
      resetForm();
      fetchFilms();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleDeleteFilm = async (filmId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/films/${filmId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete film');
      setMessage('Film deleted successfully!');
      fetchFilms();
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleSelectFilmForUpdate = async (film: Film) => {
    try {
      const res = await fetch(`${API_BASE_URL}/films/${film.film_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch full film details');
      const data = await res.json();
      // Map the backend response to the FilmFormData format.
      setFormData({
        title: data.film.title || '',
        release_year: data.film.release_year ? data.film.release_year.toString() : '',
        runtime: data.film.runtime || '',
        synopsis: data.film.synopsis || '',
        productionDetails: {
          production_timeframe: data.productionDetails?.production_timeframe || '',
          shooting_location_id: data.productionDetails?.shooting_location_id?.toString() || '',
          post_production_studio: data.productionDetails?.post_production_studio || '',
          production_comments: data.productionDetails?.production_comments || '',
        },
        authors: {
          screenwriter: (data.authors.find((a: any) => a.role === 'Screenwriter') || {}).name || '',
          screenwriter_comment: (data.authors.find((a: any) => a.role === 'Screenwriter') || {}).comment || '',
          filmmaker: (data.authors.find((a: any) => a.role === 'Filmmaker') || {}).name || '',
          filmmaker_comment: (data.authors.find((a: any) => a.role === 'Filmmaker') || {}).comment || '',
          executive_producer: (data.authors.find((a: any) => a.role === 'Executive Producer') || {}).name || '',
          executive_producer_comment: (data.authors.find((a: any) => a.role === 'Executive Producer') || {}).comment || '',
        },
        productionTeam: data.productionTeam || [],
        actors: data.actors ? data.actors.map((a: any) => a.actor_name).join(', ') : '',
        equipment: {
          equipment_name: data.equipment?.[0]?.equipment_name || '',
          description: data.equipment?.[0]?.description || '',
          comment: data.equipment?.[0]?.comment || '',
        },
        documents: {
          document_type: data.documents?.[0]?.document_type || '',
          file_url: data.documents?.[0]?.file_url || '',
          comment: data.documents?.[0]?.comment || '',
        },
        institutionalInfo: {
          production_company: data.institutionalInfo?.production_company || '',
          funding_company: data.institutionalInfo?.funding_company || '',
          funding_comment: data.institutionalInfo?.funding_comment || '',
          source: data.institutionalInfo?.source || '',
          funding_location_id: data.institutionalInfo?.funding_location_id?.toString() || '',
        },
        screenings: {
          screening_date: data.screenings?.[0]?.screening_date || '',
          location_id: data.screenings?.[0]?.location_id?.toString() || '',
          organizers: data.screenings?.[0]?.organizers || '',
          format: data.screenings?.[0]?.format || '',
          audience: data.screenings?.[0]?.audience || '',
          film_rights: data.screenings?.[0]?.film_rights || '',
          comment: data.screenings?.[0]?.comment || '',
          source: data.screenings?.[0]?.source || '',
        },
      });
      setSelectedFilm(film);
      setActiveTab('update');
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  // Render the Add/Update film form
  const renderFilmForm = (mode: 'Add Film' | 'Update Film') => (
    <form onSubmit={handleSubmit} className="admin-form">
      <fieldset>
        <legend>Film Information</legend>
        <label htmlFor="title">Title:</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required />
        <label htmlFor="release_year">Release Year:</label>
        <input type="number" name="release_year" id="release_year" value={formData.release_year} onChange={handleInputChange} required />
        <label htmlFor="runtime">Runtime:</label>
        <input type="text" name="runtime" id="runtime" value={formData.runtime} onChange={handleInputChange} required />
        <label htmlFor="synopsis">Synopsis:</label>
        <textarea name="synopsis" id="synopsis" value={formData.synopsis} onChange={handleInputChange} required />
      </fieldset>
      <fieldset>
        <legend>Production Details</legend>
        <label htmlFor="production_timeframe">Production Timeframe:</label>
        <input type="text" name="production_timeframe" id="production_timeframe" value={formData.productionDetails.production_timeframe} onChange={(e) => handleNestedInputChange('productionDetails', e)} />
        <label htmlFor="shooting_location_id">Shooting Location ID:</label>
        <input type="number" name="shooting_location_id" id="shooting_location_id" value={formData.productionDetails.shooting_location_id} onChange={(e) => handleNestedInputChange('productionDetails', e)} />
        <label htmlFor="post_production_studio">Post-Production Studio:</label>
        <input type="text" name="post_production_studio" id="post_production_studio" value={formData.productionDetails.post_production_studio} onChange={(e) => handleNestedInputChange('productionDetails', e)} />
        <label htmlFor="production_comments">Production Comments:</label>
        <textarea name="production_comments" id="production_comments" value={formData.productionDetails.production_comments} onChange={(e) => handleNestedInputChange('productionDetails', e)} />
      </fieldset>
      <fieldset>
        <legend>Film Authors</legend>
        <label htmlFor="screenwriter">Screenwriter:</label>
        <input type="text" name="screenwriter" id="screenwriter" value={formData.authors.screenwriter} onChange={(e) => handleNestedInputChange('authors', e)} />
        <label htmlFor="screenwriter_comment">Screenwriter Comment:</label>
        <input type="text" name="screenwriter_comment" id="screenwriter_comment" value={formData.authors.screenwriter_comment} onChange={(e) => handleNestedInputChange('authors', e)} />
        <label htmlFor="filmmaker">Filmmaker:</label>
        <input type="text" name="filmmaker" id="filmmaker" value={formData.authors.filmmaker} onChange={(e) => handleNestedInputChange('authors', e)} />
        <label htmlFor="filmmaker_comment">Filmmaker Comment:</label>
        <input type="text" name="filmmaker_comment" id="filmmaker_comment" value={formData.authors.filmmaker_comment} onChange={(e) => handleNestedInputChange('authors', e)} />
        <label htmlFor="executive_producer">Executive Producer:</label>
        <input type="text" name="executive_producer" id="executive_producer" value={formData.authors.executive_producer} onChange={(e) => handleNestedInputChange('authors', e)} />
        <label htmlFor="executive_producer_comment">Executive Producer Comment:</label>
        <input type="text" name="executive_producer_comment" id="executive_producer_comment" value={formData.authors.executive_producer_comment} onChange={(e) => handleNestedInputChange('authors', e)} />
      </fieldset>
      <fieldset>
        <legend>Production Team</legend>
        <label htmlFor="productionTeam">(JSON array format)</label>
        <textarea
          name="productionTeam"
          id="productionTeam"
          placeholder='Example: [{"department": "Image Technicians", "name": "John Doe", "role": "", "comment": ""}]'
          value={JSON.stringify(formData.productionTeam)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData({ ...formData, productionTeam: parsed });
            } catch {
              // Optionally, handle JSON parse errors here.
            }
          }}
        />
      </fieldset>
      <fieldset>
        <legend>Film Actors</legend>
        <label htmlFor="actors">Actors (comma-separated):</label>
        <input type="text" name="actors" id="actors" value={formData.actors} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Equipment</legend>
        <label htmlFor="equipment_name">Equipment Name:</label>
        <input type="text" name="equipment_name" id="equipment_name" value={formData.equipment.equipment_name} onChange={(e) => handleNestedInputChange('equipment', e)} />
        <label htmlFor="description">Equipment Description:</label>
        <textarea name="description" id="description" value={formData.equipment.description} onChange={(e) => handleNestedInputChange('equipment', e)} />
        <label htmlFor="comment">Equipment Comment:</label>
        <textarea name="comment" id="comment" value={formData.equipment.comment} onChange={(e) => handleNestedInputChange('equipment', e)} />
      </fieldset>
      <fieldset>
        <legend>Film Documents</legend>
        <label htmlFor="document_type">Document Type:</label>
        <input type="text" name="document_type" id="document_type" value={formData.documents.document_type} onChange={(e) => handleNestedInputChange('documents', e)} />
        <label htmlFor="file_url">File URL:</label>
        <input type="text" name="file_url" id="file_url" value={formData.documents.file_url} onChange={(e) => handleNestedInputChange('documents', e)} />
        <label htmlFor="comment">Document Comment:</label>
        <textarea name="comment" id="comment" value={formData.documents.comment} onChange={(e) => handleNestedInputChange('documents', e)} />
      </fieldset>
      <fieldset>
        <legend>Institutional & Financial Information</legend>
        <label htmlFor="production_company">Production Company:</label>
        <input type="text" name="production_company" id="production_company" value={formData.institutionalInfo.production_company} onChange={(e) => handleNestedInputChange('institutionalInfo', e)} />
        <label htmlFor="funding_company">Funding Company:</label>
        <input type="text" name="funding_company" id="funding_company" value={formData.institutionalInfo.funding_company} onChange={(e) => handleNestedInputChange('institutionalInfo', e)} />
        <label htmlFor="funding_comment">Funding Comment:</label>
        <textarea name="funding_comment" id="funding_comment" value={formData.institutionalInfo.funding_comment} onChange={(e) => handleNestedInputChange('institutionalInfo', e)} />
        <label htmlFor="source">Source:</label>
        <input type="text" name="source" id="source" value={formData.institutionalInfo.source} onChange={(e) => handleNestedInputChange('institutionalInfo', e)} />
        <label htmlFor="funding_location_id">Funding Location ID:</label>
        <input type="number" name="funding_location_id" id="funding_location_id" value={formData.institutionalInfo.funding_location_id} onChange={(e) => handleNestedInputChange('institutionalInfo', e)} />
      </fieldset>
      <fieldset>
        <legend>Film Screenings</legend>
        <label htmlFor="screening_date">Screening Date:</label>
        <input type="date" name="screening_date" id="screening_date" value={formData.screenings.screening_date} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="location_id">Screening Location ID:</label>
        <input type="number" name="location_id" id="location_id" value={formData.screenings.location_id} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="organizers">Organizers:</label>
        <input type="text" name="organizers" id="organizers" value={formData.screenings.organizers} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="format">Format:</label>
        <input type="text" name="format" id="format" value={formData.screenings.format} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="audience">Audience:</label>
        <input type="text" name="audience" id="audience" value={formData.screenings.audience} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="film_rights">Film Rights:</label>
        <input type="text" name="film_rights" id="film_rights" value={formData.screenings.film_rights} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="comment">Screening Comment:</label>
        <textarea name="comment" id="comment" value={formData.screenings.comment} onChange={(e) => handleNestedInputChange('screenings', e)} />
        <label htmlFor="source">Screening Source:</label>
        <input type="text" name="source" id="source" value={formData.screenings.source} onChange={(e) => handleNestedInputChange('screenings', e)} />
      </fieldset>
      <button type="submit" className="submit-button">{mode}</button>
    </form>
  );

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => { setActiveTab('add'); setMessage(''); setSelectedFilm(null); resetForm(); }}
        >
          Add Film
        </button>
        <button
          className={activeTab === 'update' ? 'active' : ''}
          onClick={() => { setActiveTab('update'); setMessage(''); }}
        >
          Update Film
        </button>
        <button
          className={activeTab === 'delete' ? 'active' : ''}
          onClick={() => { setActiveTab('delete'); setMessage(''); }}
        >
          Delete Film
        </button>
      </div>
      <div className="admin-content">
        {message && <p className="message">{message}</p>}
        {activeTab === 'add' && renderFilmForm('Add Film')}
        {activeTab === 'update' && (
          <>
            {!selectedFilm ? (
              <>
                <h2>Select a Film to Update</h2>
                <ul className="film-list">
                  {films.map((film) => (
                    <li key={film.film_id}>
                      {film.title}{' '}
                      <button onClick={() => handleSelectFilmForUpdate(film)} className="edit-button">
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              renderFilmForm('Update Film')
            )}
          </>
        )}
        {activeTab === 'delete' && (
          <>
            <h2>Select a Film to Delete</h2>
            <ul className="film-list">
              {films.map((film) => (
                <li key={film.film_id}>
                  {film.title}{' '}
                  <button onClick={() => handleDeleteFilm(film.film_id)} className="delete-button">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
