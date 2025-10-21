import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import { useAuth } from './Context/AuthContext';
import TeacherDashboard from './Components/TeacherDashboard';
import StudentDashboard from './Components/StudentDashboard';
import CodeSubmissionPage from './Components/CodeSubmissionPage';
import QuizComponent from './Components/QuizComponent';
import StudentResponseSheet from './Components/ResponseSheet';

const App = () => {
  const auth = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/dashboard"

          // element={userType && userType === "teacher" ? <TeacherDashboard/> : <StudentDashboard/>}
          // element={<TeacherDashboard />}
          element={auth?.user?.role === "teacher" ? <TeacherDashboard/> : <StudentDashboard />}
        />
        <Route path='/question/:questionId' element={<CodeSubmissionPage />} />
        <Route path='response/:submissionId' element={<StudentResponseSheet />} />
       
        {/* <Route path='/happy' element={<QuizComponent/>} /> */}
        <Route path='/questions/:questionId/ai-assessment/:submissionId' element={<QuizComponent />} />
        <Route path='/quiz' element={<QuizComponent />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path='/dash' element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;