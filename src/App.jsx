import React, { useState } from 'react';
import { useStore } from './store/useStore';
import RegistrationForm from './components/onboarding/RegistrationForm';
import CategorySelection from './components/onboarding/CategorySelection';
import UserProfileWidget from './components/dashboard/UserProfileWidget';
import WeatherWidget from './components/dashboard/WeatherWidget';
import NotesWidget from './components/dashboard/NotesWidget';
import CountdownTimerWidget from './components/dashboard/CountdownTimerWidget';
import NewsFeedWidget from './components/dashboard/NewsFeedWidget';
import MovieDiscovery from './components/movies/MovieDiscovery';

export default function App() {
  const user = useStore((state) => state.user);
  const selectedCategories = useStore((state) => state.selectedCategories);
  const clearStore = useStore((state) => state.clearStore);

  // Local navigation state for dashboard vs movies discover view
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Dashboard step state to handle Page 3 (basic) vs Page 4 (full)
  const [dashboardStep, setDashboardStep] = useState('basic');

  // STEP 1: Registration Page
  if (!user) {
    return <RegistrationForm onSuccess={() => setDashboardStep('basic')} />;
  }

  // STEP 2: Category/Genre Selection Page
  if (selectedCategories.length < 3) {
    return (
      <CategorySelection
        onSuccess={() => {
          setDashboardStep('basic');
          setCurrentView('dashboard');
        }}
        onBack={() => clearStore()}
      />
    );
  }

  // STEP 5: Entertainment Discovery Page
  if (currentView === 'movies') {
    return <MovieDiscovery onBackToDashboard={() => setCurrentView('dashboard')} />;
  }

  // STEP 3: Basic Dashboard Page (Profile + Weather + News Feed)
  if (dashboardStep === 'basic') {
    return (
      <div className="min-h-screen bg-[#000000] text-white font-sans p-6 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-x-hidden animate-fadeIn">
        {/* Dynamic atmospheric highlight */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 2-Column Grid Layout matching Page 3 */}
        <main className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-6 md:gap-8 z-10 relative flex-1 items-stretch max-w-7xl mx-auto w-full py-4">
          
          {/* COLUMN 1: Profile + Weather widgets */}
          <section className="flex flex-col gap-6 md:gap-8 justify-between">
            {/* User Profile Widget */}
            <div className="h-[280px] md:h-[300px]">
              <UserProfileWidget />
            </div>
            {/* Weather Widget */}
            <div className="flex-1 min-h-[180px]">
              <WeatherWidget />
            </div>
          </section>

          {/* COLUMN 2: News Feed Widget spans full vertical height */}
          <section className="flex flex-col h-full min-h-[450px]">
            <NewsFeedWidget />
          </section>

        </main>

        {/* BOTTOM ACTION BAR containing the "Next Page" button */}
        <div className="mt-8 flex justify-between items-center z-10 relative max-w-7xl mx-auto w-full px-2">
          {/* Option to go back to category selection if wanted */}
          <button
            onClick={() => clearStore()}
            className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            &larr; Back to Categories
          </button>

          <button
            id="to-page-4-btn"
            onClick={() => setDashboardStep('full')}
            className="bg-[#148A08] hover:bg-[#11B800] text-white font-sans font-bold text-sm md:text-base tracking-wide py-3 px-8 rounded-full shadow-md shadow-[#148A08]/15 transition-all duration-200 active:scale-[0.98] cursor-pointer select-none"
          >
            Next Page
          </button>
        </div>
      </div>
    );
  }

  // STEP 4: Primary Dashboard Page (The Bento Grid Layout matching Figma Page 4 exactly)
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans p-6 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-x-hidden animate-fadeIn">
      {/* Dynamic atmospheric highlight */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* PRIMARY BENTO GRID CONTAINER MATCHING FIGMA PAGE 4 */}
      <main className="grid grid-cols-1 lg:grid-cols-[33%_33%_34%] gap-6 md:gap-8 z-10 relative flex-1 items-stretch max-w-7xl mx-auto w-full py-4">
        
        {/* COLUMN 1: Profile + Weather widgets */}
        <section className="lg:col-start-1 lg:row-start-1 flex flex-col gap-6 md:gap-8">
          {/* User Profile Widget */}
          <div className="h-[280px] md:h-[300px] shrink-0">
            <UserProfileWidget />
          </div>
          {/* Weather Widget */}
          <div className="flex-1">
            <WeatherWidget />
          </div>
        </section>

        {/* COLUMN 2: Notes Widget (All notes) */}
        <section className="lg:col-start-2 lg:row-start-1 flex flex-col min-h-[350px] lg:h-full">
          <NotesWidget />
        </section>

        {/* BOTTOM ROW: Countdown Timer Widget spans Column 1 and 2 underneath */}
        <section className="lg:col-span-2 lg:row-start-2 flex items-stretch">
          <CountdownTimerWidget />
        </section>

        {/* COLUMN 3: News Feed Widget spans the entire vertical height on the right side */}
        <section className="lg:col-start-3 lg:row-span-2 flex flex-col h-full min-h-[450px]">
          <NewsFeedWidget />
        </section>

      </main>

      {/* BOTTOM ACTION BAR containing the Figma exact Browse button */}
      <div className="mt-8 flex justify-between items-center z-10 relative max-w-7xl mx-auto w-full px-2">
        <button
          onClick={() => setDashboardStep('basic')}
          className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          &larr; Show Basic Dashboard
        </button>

        <button
          id="discover-movies-btn"
          onClick={() => setCurrentView('movies')}
          className="bg-[#148A08] hover:bg-[#117506] text-white font-bold text-lg md:text-xl px-12 py-3 md:py-3.5 rounded-[30px] shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none"
        >
          Browse
        </button>
      </div>
    </div>
  );
}
