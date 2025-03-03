import { useEffect, useState } from 'react'
import React from 'react'
import { Search }  from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try { 
      const endpoint = `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
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
    fetchMovies();
  }, []);

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