import React, { useState, useEffect} from 'react';
import {useDebounce} from 'react-use';
import Search from './components/Search';
import MovieCard from './components/MovieCard';
import Spinner from './components/Spinner';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',  
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = ()=>{
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageTrending, setErrorMessageTrending] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(()=>setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchMovies = async (query)=>{
    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok)
      {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if(data.Response === 'False')
        {
          setErrorMessage(data.Error || `Error fetching movies. Please try again later.`)
          setMovieList([])
          return;
        }

      setMovieList(data.results || []);

      if(query && data.results.length>0)
      {
        await updateSearchCount(query, data.results[0])
      }
    }catch(error)
    {
      console.log(error)
      setErrorMessage(`Error fetching movies. Please try again later.`)
    }finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () =>{
    setIsLoadingTrending(true)
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    }catch(error)
    {
      console.error(`Error Fetching Trending Movies: ${error}`)
      setErrorMessageTrending(`Error Fetching Trending Movies.`)
    }finally{
      setIsLoadingTrending(false)
    }
  }

  useEffect(()=>{
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])
  
  useEffect(()=>{
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern"/>
      
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="hero banner" />
          <h1 >Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {isLoadingTrending ? (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <Spinner />
          </section>
        ): errorMessageTrending ? (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <p className='text-red-500 my-10'>{errorMessageTrending}</p>
          </section>
        ):
        trendingMovies.length>0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index)=>(
                <li className='cursor-pointer' key={movie.$id}>
                  <p>{index+1}</p>
                  <img className="pointer-events-none" src={movie.poster_url} alt="" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>Popular Movies</h2>

          {isLoading ? (
            <Spinner />
          ):errorMessage ?(
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App