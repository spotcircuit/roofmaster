import { useState } from 'react';
import Layout from '../../components/Layout';
import PracticeScenario from '../../components/PracticeScenario';

// Define scenario types
type Scenario = {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  imageUrl: string;
  completed: boolean;
};

// Sample practice scenarios
const practiceScenarios: Scenario[] = [
  {
    id: 1,
    title: 'Door Knocking Introduction',
    description: 'Practice your initial approach when knocking on a homeowner\'s door. Focus on building rapport and establishing credibility in the first 30 seconds.',
    difficulty: 'beginner',
    category: 'Door Knocking',
    imageUrl: '/images/doorknock.png',
    completed: false
  },
  {
    id: 2,
    title: 'Identifying Storm Damage',
    description: 'Practice explaining to homeowners how to identify common signs of storm damage on their property and why it matters for their roof.',
    difficulty: 'beginner',
    category: 'Inspection',
    imageUrl: '/images/hailroof.png',
    completed: false
  },
  {
    id: 3,
    title: 'Handling Price Objections',
    description: 'Practice responding to homeowners who say your quote is too expensive or that they have a lower quote from another company.',
    difficulty: 'intermediate',
    category: 'Objection Handling',
    imageUrl: '/images/handlingprice.png',
    completed: false
  },
  {
    id: 4,
    title: 'Insurance Claim Process Explanation',
    description: 'Practice walking a homeowner through the insurance claim process, explaining your role and how you can help them maximize their claim.',
    difficulty: 'intermediate',
    category: 'Insurance',
    imageUrl: '/images/insurancehandling.png',
    completed: false
  },
  {
    id: 5,
    title: 'Closing the Sale',
    description: 'Practice techniques for closing the sale after you\'ve addressed all objections and the homeowner is showing buying signals.',
    difficulty: 'advanced',
    category: 'Closing',
    imageUrl: '/images/closingsale.png',
    completed: false
  },
  {
    id: 6,
    title: 'Explaining Roof Components',
    description: 'Practice explaining the different components of a roof system to homeowners in simple, understandable terms.',
    difficulty: 'beginner',
    category: 'Product Knowledge',
    imageUrl: '/images/roofcomponents.png',
    completed: false
  }
];

// Define category filters
const categories = ['All', 'Door Knocking', 'Inspection', 'Objection Handling', 'Insurance', 'Closing', 'Product Knowledge'];
const difficultyLevels = ['All', 'beginner', 'intermediate', 'advanced'];

export default function PracticeLab() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavItem, setActiveNavItem] = useState('practice-lab');

  // Filter scenarios based on selected filters and search query
  const filteredScenarios = practiceScenarios.filter(scenario => {
    const matchesCategory = categoryFilter === 'All' || scenario.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || scenario.difficulty === difficultyFilter;
    const matchesSearch = searchQuery === '' || 
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <Layout activeNavItem={activeNavItem}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Practice Lab
          </h1>
          <p className="text-gray-600 mt-2">
            Practice your sales skills in realistic scenarios. Select a scenario below to get started.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty-filter"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-1/3">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search scenarios..."
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Grid */}
        {filteredScenarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <div 
                key={scenario.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] cursor-pointer"
                onClick={() => setActiveScenario(scenario)}
              >
                <div className="h-52 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={scenario.imageUrl} 
                      alt={scenario.title} 
                      className={`w-full h-full object-cover ${scenario.id === 2 || scenario.id === 4 ? 'object-center' : 'object-top'}`} 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-start pt-6 items-center">
                      <span className="text-white text-xl font-bold drop-shadow-lg text-center px-4">{scenario.title}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">{scenario.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{scenario.description}</p>
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Start Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scenarios found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setCategoryFilter('All');
                  setDifficultyFilter('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Scenario Modal */}
        {activeScenario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <PracticeScenario
              id={activeScenario.id}
              title={activeScenario.title}
              description={activeScenario.description}
              difficulty={activeScenario.difficulty}
              category={activeScenario.category}
              onClose={() => setActiveScenario(null)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
