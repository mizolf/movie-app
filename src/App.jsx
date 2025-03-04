import { useEffect, useState } from 'react'
import React from 'react'
import { Search }  from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTY1MTY3YzRlMjhlNjhhYjdlNTFkMjQ0MGJmYzVkZCIsIm5iZiI6MTc0MDk0NTg0OS40MDIsInN1YiI6IjY3YzRiOWI5ZWNlMDFjZWRhMWU3NDk1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NMuOJ6wKdFEkK7P0YeTuk3fcM9w9OKc1p1vponK3y04'
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try { 
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const response = await fetch(endpoint, options);

      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
      }

      setMovieList(data.results || []);

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
              <ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )
          }
        </section>
      </div>
    </main>
  )
}

export default App