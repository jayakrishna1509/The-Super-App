import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { LOCAL_MOVIES } from '../../constants/moviesData';
import { Calendar, Clock, Users, X, Key, ArrowLeft } from 'lucide-react';

export default function MovieDiscovery({ onBackToDashboard }) {
  const selectedCategories = useStore((state) => state.selectedCategories);
  const user = useStore((state) => state.user);

  // States
  const [movies, setMovies] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [omdbApiKey, setOmdbApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Exact high-contrast gaming/music character avatar matching the figma
  const avatarUrl = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop';

  // Load movies categorized by the user's selected categories
  useEffect(() => {
    loadCategorizedMovies();
  }, [selectedCategories]);

  const loadCategorizedMovies = async (keyToUse = '') => {
    setLoading(true);
    const categorized = {};

    for (const cat of selectedCategories) {
      if (keyToUse) {
        // Fetch from real OMDB API
        try {
          const searchKeyword = cat === 'Fiction' ? 'scifi' : cat.toLowerCase();
          const response = await fetch(`https://www.omdbapi.com/?s=${searchKeyword}&type=movie&apikey=${keyToUse}`);
          const data = await response.json();

          if (data.Response === 'True' && data.Search) {
            // Fetch detailed specifications for the first 4 movies
            const detailsList = [];
            for (const item of data.Search.slice(0, 4)) {
              const detailRes = await fetch(`https://www.omdbapi.com/?i=${item.imdbID}&apikey=${keyToUse}`);
              const detailed = await detailRes.json();
              
              if (detailed && detailed.Response !== 'False') {
                detailsList.push({
                  imdbID: detailed.imdbID,
                  Title: detailed.Title,
                  Year: detailed.Year,
                  Poster: detailed.Poster !== 'N/A' ? detailed.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop',
                  Plot: detailed.Plot !== 'N/A' ? detailed.Plot : 'No plot synopsis available.',
                  Genre: detailed.Genre,
                  Runtime: detailed.Runtime,
                  Actors: detailed.Actors,
                  Ratings: detailed.Ratings || [],
                  Released: detailed.Released,
                  Category: cat,
                });
              }
            }
            categorized[cat] = detailsList;
          } else {
            throw new Error(data.Error || `Could not find movies for ${cat}`);
          }
        } catch (err) {
          console.warn(`OMDB API failed for category "${cat}", falling back to local:`, err);
          categorized[cat] = LOCAL_MOVIES.filter((m) => m.Category === cat);
        }
      } else {
        // Default: filter from local curated dataset
        categorized[cat] = LOCAL_MOVIES.filter((m) => m.Category === cat);
      }
    }

    setMovies(categorized);
    setLoading(false);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    if (omdbApiKey.trim()) {
      loadCategorizedMovies(omdbApiKey.trim());
      setShowKeyInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-10 lg:p-12 xl:p-16 select-none relative overflow-x-hidden">
      {/* Subtle atmospheric glow in background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#72DB73]/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION - EXACT RECONSTRUCTION */}
      <header className="flex items-center justify-between w-full mb-6 z-10 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToDashboard}
            className="text-neutral-400 hover:text-[#72DB73] transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer flex items-center justify-center"
            title="Go to Dashboard"
          >
            <ArrowLeft size={24} />
          </button>
          
          <h1 className="font-single-day text-[#72DB73] text-[36px] md:text-[44px] font-normal leading-none tracking-tight select-none">
            Super app
          </h1>
        </div>

        {/* Profile Avatar Button on Right */}
        <button
          onClick={onBackToDashboard}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3.5px] border-[#72DB73] overflow-hidden shrink-0 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all"
          title="Go to Dashboard"
        >
          <img
            src={avatarUrl}
            alt={user?.name || "Avatar"}
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        </button>
      </header>

      {/* SUBTITLE */}
      <div className="mb-10 z-10 relative">
        <h2 className="text-xl md:text-2xl font-sans font-medium text-white tracking-normal leading-tight">
          Entertainment according to your choice
        </h2>
      </div>

      {/* API KEY INPUT PANEL (Optional/Muted so it doesn't clutter Page 5 design) */}
      {showKeyInput && (
        <form onSubmit={handleSaveApiKey} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 mb-8 max-w-md animate-slideDown z-20 relative">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-[#72DB73]">
            <Key size={14} />
            Connect OMDB API
          </h3>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Enter an OMDB API key to search and recommend live movie titles. If left blank, the app runs smoothly using the local, curated database.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={omdbApiKey}
              onChange={(e) => setOmdbApiKey(e.target.value)}
              placeholder="e.g. 5f23bc11"
              className="flex-1 bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:border-[#72DB73] outline-none"
            />
            <button
              type="submit"
              className="bg-[#72DB73] hover:bg-[#5fc560] text-black font-extrabold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Apply Key
            </button>
          </div>
        </form>
      )}

      {/* CATEGORIZED SECTIONS MOVIE CATALOG */}
      {loading ? (
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-6 bg-white/5 rounded w-1/6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="aspect-[16/10] bg-white/5 rounded-[20px]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {selectedCategories.map((cat) => {
            const list = movies[cat] || [];
            if (list.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                {/* Category Title Header - exact simple gray style */}
                <h3 className="text-[#878787] text-[18px] md:text-[22px] font-sans font-medium tracking-wide block select-none">
                  {cat === 'Music' ? 'Mucic' : cat}
                </h3>

                {/* Movie Grid - exact 4 column landscape grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
                  {list.map((movie) => (
                    <div
                      key={movie.imdbID}
                      onClick={() => setSelectedMovie(movie)}
                      className="bg-neutral-900 rounded-[16px] md:rounded-[20px] overflow-hidden border border-transparent hover:border-[#72DB73]/50 shadow-md transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] group cursor-pointer select-none relative aspect-[16/10]"
                    >
                      {/* Movie Poster Image - Horizontal landscape layout */}
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop";
                        }}
                      />

                      {/* Smooth dark vignette and subtitle hover display for extreme usability */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end min-h-[40%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-mono text-[#72DB73] font-bold uppercase tracking-wider mb-0.5">
                          {movie.Year}
                        </span>
                        <h4 className="text-xs md:text-sm font-bold tracking-tight text-white line-clamp-1">
                          {movie.Title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER OPTION TRIGGERS */}
      <div className="mt-16 flex items-center justify-between border-t border-neutral-900 pt-6 text-xs text-neutral-500 z-10 relative">
        <span>© Superapp Entertainment Inc.</span>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Key size={12} />
          <span>Configure API Key</span>
        </button>
      </div>

      {/* DETAIL MODAL OVERLAY */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[24px] overflow-hidden max-w-4xl w-full shadow-2xl relative my-8 animate-scaleIn flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
            {/* Close Button overlay */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white rounded-full p-2 border border-white/10 transition-all cursor-pointer z-20"
              title="Close modal"
            >
              <X size={18} />
            </button>

            {/* Poster column */}
            <div className="w-full md:w-[45%] aspect-[16/10] md:aspect-auto relative bg-neutral-950 shrink-0">
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-neutral-900" />
            </div>

            {/* Information column */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Genre pills / metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-neutral-400">
                  <span className="bg-[#72DB73]/10 text-[#72DB73] border border-[#72DB73]/20 px-3 py-1 rounded-full text-[10px] uppercase">
                    {selectedMovie.Category}
                  </span>
                  <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
                    <span>{selectedMovie.Year}</span>
                  </div>
                  {selectedMovie.Runtime && selectedMovie.Runtime !== 'N/A' && (
                    <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
                      <Clock size={12} className="text-neutral-500" />
                      <span>{selectedMovie.Runtime}</span>
                    </div>
                  )}
                </div>

                {/* Movie Title */}
                <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white pr-6">
                  {selectedMovie.Title}
                </h2>

                {/* Plot Summary */}
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                  {selectedMovie.Plot}
                </p>

                {/* Actors lists */}
                {selectedMovie.Actors && selectedMovie.Actors !== 'N/A' && (
                  <div className="border-t border-neutral-800 pt-3 space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2 text-neutral-200 font-bold uppercase tracking-wider text-[10px]">
                      <Users size={12} className="text-[#72DB73]" />
                      <span>Starring</span>
                    </div>
                    <p className="font-light">{selectedMovie.Actors}</p>
                  </div>
                )}
              </div>

              {/* Ratings and reviews section */}
              {selectedMovie.Ratings && selectedMovie.Ratings.length > 0 && (
                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold block mb-2.5">
                    Ratings & Reviews
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedMovie.Ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-neutral-400 truncate pr-2">
                          {rating.Source}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#72DB73] shrink-0">
                          {rating.Value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
