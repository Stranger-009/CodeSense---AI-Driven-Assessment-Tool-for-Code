import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Create from './TeacherDash/Create';
import View from './TeacherDash/View';
import StudentEvaluation from './TeacherDash/StudentEvaluation';
import { useAuth } from '../Context/AuthContext';
import {toast} from 'react-hot-toast';

const TeacherDashboard = () => {
  const [activeOption, setActiveOption] = useState('create');
  const navigate = useNavigate();
  // Replace with actual user data
  const auth = useAuth();
  const username = auth?.user?.name;

  const sidebarOptions = [
    { id: 'create', label: 'Create New Question', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )},
    { id: 'view', label: 'View Previous Questions', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { id: 'evaluation', label: 'Student Evaluation', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )}
  ];

  const handleLogout = async () => {
    try{
      toast.loading("logging out");
      await auth?.logout();
      toast.dismiss();
      toast.success("logged out");
      navigate('/login');
    }catch(err){
      toast.dismiss();
      toast.error("failed");
      console.log(err);
    }
  };

  const renderContent = () => {
    switch(activeOption) {
      case 'create':
        return (
          <Create/>
        );
      case 'view':
        return (
          <View/>
        );
      case 'evaluation':
        return (
          <StudentEvaluation/>
        );
      default:
        return null;
    }
  };

  return (
    auth?.isLoggedIn ? (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">CodeSense</h1>
          </div>
          <nav className="mt-4">
            {sidebarOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveOption(option.id)}
                className={`w-full flex items-center px-6 py-3 text-left ${
                  activeOption === option.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {renderContent()}
          </main>
        </div>
      </div> 
    ) : (
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-xl mb-4">You must login to continue.</p>
          <Link to='/'>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Home
            </button>
          </Link>
        </div>
      </div>
    )
  );
};

export default TeacherDashboard;