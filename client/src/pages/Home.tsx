import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Court } from '@/types';

const Home: React.FC = () => {
  const { data: availableCourts } = useQuery<Court[]>({
    queryKey: ['courts', 'available'],
    queryFn: () => apiClient.get('/courts/available'),
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to PickleBall
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Book courts, manage reservations, and enjoy playing pickleball!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Book Your Next Pickleball Match
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the thrill of pickleball on our premium courts. Whether you're a beginner or a
              seasoned player, we've got the perfect court for your game.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/booking"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Book Now
              </Link>
              <Link to="/courts" className="text-sm font-semibold leading-6 text-gray-900">
                View Courts <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="/images/hero-courts.jpg"
                alt="Pickleball courts"
                className="w-[76rem] rounded-md bg-gray-50 object-cover shadow-xl ring-1 ring-gray-400/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available courts section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Available Courts
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Book your preferred court for today or plan ahead for your next game.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {availableCourts?.map((court) => (
            <div
              key={court.id}
              className="flex flex-col items-start justify-between rounded-lg border border-gray-200 p-6 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center gap-x-4">
                <div className="text-base font-semibold leading-7 text-gray-900">{court.name}</div>
                <div
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    court.isIndoor
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-green-50 text-green-700'
                  }`}
                >
                  {court.isIndoor ? 'Indoor' : 'Outdoor'}
                </div>
              </div>
              <div className="mt-4 text-sm leading-6 text-gray-600">
                <p>Type: {court.type}</p>
                <p>Rate: ${court.hourlyRate}/hour</p>
                <p>Peak Rate: ${court.peakHourRate}/hour</p>
              </div>
              <Link
                to={`/booking?courtId=${court.id}`}
                className="mt-6 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Book this court
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Experience the best in pickleball facilities and services.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Premium Courts
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    State-of-the-art courts designed for both recreational and competitive play.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Easy Booking
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Simple and convenient online booking system available 24/7.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Great Community
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Join a vibrant community of pickleball enthusiasts and make new friends.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 