import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';

interface Film {
  film_id: number;
  title: string;
  release_year: number;
  runtime: string;
  synopsis: string;
  // In a real app, you might have additional fields here
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [message, setMessage] = useState('');

  // Form data state including all fields from the DB schema
  const [formData, setFormData] = useState({
    // Film Information
    title: '',
    release_year: '',
    runtime: '',
    synopsis: '',
    // Production Details
    production_timeframe: '',
    shooting_location: '',
    post_production_studio: '',
    production_comments: '',
    // Film Authors
    screenwriter: '',
    filmmaker: '',
    executive_producer: '',
    // Production Team
    image_technicians: '',
    sound_technicians: '',
    film_editor: '',
    music_sound_designers: '',
    // Film Actors (comma-separated)
    actors: '',
    // Film Equipment
    equipment_name: '',
    equipment_description: '',
    equipment_comment: '',
    // Film Documents
    document_type: '',
    file_url: '',
    document_comment: '',
    // Institutional & Financial Information
    production_company: '',
    funding_company: '',
    funding_comment: '',
    source: '',
    funding_location: '',
    // Film Screenings
    screening_date: '',
    screening_location: '',
    organizers: '',
    format: '',
    audience: '',
    film_rights: '',
    screening_comment: '',
    screening_source: '',
  });

  // Fetch films (for update and delete modes)
  const fetchFilms = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/films');
      const data = await res.json();
      setFilms(data.films);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      release_year: '',
      runtime: '',
      synopsis: '',
      production_timeframe: '',
      shooting_location: '',
      post_production_studio: '',
      production_comments: '',
      screenwriter: '',
      filmmaker: '',
      executive_producer: '',
      image_technicians: '',
      sound_technicians: '',
      film_editor: '',
      music_sound_designers: '',
      actors: '',
      equipment_name: '',
      equipment_description: '',
      equipment_comment: '',
      document_type: '',
      file_url: '',
      document_comment: '',
      production_company: '',
      funding_company: '',
      funding_comment: '',
      source: '',
      funding_location: '',
      screening_date: '',
      screening_location: '',
      organizers: '',
      format: '',
      audience: '',
      film_rights: '',
      screening_comment: '',
      screening_source: '',
    });
  };

  // Common submit handler for both add and update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFilm) {
      // Update film
      try {
        const res = await fetch(`http://localhost:3001/films/${selectedFilm.film_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update film');
        setMessage('Film updated successfully!');
        setSelectedFilm(null);
        resetForm();
        fetchFilms();
      } catch (error: any) {
        setMessage(error.message);
      }
    } else {
      // Add film
      try {
        const res = await fetch('http://localhost:3001/films', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to add film');
        setMessage('Film added successfully!');
        resetForm();
        fetchFilms();
      } catch (error: any) {
        setMessage(error.message);
      }
    }
  };

  const handleDeleteFilm = async (filmId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/films/${filmId}`, {
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
      const res = await fetch(`http://localhost:3001/films/${film.film_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch full film details');
      }
      const data = await res.json();
      // Map the full details from the backend to your formData structure.
      // For production, you might want to handle multiple rows for fields like productionDetails,
      // authors, etc. Here we assume a simplified mapping.
      setFormData({
        title: data.film.title || '',
        release_year: data.film.release_year ? data.film.release_year.toString() : '',
        runtime: data.film.runtime || '',
        synopsis: data.film.synopsis || '',
        production_timeframe: data.productionDetails ? data.productionDetails.production_timeframe || '' : '',
        shooting_location: data.productionDetails ? data.productionDetails.shooting_location || '' : '',
        post_production_studio: data.productionDetails ? data.productionDetails.post_production_studio || '' : '',
        production_comments: data.productionDetails ? data.productionDetails.production_comments || '' : '',
        screenwriter: (data.authors.find((a: any) => a.role === 'Screenwriter') || {}).name || '',
        filmmaker: (data.authors.find((a: any) => a.role === 'Filmmaker') || {}).name || '',
        executive_producer: (data.authors.find((a: any) => a.role === 'Executive Producer') || {}).name || '',
        // For production team, we can leave empty or join names if desired:
        image_technicians: '', // You might join array values if available.
        sound_technicians: '',
        film_editor: '',
        music_sound_designers: '',
        actors: data.actors ? data.actors.map((a: any) => a.actor_name).join(', ') : '',
        equipment_name: data.equipment && data.equipment.length > 0 ? data.equipment[0].equipment_name || '' : '',
        equipment_description: data.equipment && data.equipment.length > 0 ? data.equipment[0].description || '' : '',
        equipment_comment: data.equipment && data.equipment.length > 0 ? data.equipment[0].comment || '' : '',
        document_type: data.documents && data.documents.length > 0 ? data.documents[0].document_type || '' : '',
        file_url: data.documents && data.documents.length > 0 ? data.documents[0].file_url || '' : '',
        document_comment: data.documents && data.documents.length > 0 ? data.documents[0].comment || '' : '',
        production_company: data.institutionalInfo ? data.institutionalInfo.production_company || '' : '',
        funding_company: data.institutionalInfo ? data.institutionalInfo.funding_company || '' : '',
        funding_comment: data.institutionalInfo ? data.institutionalInfo.funding_comment || '' : '',
        source: data.institutionalInfo ? data.institutionalInfo.source || '' : '',
        funding_location: data.institutionalInfo ? data.institutionalInfo.funding_location || '' : '',
        screening_date: data.screenings && data.screenings.length > 0 ? data.screenings[0].screening_date || '' : '',
        screening_location: data.screenings && data.screenings.length > 0 ? data.screenings[0].screening_location || '' : '',
        organizers: data.screenings && data.screenings.length > 0 ? data.screenings[0].organizers || '' : '',
        format: data.screenings && data.screenings.length > 0 ? data.screenings[0].format || '' : '',
        audience: data.screenings && data.screenings.length > 0 ? data.screenings[0].audience || '' : '',
        film_rights: data.screenings && data.screenings.length > 0 ? data.screenings[0].film_rights || '' : '',
        screening_comment: data.screenings && data.screenings.length > 0 ? data.screenings[0].screening_comment || '' : '',
        screening_source: data.screenings && data.screenings.length > 0 ? data.screenings[0].screening_source || '' : '',
      });
      setSelectedFilm(film);
      setActiveTab('update');
    } catch (error: any) {
      setMessage(error.message);
    }
  };
  

  // Unified form component used for both Add and Update operations.
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
        <input type="text" name="production_timeframe" id="production_timeframe" value={formData.production_timeframe} onChange={handleInputChange} />
        <label htmlFor="shooting_location">Shooting Location:</label>
        <input type="text" name="shooting_location" id="shooting_location" value={formData.shooting_location} onChange={handleInputChange} />
        <label htmlFor="post_production_studio">Post-Production Studio:</label>
        <input type="text" name="post_production_studio" id="post_production_studio" value={formData.post_production_studio} onChange={handleInputChange} />
        <label htmlFor="production_comments">Production Comments:</label>
        <textarea name="production_comments" id="production_comments" value={formData.production_comments} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Authors</legend>
        <label htmlFor="screenwriter">Screenwriter:</label>
        <input type="text" name="screenwriter" id="screenwriter" value={formData.screenwriter} onChange={handleInputChange} />
        <label htmlFor="filmmaker">Filmmaker:</label>
        <input type="text" name="filmmaker" id="filmmaker" value={formData.filmmaker} onChange={handleInputChange} />
        <label htmlFor="executive_producer">Executive Producer:</label>
        <input type="text" name="executive_producer" id="executive_producer" value={formData.executive_producer} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Production Team</legend>
        <label htmlFor="image_technicians">Image Technicians (comma-separated):</label>
        <input type="text" name="image_technicians" id="image_technicians" value={formData.image_technicians} onChange={handleInputChange} />
        <label htmlFor="sound_technicians">Sound Technicians (comma-separated):</label>
        <input type="text" name="sound_technicians" id="sound_technicians" value={formData.sound_technicians} onChange={handleInputChange} />
        <label htmlFor="film_editor">Film Editor:</label>
        <input type="text" name="film_editor" id="film_editor" value={formData.film_editor} onChange={handleInputChange} />
        <label htmlFor="music_sound_designers">Music & Sound Designers (comma-separated):</label>
        <input type="text" name="music_sound_designers" id="music_sound_designers" value={formData.music_sound_designers} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Actors</legend>
        <label htmlFor="actors">Actors (comma-separated):</label>
        <input type="text" name="actors" id="actors" value={formData.actors} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Equipment</legend>
        <label htmlFor="equipment_name">Equipment Name:</label>
        <input type="text" name="equipment_name" id="equipment_name" value={formData.equipment_name} onChange={handleInputChange} />
        <label htmlFor="equipment_description">Equipment Description:</label>
        <textarea name="equipment_description" id="equipment_description" value={formData.equipment_description} onChange={handleInputChange} />
        <label htmlFor="equipment_comment">Equipment Comment:</label>
        <textarea name="equipment_comment" id="equipment_comment" value={formData.equipment_comment} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Documents</legend>
        <label htmlFor="document_type">Document Type:</label>
        <input type="text" name="document_type" id="document_type" value={formData.document_type} onChange={handleInputChange} />
        <label htmlFor="file_url">File URL:</label>
        <input type="text" name="file_url" id="file_url" value={formData.file_url} onChange={handleInputChange} />
        <label htmlFor="document_comment">Document Comment:</label>
        <textarea name="document_comment" id="document_comment" value={formData.document_comment} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Institutional & Financial Information</legend>
        <label htmlFor="production_company">Production Company:</label>
        <input type="text" name="production_company" id="production_company" value={formData.production_company} onChange={handleInputChange} />
        <label htmlFor="funding_company">Funding Company:</label>
        <input type="text" name="funding_company" id="funding_company" value={formData.funding_company} onChange={handleInputChange} />
        <label htmlFor="funding_comment">Funding Comment:</label>
        <textarea name="funding_comment" id="funding_comment" value={formData.funding_comment} onChange={handleInputChange} />
        <label htmlFor="source">Source:</label>
        <input type="text" name="source" id="source" value={formData.source} onChange={handleInputChange} />
        <label htmlFor="funding_location">Funding Location:</label>
        <input type="text" name="funding_location" id="funding_location" value={formData.funding_location} onChange={handleInputChange} />
      </fieldset>
      <fieldset>
        <legend>Film Screenings</legend>
        <label htmlFor="screening_date">Screening Date:</label>
        <input type="date" name="screening_date" id="screening_date" value={formData.screening_date} onChange={handleInputChange} />
        <label htmlFor="screening_location">Screening Location:</label>
        <input type="text" name="screening_location" id="screening_location" value={formData.screening_location} onChange={handleInputChange} />
        <label htmlFor="organizers">Organizers:</label>
        <input type="text" name="organizers" id="organizers" value={formData.organizers} onChange={handleInputChange} />
        <label htmlFor="format">Format:</label>
        <input type="text" name="format" id="format" value={formData.format} onChange={handleInputChange} />
        <label htmlFor="audience">Audience:</label>
        <input type="text" name="audience" id="audience" value={formData.audience} onChange={handleInputChange} />
        <label htmlFor="film_rights">Film Rights:</label>
        <input type="text" name="film_rights" id="film_rights" value={formData.film_rights} onChange={handleInputChange} />
        <label htmlFor="screening_comment">Screening Comment:</label>
        <textarea name="screening_comment" id="screening_comment" value={formData.screening_comment} onChange={handleInputChange} />
        <label htmlFor="screening_source">Screening Source:</label>
        <input type="text" name="screening_source" id="screening_source" value={formData.screening_source} onChange={handleInputChange} />
      </fieldset>
      <button type="submit" className="submit-button">
        {mode}
      </button>
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
