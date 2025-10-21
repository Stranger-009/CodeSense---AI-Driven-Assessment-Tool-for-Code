import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CodeSense</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4 items-center">
              <a href="#about" className="text-gray-600 hover:text-blue-600 px-3 py-2">
                About
              </a>
              <button
                className="px-4 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Transform Your</span>
            <span className="block text-blue-600">Coding Education</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Empower your educational institution with an intelligent coding platform.
            Seamlessly manage assignments, evaluate code, and ensure authentic learning.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <button
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards remain the same */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;