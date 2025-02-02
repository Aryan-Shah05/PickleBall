import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">404</h2>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <div className="mt-6">
          <Link
            to="/"
            className="text-base font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go back home<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 