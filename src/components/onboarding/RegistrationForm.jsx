import React, { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function RegistrationForm({ onSuccess }) {
  const registerUser = useStore((state) => state.registerUser);

  // Form State matching exactly Figma fields
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    shareData: false,
  });

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Real-time validation rules
  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      const sVal = value;
      if (!sVal) error = 'Field is required';
      else if (sVal.trim().length < 3) error = 'Name must be at least 3 characters';
    }
    if (name === 'username') {
      const sVal = value;
      if (!sVal) error = 'Field is required';
      else if (sVal.includes(' ')) error = 'Username cannot contain spaces';
    }
    if (name === 'email') {
      const sVal = value;
      if (!sVal) error = 'Field is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sVal)) error = 'Invalid email format';
    }
    if (name === 'mobile') {
      const sVal = value;
      if (!sVal) error = 'Field is required';
      else if (!/^\d{10}$/.test(sVal)) error = 'Mobile must be exactly 10 digits';
    }
    if (name === 'shareData') {
      const bVal = value;
      if (!bVal) error = 'Check this box to proceed';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const err = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const currentErrors = {};
    let hasError = false;

    Object.entries(formData).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) {
        currentErrors[key] = err;
        hasError = true;
      }
    });

    setErrors(currentErrors);

    if (!hasError) {
      const newUser = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        shareData: formData.shareData,
      };
      registerUser(newUser);
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Left Column: Music Concert DJ Theme Cover */}
      <div 
        className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-cover bg-center flex flex-col justify-end p-8 md:p-16 lg:p-20 select-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%), url("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop")',
        }}
      >
        <div className="z-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-black tracking-tight leading-tight text-white mb-2">
            Discover new things on
            <br />
            Superapp
          </h2>
        </div>
      </div>

      {/* Right Column: Registration Form in Pure Black */}
      <div className="w-full md:w-1/2 h-full md:min-h-screen flex flex-col justify-center items-center bg-[#000000] px-6 py-12 md:px-12 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-[400px] flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-single-day text-[#72DB73] text-[45px] md:text-[52px] font-normal leading-none select-none tracking-tight">
              Super app
            </h1>
            <p className="text-neutral-300 text-sm md:text-[15px] font-normal tracking-wide mt-2 select-none">
              Create your new account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name Input */}
            <div>
              <input
                id="name-input"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Name"
                className={`w-full bg-[#1e1e1e] rounded-[4px] px-4 py-3.5 text-sm md:text-[15px] text-white placeholder-neutral-500 focus:outline-none transition-all duration-200 border ${
                  touched.name && errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
                }`}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* UserName Input */}
            <div>
              <input
                id="username-input"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="UserName"
                className={`w-full bg-[#1e1e1e] rounded-[4px] px-4 py-3.5 text-sm md:text-[15px] text-white placeholder-neutral-500 focus:outline-none transition-all duration-200 border ${
                  touched.username && errors.username ? 'border-red-500/80 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
                }`}
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <input
                id="email-input"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`w-full bg-[#1e1e1e] rounded-[4px] px-4 py-3.5 text-sm md:text-[15px] text-white placeholder-neutral-500 focus:outline-none transition-all duration-200 border ${
                  touched.email && errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile Input */}
            <div>
              <input
                id="mobile-input"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mobile"
                className={`w-full bg-[#1e1e1e] rounded-[4px] px-4 py-3.5 text-sm md:text-[15px] text-white placeholder-neutral-500 focus:outline-none transition-all duration-200 border ${
                  touched.mobile && errors.mobile ? 'border-red-500/80 focus:border-red-500' : 'border-transparent focus:border-[#72DB73]'
                }`}
              />
              {touched.mobile && errors.mobile && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Single Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  id="share-data-checkbox"
                  name="shareData"
                  type="checkbox"
                  checked={formData.shareData}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-4.5 w-4.5 rounded-[3px] accent-[#72DB73] bg-[#1e1e1e] border-neutral-700 cursor-pointer focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[13px] md:text-[14px] text-neutral-400 select-none leading-relaxed group-hover:text-neutral-300 transition-colors">
                  Share my registration data with Superapp
                </span>
              </label>
              {touched.shareData && errors.shareData && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.shareData}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="submit-register-btn"
              type="submit"
              className="w-full bg-[#72DB73] hover:bg-[#5ec45d] text-white font-sans font-bold text-base md:text-lg tracking-wider uppercase py-3.5 rounded-full mt-6 shadow-md shadow-[#72DB73]/15 transition-all duration-200 active:scale-[0.98] flex items-center justify-center cursor-pointer select-none"
            >
              SIGN UP
            </button>
          </form>

          {/* Figma Bottom Paragraphs */}
          <div className="space-y-4 text-[11px] md:text-[12px] text-neutral-400 leading-relaxed mt-8 font-normal">
            <p>
              By clicking on Sign up. you agree to Superapp{' '}
              <span className="text-[#72DB73] font-bold cursor-pointer hover:underline">
                Terms and Conditions of Use
              </span>
            </p>
            <p>
              To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp{' '}
              <span className="text-[#72DB73] font-bold cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
