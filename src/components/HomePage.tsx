import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import MovieCard from './MovieCard';

interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  director: string;
  genre: string;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('year');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 12;

  useEffect(() => {
    // Fetch movies from the backend API
    fetch('http://localhost:3000/films')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        // Map backend film record to our Movie interface.
        // Adjust field names based on your backend response.
        const fetchedMovies: Movie[] = data.films.map((film: any) => ({
          id: film.film_id.toString(),
          title: film.title,
          year: film.release_year,
          // If your film record doesn’t have a posterUrl, generate one using Picsum Photos
          posterUrl: film.posterUrl || `https://picsum.photos/seed/movie-${film.film_id}/300/450`,
          // Use backend fields if available, otherwise fallback to default values.
          director: film.director || 'Unknown Director',
          genre: film.genre || 'Drama',
        }));
        setMovies(fetchedMovies);
      })
      .catch((err) => {
        console.error('Error fetching films:', err);
      });
  }, []);

  // Filter movies based on search input
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.year.toString().includes(searchTerm)
  );

  // Sort movies (dummy logic for popularity; adjust as needed)
  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortOption === 'year') return a.year - b.year;
    if (sortOption === 'genre') return a.genre.localeCompare(b.genre);
    if (sortOption === 'popularity') return a.id.localeCompare(b.id);
    return 0;
  });

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

  return (
    <div className="home-page">
      <div className="search-sort">
        <input 
          type="text" 
          placeholder="Search by title, director, genre, or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="year">Year</option>
          <option value="genre">Genre</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
      <div className="movie-grid">
        {currentMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i + 1}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
