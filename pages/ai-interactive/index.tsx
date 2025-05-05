import { useState } from 'react';
import Layout from '../../components/Layout';
import AIInteractiveNavigation from '../../components/AIInteractiveNavigation';
import Image from 'next/image';

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

// Sample AI voice practice scenarios
const aiPracticeScenarios: Scenario[] = [
  {
    id: 1,
    title: 'Door Knocking Introduction',
    description: 'Practice your initial approach with different homeowner personalities using voice interaction. Adapt your tone and message based on client feedback.',
    difficulty: 'beginner',
    category: 'Door Knocking',
    imageUrl: '/images/doorknock.png',
    completed: false
  },
  {
    id: 2,
    title: 'Explaining Storm Damage',
    description: 'Practice explaining technical roof damage to different types of clients using voice interaction. Learn to adjust your level of detail based on the client\'s knowledge.',
    difficulty: 'intermediate',
    category: 'Inspection',
    imageUrl: '/images/hailroof.png',
    completed: false
  },
  {
    id: 3,
    title: 'Handling Price Objections',
    description: 'Practice responding to deductible and pricing concerns from different personality types using voice interaction. Maintain ethics while demonstrating value.',
    difficulty: 'advanced',
    category: 'Objection Handling',
    imageUrl: '/images/handlingprice.png',
    completed: false
  },
  {
    id: 4,
    title: 'Insurance Claim Process',
    description: 'Practice explaining the insurance claim process to different client types using voice interaction. Simplify complex processes for various knowledge levels.',
    difficulty: 'intermediate',
    category: 'Insurance',
    imageUrl: '/images/insurancehandling.png',
    completed: false
  },
  {
    id: 5,
    title: 'Closing the Sale',
    description: 'Practice closing techniques with different personality types using voice interaction. Create urgency without pressure based on client signals.',
    difficulty: 'advanced',
    category: 'Closing',
    imageUrl: '/images/closingsale.png',
    completed: false
  },
  {
    id: 6,
    title: 'Explaining Roof Components',
    description: 'Practice explaining the different components of a roof system to homeowners in simple, understandable terms using voice interaction.',
    difficulty: 'beginner',
    category: 'Product Knowledge',
    imageUrl: '/images/roofcomponents.png',
    completed: false
  }
];

// Define category filters
const categories = ['All', 'Door Knocking', 'Inspection', 'Objection Handling', 'Insurance', 'Closing', 'Product Knowledge'];
const difficultyLevels = ['All', 'beginner', 'intermediate', 'advanced'];

export default function AIInteractivePractice() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavItem, setActiveNavItem] = useState('practice-lab');

  // Filter scenarios based on selected filters and search query
  const filteredScenarios = aiPracticeScenarios.filter(scenario => {
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
            AI Interactive Voice Practice
          </h1>
          <p className="text-gray-600 mt-2">
            Practice your sales skills with AI-powered voice clients. These interactive scenarios use Gemini 2.0 Flash Stream to simulate realistic client interactions.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Browser Compatibility</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>For the best experience with voice recognition, please use Chrome, Edge, or Safari. Firefox has limited support for speech recognition features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="Search scenarios"
                  />
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
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] cursor-pointer" 
                onClick={() => setActiveScenario(scenario)}
              >
                <div className="relative">
                  <div 
                    className="h-64 relative overflow-hidden" 
                    style={{ 
                      backgroundImage: `url(${scenario.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 flex items-end justify-center p-4">
                      <div className="text-center w-full bg-black bg-opacity-50 p-3 rounded-md">
                        <span className="text-white text-xl font-bold drop-shadow-lg">{scenario.title}</span>
                        <div className="flex items-center justify-center mt-2">
                          <svg className="h-5 w-5 text-white mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <span className="text-white text-sm">Voice Interactive</span>
                        </div>
                      </div>
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
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Start Voice Practice
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
            <AIInteractiveNavigation
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
