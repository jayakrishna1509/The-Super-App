import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Action',
    title: 'Action',
    bgColor: 'bg-[#FF5C00]',
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Drama',
    title: 'Drama',
    bgColor: 'bg-[#D7A4FF]',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Romance',
    title: 'Romance',
    bgColor: 'bg-[#148A08]',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Thriller',
    title: 'Thriller',
    bgColor: 'bg-[#84C2FF]',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Western',
    title: 'Western',
    bgColor: 'bg-[#902500]',
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Horror',
    title: 'Horror',
    bgColor: 'bg-[#7358FF]',
    image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Fantasy',
    title: 'Fantasy',
    bgColor: 'bg-[#FF4ADE]',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Music',
    title: 'Music',
    bgColor: 'bg-[#E1173F]',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'Fiction',
    title: 'Fiction',
    bgColor: 'bg-[#6CD061]',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop'
  }
];

export default function CategorySelection({ onSuccess, onBack }) {
  const selectedCategoriesFromStore = useStore((state) => state.selectedCategories);
  const setCategories = useStore((state) => state.setCategories);

  const [selected, setSelected] = useState(selectedCategoriesFromStore);
  const [showError, setShowError] = useState(false);

  const toggleCategory = (catId) => {
    setShowError(false);
    if (selected.includes(catId)) {
      setSelected(selected.filter((item) => item !== catId));
    } else {
      setSelected([...selected, catId]);
    }
  };

  const handleNext = () => {
    if (selected.length < 3) {
      setShowError(true);
      return;
    }
    setCategories(selected);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between p-6 md:p-12 lg:p-16 select-none overflow-x-hidden relative">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start w-full">
        
        {/* Left Column: Heading & Selected Pills */}
        <div className="w-full lg:w-[40%] flex flex-col">
          {/* Logo */}
          <h1 className="font-single-day text-[#72DB73] text-[40px] md:text-[48px] font-normal leading-none select-none tracking-tight mb-8">
            Super app
          </h1>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-[60px] font-black leading-[1.1] tracking-tight mb-10 text-white">
            Choose your entertainment category
          </h2>

          {/* Selected pills container */}
          <div className="flex flex-wrap gap-3.5 mb-6">
            {selected.map((catId) => (
              <div
                key={catId}
                className="flex items-center gap-4 bg-[#148A08] text-white rounded-full px-5 py-2 text-[14px] font-semibold transition-all duration-200 shadow-md select-none"
              >
                <span>{catId === 'Music' ? 'Mucic' : catId}</span>
                <button
                  onClick={() => toggleCategory(catId)}
                  className="text-black font-extrabold text-[13px] hover:text-neutral-200 transition-colors cursor-pointer select-none pl-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Validation Warning matching Figma exactly */}
          {selected.length < 3 && (
            <div className="flex items-center gap-2.5 text-[#FF0000] text-[13px] font-medium mt-4 animate-fadeIn">
              <AlertTriangle size={16} className="fill-[#FF0000] text-black shrink-0" strokeWidth={2.5} />
              <span>Minimum 3 category required</span>
            </div>
          )}
          
          {showError && selected.length >= 3 && (
            <div className="text-[#FF0000] text-[13px] font-medium mt-4 animate-fadeIn">
              Please click "Next Page" to continue.
            </div>
          )}
        </div>

        {/* Right Column: Grid of Category Cards */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative aspect-[1/1.1] rounded-[16px] p-4 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 transform hover:scale-[1.02] ${cat.bgColor} ${
                  isSelected
                    ? 'border-[5px] border-[#11B800] scale-[1.01] shadow-lg'
                    : 'border-[5px] border-transparent'
                }`}
              >
                {/* Category Title */}
                <span className="text-lg md:text-[22px] font-bold tracking-tight text-white select-none">
                  {cat.title}
                </span>

                {/* Centered Thumbnail Image */}
                <div className="w-full mt-auto">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-20 sm:h-24 md:h-28 object-cover rounded-[12px] shadow-md select-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Action row */}
      <div className="w-full flex items-center justify-between mt-12 pt-6 border-t border-neutral-900/40">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          &larr; Back to Registration
        </button>

        <button
          id="next-category-btn"
          onClick={handleNext}
          className="bg-[#148A08] hover:bg-[#11B800] text-white font-sans font-bold text-sm md:text-base tracking-wide py-3 px-8 rounded-full shadow-md shadow-[#148A08]/15 transition-all duration-200 active:scale-[0.98] cursor-pointer select-none"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
