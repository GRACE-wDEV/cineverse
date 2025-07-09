
const App = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [deboucedSearchTerm, setDeboucedSearchTerm] = useState('');

  useDebounce(()=>setDeboucedSearchTerm(searchTerm), 1000, [searchTerm])
  
  const fetchMovies = async (query = '')=>{
    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query ?
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=true`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok)
      {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [])
      
      if(query && data.results.length>0)
      {
        await updateSearchCount(query, data.results[0])
      }
    }catch (error)
    {
      console.error(`Error Fetching Movies: ${error}`)
      setErrorMessage(`Error fetching movies. Please try again later.`)
    } finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async ()=>{
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    }catch (error)
    {
      console.error(`Error fetching trending movies: ${error}`)
    }
  }

  useEffect(() => {
    fetchMovies(deboucedSearchTerm);
  }, [deboucedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
        </header>

        {trendingMovies.length>0 &&(
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index=0)=>(
                <li className='cursor-pointer' key={movie.$id}>
                  <p>{index + 1}</p>
                  <img className='pointer-events-none' src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2 >Popular Movies</h2>

          {IsLoading ? (
            <Spinner />
          ):errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;