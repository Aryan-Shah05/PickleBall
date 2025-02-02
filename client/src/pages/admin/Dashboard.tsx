import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <div className="mt-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">System Overview</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Key metrics and system status.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 px-4 py-5 sm:rounded-lg sm:p-6">
                    <h4 className="text-base font-medium text-gray-900">Statistics</h4>
                    <p className="mt-1 text-sm text-gray-500">Loading statistics...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 