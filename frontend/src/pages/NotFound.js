// src/pages/NotFound.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, GraduationCap } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-9xl font-display font-black text-gray-100 dark:text-gray-800 select-none leading-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30 animate-float">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It may have been moved or the URL might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Need help?{' '}
          <Link to="/contact" className="text-brand-500 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
