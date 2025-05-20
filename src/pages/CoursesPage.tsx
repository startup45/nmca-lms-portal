import React, { useState } from 'react';

const CoursesPage = () => {
  const [user, setUser] = useState(null);
  
  // This is a placeholder component that will be implemented later
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">
          Course content will be displayed here. This page is under construction.
        </p>
      </div>
    </div>
  );
};

export default CoursesPage;
