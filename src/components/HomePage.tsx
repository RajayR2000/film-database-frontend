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

  const handleExportCSV = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to export data.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3001/films/full", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
  
      if (!res.ok) throw new Error("Failed to fetch films");
  
      const data = await res.json();
      const films = data.films;
  
      const flat = films.map((film: any) => {
        const authorMap: Record<string, string> = {};
        (film.authors || []).forEach((a: any) => {
          if (a?.role && a?.name) {
            const key = a.role.toLowerCase().replace(/\s+/g, "_");
            authorMap[key] = a.name;
          }
        });
  
        const teamMap: Record<string, string> = {};
        (film.team || []).forEach((t: any) => {
          if (t?.department && t?.name) {
            const key = t.department.toLowerCase().replace(/\s+/g, "_");
            teamMap[key] = teamMap[key] ? `${teamMap[key]}; ${t.name}` : t.name;
          }
        });
  
        const actors = (film.actors || [])
          .map((a: any) => a.actor_name + (a.character_name ? ` as ${a.character_name}` : ""))
          .join("; ");
  
        const equipment = (film.equipment || [])
          .map((e: any) => e.equipment_name + (e.description ? ` (${e.description})` : ""))
          .join("; ");
  
        const documents = (film.documents || [])
          .map((d: any) => `${d.document_type}: ${d.file_url}`)
          .join("; ");
  
        const institutions = (film.institutional_info || [])
          .map((i: any) => `${i.production_company} / ${i.funding_company}`)
          .join("; ");
  
        const screenings = (film.screenings || [])
          .map((s: any) => `${s.screening_date} - ${s.organizers} (${s.format})`)
          .join("; ");
  
        return {
          film_id: film.film_id,
          title: film.title,
          release_year: film.release_year,
          runtime: film.runtime,
          synopsis: film.synopsis,
          created_at: film.created_at,
          updated_at: film.updated_at,
  
          production_timeframe: film.production_timeframe,
          post_production_studio: film.post_production_studio,
          production_comments: film.production_comments,
  
          location_name: film.location_name,
          location_address: film.location_address,
          location_city: film.location_city,
          location_state: film.location_state,
          location_country: film.location_country,
          location_latitude: film.location_latitude,
          location_longitude: film.location_longitude,
          location_comment: film.location_comment,
  
          actors,
          equipment,
          documents,
          institutions,
          screenings,
  
          ...authorMap,
          ...teamMap
        };
      });
  
      const csv = [
        Object.keys(flat[0]).join(","),
        ...flat.map((row: Record<string, any>) =>
          Object.values(row).map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(",")
        )
      ].join("\n");
  
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "films_full_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV.");
    }
  };
  
  
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
        {/* <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="year">Year</option>
          <option value="genre">Genre</option>
          <option value="popularity">Popularity</option>
        </select> */}
        <button className="export-btn" onClick={handleExportCSV}>
    Export as CSV
  </button>
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
