import { useState } from 'react';
import Link from 'next/link';

// Navigation item type definition
type NavItem = {
  id: string;
  title: string;
  href: string;
  active?: boolean;
  dropdown?: NavItem[];
};

// Props for the Nav component
type NavProps = {
  activeItem: string;
  setActiveItem: (id: string) => void;
};

// Top navigation items with dropdowns
const navItems: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', href: '/dashboard', active: true },
  { id: 'sales-training', title: 'Sales Training', href: '/training' },
  { id: 'practice-lab', title: 'Practice Lab', href: '/practice-lab' },
  { id: 'ai-interactive', title: 'AI Interactive Training', href: '/ai-interactive' },
  { id: 'certifications', title: 'Certifications', href: '/certifications' },
  { 
    id: 'resources', 
    title: 'Resources', 
    href: '/resources',
    dropdown: [
      { id: 'sop', title: 'SOP Library', href: '/resources/sop' },
      { id: 'materials', title: 'Sales Materials', href: '/resources/materials' },
      { id: 'templates', title: 'Templates', href: '/resources/templates' },
      { id: 'videos', title: 'Video Library', href: '/resources/videos' }
    ]
  },
  { id: 'community', title: 'Community', href: '/community' }
];

export default function Nav({ activeItem, setActiveItem }: NavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass dark:glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 drop-shadow-sm">
                RoofMaster 24/7
              </span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.dropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium inline-flex items-center transition-all duration-200 ${
                        item.id === activeItem
                          ? 'bg-white/30 text-blue-700 dark:text-blue-400 shadow-sm'
                          : 'hover:bg-white/20 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                      }`}
                    >
                      {item.title}
                      <svg
                        className={`ml-1 h-4 w-4 transition-transform ${
                          openDropdown === item.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        item.id === activeItem
                          ? 'bg-white/30 text-blue-700 dark:text-blue-400 shadow-sm'
                          : 'hover:bg-white/20 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                      }`}
                      onClick={() => setActiveItem(item.id)}
                    >
                      {item.title}
                    </Link>
                  )}

                  {/* Dropdown menu */}
                  {item.dropdown && (
                    <div
                      className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-white/20 transition-all duration-200 ${
                        openDropdown === item.id
                          ? 'transform opacity-100 scale-100'
                          : 'transform opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.id}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => {
                            setActiveItem(dropdownItem.id);
                            setOpenDropdown(null);
                          }}
                        >
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Help & Support Icon */}
            <Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </Link>

            {/* Notifications Icon */}
            <div className="relative">
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </button>
            </div>

            {/* Profile Picture (Clickable) */}
            <div className="flex-shrink-0">
              <Link href="/profile">
                <span className="relative inline-block cursor-pointer">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-transparent hover:border-blue-400 transition-colors"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
                </span>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="ml-4 md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
