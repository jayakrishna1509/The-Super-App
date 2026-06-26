import React from 'react';
import { useStore } from '../../store/useStore';

export default function UserProfileWidget() {
  const user = useStore((state) => state.user);
  const selectedCategories = useStore((state) => state.selectedCategories);

  if (!user) return null;

  // Exact high-contrast gaming/music character avatar matching the figma
  const avatarUrl = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop';

  return (
    <div className="bg-[#5746AF] rounded-[30px] p-6 md:p-8 flex flex-row gap-6 md:gap-8 items-center text-white h-full relative overflow-hidden shadow-2xl select-none">
      {/* Capsule-shaped white-bordered Avatar container */}
      <div className="w-[110px] md:w-[130px] h-[170px] md:h-[195px] rounded-[100px] border-[4px] border-white overflow-hidden shrink-0 shadow-lg relative bg-neutral-900">
        <img
          src={avatarUrl}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Profile info on the right */}
      <div className="flex-1 flex flex-col justify-between h-full py-1">
        <div>
          {/* User Full Name */}
          <h3 className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white select-none">
            {user.name}
          </h3>
          {/* User Email */}
          <p className="text-xs md:text-sm text-neutral-300 font-normal mt-0.5 select-none">
            {user.email}
          </p>
          {/* Large username display - matching "vinay060" */}
          <h2 className="text-3xl md:text-[42px] font-bold font-sans tracking-tight leading-none text-white mt-3 select-none">
            {user.username}
          </h2>
        </div>

        {/* Selected categories pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="bg-[#9A8BFF] text-white text-[12px] md:text-[13px] font-medium px-4 py-1.5 rounded-full select-none shadow-sm"
            >
              {cat === 'Music' ? 'Mucic' : cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
