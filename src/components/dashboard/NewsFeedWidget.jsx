import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const FALLBACK_NEWS = [
  {
    title: "Want to climb Mount Everest?",
    description: "In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world's highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the......",
    url: "https://news.google.com",
    urlToImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    source: "2-20-2023",
    publishedAt: "07:35 PM"
  },
  {
    title: "Dune: Part Two Dominates Global Box Office with Spectacular Visuals",
    description: "Denis Villeneuve's sci-fi epic matches monumental critical praise with massive commercial success, driving cinema audiences worldwide to return to theatres in record-breaking fashion.",
    url: "https://news.google.com",
    urlToImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    source: "2-21-2023",
    publishedAt: "10:15 AM"
  },
  {
    title: "The Renaissance of Vinyl: How Analog is Overwhelming Streams",
    description: "Vinyl record production reaches standard highs as music purists and younger generations purchase physical albums in search of depth and tactile engagement, altering studio priorities.",
    url: "https://news.google.com",
    urlToImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    source: "2-22-2023",
    publishedAt: "04:20 PM"
  }
];

export default function NewsFeedWidget() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeState, setFadeState] = useState('in');

  const slideTimerRef = useRef(null);

  // Fetch Live Headlines, falling back nicely to preserve Everest first
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/entertainment/us.json');
      if (!res.ok) throw new Error('Failed to retrieve news.');
      
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        const liveArticles = data.articles
          .filter((art) => art.title && art.description && art.urlToImage)
          .map((art) => ({
            title: art.title,
            description: art.description,
            url: art.url,
            urlToImage: art.urlToImage,
            source: 'News',
            publishedAt: 'Today'
          }));

        // Put Everest as the first element to match the Figma on load, then insert live ones!
        setArticles([FALLBACK_NEWS[0], ...liveArticles.slice(0, 8)]);
      } else {
        setArticles(FALLBACK_NEWS);
      }
    } catch (err) {
      console.warn('News API fetch failed, loading curated news feed:', err);
      setArticles(FALLBACK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Auto Slider Logic
  useEffect(() => {
    if (loading || articles.length === 0 || isPaused) return;

    slideTimerRef.current = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
        setFadeState('in');
      }, 300);
    }, 4500); // 4.5s for comfortable reading

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [loading, articles, isPaused]);

  // Handle navigation
  const navigateSlide = (e, dir) => {
    e.stopPropagation();
    setFadeState('out');
    setTimeout(() => {
      if (dir === 'prev') {
        setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
      } else {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }
      setFadeState('in');
    }, 200);
  };

  if (loading || articles.length === 0) {
    return (
      <div className="bg-white rounded-[30px] h-full overflow-hidden animate-pulse flex flex-col">
        <div className="h-2/3 bg-neutral-200" />
        <div className="h-1/3 bg-white p-6 space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-6 bg-neutral-200 rounded w-full" />
        </div>
      </div>
    );
  }

  const activeArticle = articles[currentIndex];

  // Format dynamic dates if it's dynamic, else preserve exact Figma labels
  const dateLabel = activeArticle.source === '2-20-2023' ? '2-20-2023' : activeArticle.source;
  const timeLabel = activeArticle.publishedAt === '07:35 PM' ? '07:35 PM' : activeArticle.publishedAt;

  return (
    <div
      onClick={() => {
        // Clicking the card advances it automatically
        setFadeState('out');
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % articles.length);
          setFadeState('in');
        }, 200);
      }}
      className="bg-white rounded-[30px] h-full flex flex-col overflow-hidden text-neutral-800 shadow-2xl relative select-none cursor-pointer group/card border border-neutral-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Half: Image with overlay text box */}
      <div className="relative h-[55%] w-full overflow-hidden shrink-0">
        <img
          src={activeArticle.urlToImage}
          alt={activeArticle.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-300 transform group-hover/card:scale-102 ${
            fadeState === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop";
          }}
        />

        {/* Semi-transparent Dark Overlay Box covering bottom portion of image */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] px-6 py-5 flex flex-col justify-end text-white select-none">
          {/* Main Title */}
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight leading-snug line-clamp-2 select-none">
            {activeArticle.title}
          </h2>
          {/* Date & Time */}
          <p className="text-[12px] md:text-sm text-neutral-300 font-medium tracking-wide mt-2 select-none">
            {dateLabel} | {timeLabel}
          </p>
        </div>

        {/* Hover-only manual sliders inside the card */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => navigateSlide(e, 'prev')}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer select-none"
            title="Previous Article"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={(e) => navigateSlide(e, 'next')}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer select-none"
            title="Next Article"
          >
            <ChevronRight size={13} />
          </button>
          <div className="bg-black/60 text-white px-2 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
            {isPaused ? <Pause size={7} /> : <Play size={7} className="animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Bottom Half: Clean white section with high quality description text */}
      <div className="flex-1 p-6 md:p-8 bg-white flex flex-col justify-start overflow-y-auto">
        <p className="text-neutral-600 text-xs md:text-sm font-normal leading-relaxed text-left font-sans select-none">
          {activeArticle.description}
        </p>
      </div>
    </div>
  );
}
