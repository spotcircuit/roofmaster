import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ModuleQuiz from '../../components/ModuleQuiz';

// Training module type definition
type TrainingModule = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  completed: boolean;
  progress: number;
};

// Sample training modules data
const trainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Foundational Principles and Mindset",
    description: "Learn the core principles and mindset required for success in roofing sales.",
    videoUrl: "https://www.youtube.com/watch?v=45gMPv9lU10",
    completed: false,
    progress: 0
  },
  {
    id: 2,
    title: "Prospecting & Lead Generation",
    description: "Effective strategies for finding and qualifying potential roofing customers.",
    videoUrl: "https://www.youtube.com/watch?v=x5ZukYpFHEk",
    completed: false,
    progress: 0
  },
  {
    id: 3,
    title: "Initial Customer Contact",
    description: "How to make a great first impression and establish rapport with potential clients.",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    completed: false,
    progress: 0
  },
  {
    id: 4,
    title: "Roof Inspection Techniques",
    description: "Professional methods for thoroughly inspecting and documenting roof damage.",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    completed: false,
    progress: 0
  },
  // Add more modules as needed
];

export default function SalesTraining() {
  const [activeModule, setActiveModule] = useState<TrainingModule>(trainingModules[0]);
  const [openModuleId, setOpenModuleId] = useState<number | null>(1);
  const [activeNavItem, setActiveNavItem] = useState<string>('sales-training');
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  const toggleModule = (id: number) => {
    if (openModuleId === id) {
      setOpenModuleId(null);
    } else {
      setOpenModuleId(id);
      const module = trainingModules.find(m => m.id === id);
      if (module) {
        setActiveModule(module);
      }
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Layout activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} title="Sales Training | RoofMaster 24/7">
      {/* Main Content - Sales Training */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Training</h1>
          <p className="mt-2 text-gray-600">Complete the modules below to improve your roofing sales skills</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Navigation */}
          <div className="w-full md:w-80 lg:w-96 glass-card p-6 md:sticky md:top-24 md:self-start">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Training Modules</h2>
              <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm flex items-center mb-4">
                <span className="mr-2">⚡</span>
                <span>Complete all modules to earn your certification.</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {trainingModules.map((module) => (
                <button 
                  key={module.id}
                  onClick={() => {
                    toggleModule(module.id);
                    const selectedModule = trainingModules.find(m => m.id === module.id);
                    if (selectedModule) {
                      setActiveModule(selectedModule);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    openModuleId === module.id 
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-50 border-blue-200 shadow-sm' 
                      : 'bg-white/80 border-gray-100 hover:border-blue-100'
                  } border`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      module.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {module.completed ? (
                        <span>✓</span>
                      ) : (
                        <span>{module.id}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      {openModuleId === module.id && (
                        <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="glass-card overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Module {activeModule.id}: {activeModule.title}
                </h2>
                <p className="mt-2 text-gray-600">{activeModule.description}</p>
              </div>
              
              {/* Video Container */}
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-900 to-indigo-900 p-1">
                <div className="video-container">
                  <iframe 
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(activeModule.videoUrl)}`}
                    title={activeModule.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                    onClick={() => {
                      const updatedModules = [...trainingModules];
                      const moduleIndex = updatedModules.findIndex(m => m.id === activeModule.id);
                      if (moduleIndex !== -1) {
                        updatedModules[moduleIndex].completed = true;
                        updatedModules[moduleIndex].progress = 100;
                      }
                    }}
                  >
                    Mark as Complete
                  </button>
                  <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-colors">
                    Download Resources
                  </button>
                  <button 
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-colors"
                    onClick={() => setShowQuiz(true)}
                  >
                    Take Quiz
                  </button>
                </div>
                
                {showQuiz && (
                  <ModuleQuiz 
                    moduleId={activeModule.id} 
                    moduleTitle={activeModule.title.replace(/^[^:]+:\s*/, '')} 
                    onClose={() => setShowQuiz(false)} 
                  />
                )}
              </div>
            </div>
            
            {/* Additional Resources */}
            <div className="mt-8 glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <span>📄</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Sales Script Template</h4>
                      <p className="text-sm text-gray-500">PDF document</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <span>📊</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Sales Performance Tracker</h4>
                      <p className="text-sm text-gray-500">Excel spreadsheet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Next Module */}
            {activeModule.id < trainingModules.length && (
              <div className="mt-8 glass-card p-6 border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Up Next</h3>
                    <p className="text-gray-600">
                      Module {activeModule.id + 1}: {trainingModules.find(m => m.id === activeModule.id + 1)?.title}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const nextModule = trainingModules.find(m => m.id === activeModule.id + 1);
                      if (nextModule) {
                        setActiveModule(nextModule);
                        setOpenModuleId(nextModule.id);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    Continue to Next Module
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
