import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';

interface Film {
  film_id: number;
  title: string;
  release_year: number;
  runtime: string;
  synopsis: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [films, setFilms] = useState<Film[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    runtime: '',
    synopsis: '',
  });
  const [message, setMessage] = useState('');

  // Fetch films for update and delete modes
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

  // Handle add or update submission
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
        setFormData({ title: '', release_year: '', runtime: '', synopsis: '' });
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
        setFormData({ title: '', release_year: '', runtime: '', synopsis: '' });
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

  const handleSelectFilmForUpdate = (film: Film) => {
    setSelectedFilm(film);
    setFormData({
      title: film.title,
      release_year: film.release_year.toString(),
      runtime: film.runtime,
      synopsis: film.synopsis,
    });
    setActiveTab('update');
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveTab('add');
            setMessage('');
            setSelectedFilm(null);
          }}
        >
          Add Film
        </button>
        <button
          className={activeTab === 'update' ? 'active' : ''}
          onClick={() => {
            setActiveTab('update');
            setMessage('');
          }}
        >
          Update Film
        </button>
        <button
          className={activeTab === 'delete' ? 'active' : ''}
          onClick={() => {
            setActiveTab('delete');
            setMessage('');
          }}
        >
          Delete Film
        </button>
      </div>
      <div className="admin-content">
        {message && <p className="message">{message}</p>}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="admin-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="release_year"
              placeholder="Release Year"
              value={formData.release_year}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="runtime"
              placeholder="Runtime"
              value={formData.runtime}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="synopsis"
              placeholder="Synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="submit-button">
              Add Film
            </button>
          </form>
        )}
        {activeTab === 'update' && (
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
            {selectedFilm && (
              <form onSubmit={handleSubmit} className="admin-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="release_year"
                  placeholder="Release Year"
                  value={formData.release_year}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="runtime"
                  placeholder="Runtime"
                  value={formData.runtime}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="synopsis"
                  placeholder="Synopsis"
                  value={formData.synopsis}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" className="submit-button">
                  Update Film
                </button>
              </form>
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
