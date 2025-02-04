import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useAuthStore from '@/store/auth';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: false },
    { name: 'Courts', href: '/courts', current: false },
    { name: 'Book Now', href: '/booking', current: false },
    ...(isAuthenticated ? [{ name: 'My Bookings', href: '/bookings', current: false }] : []),
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', href: '/admin', current: false }] : []),
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-primary-600">
                    PickleBall
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </span>
                      </div>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3">
                          <p className="text-sm">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="border-t border-gray-100">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-gray-100"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar; 