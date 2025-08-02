import React from 'react';

const Landing = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          📚 Welcome to Madrassa Management System
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          This platform helps teachers track students' <strong>Sabaq</strong>, <strong>Sabqi</strong>, <strong>Manzil</strong> and assign new lessons. Students (or parents) can view daily progress and stay updated.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
          >
            Login as Teacher
          </a>
          <a
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
          >
            Login as Student
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
