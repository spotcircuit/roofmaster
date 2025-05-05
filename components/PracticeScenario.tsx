import React, { useState } from 'react';

type ScenarioProps = {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  onClose: () => void;
};

type ScenarioStep = {
  id: number;
  type: 'context' | 'customer' | 'response' | 'feedback';
  content: string;
  options?: string[];
};

// Sample scenario steps for each scenario
const scenarioSteps: Record<number, ScenarioStep[]> = {
  1: [ // Door Knocking Introduction
    {
      id: 1,
      type: 'context',
      content: 'You are door knocking in a neighborhood that experienced a hailstorm 2 weeks ago. You approach a house with a 10-year-old roof that appears to have some damage.'
    },
    {
      id: 2,
      type: 'customer',
      content: '*Homeowner opens the door* "Yes? Can I help you?"'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you introduce yourself and start the conversation?',
      options: [
        "Hi there! I'm with RoofMaster 24/7. We've been helping your neighbors with storm damage. I noticed your roof might have some hail damage. Do you have a minute to chat about it?",
        "Good afternoon! I'm [Your Name] with RoofMaster 24/7. We're a local roofing company helping homeowners in the area after the recent hailstorm. I noticed some potential damage on your roof. Have you had anyone take a look at it yet?",
        "Hey! Did you know your roof has damage? I can help you get a free replacement through your insurance. Can I take a look?"
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The second approach is most effective because it: 1) Establishes your name and company, 2) Mentions you\'re local, 3) References the specific storm, 4) Notes potential damage without being presumptuous, and 5) Asks an open-ended question that invites conversation rather than a yes/no response.'
    }
  ],
  2: [ // Identifying Storm Damage
    {
      id: 1,
      type: 'context',
      content: 'You\'re speaking with a homeowner who has agreed to let you inspect their roof. You\'ve found clear signs of hail damage, and now you need to explain what you\'ve found.'
    },
    {
      id: 2,
      type: 'customer',
      content: '"So did you find anything up there? The roof looks fine to me from down here."'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you explain the damage you found?',
      options: [
        "I found several impact marks that are definitely from hail. Trust me, you need a new roof.",
        "I found multiple indicators of hail damage, including impact marks that have displaced granules and potentially fractured the matting underneath. I took some photos I can show you. This type of damage might not cause leaks immediately, but it shortens the life of your roof and could lead to problems down the road.",
        "There's some damage up there. You should file an insurance claim right away before it gets worse."
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The second response is most effective because it: 1) Specifically describes what you found using proper terminology, 2) Offers visual evidence with photos, 3) Explains why the damage matters even if it\'s not causing immediate problems, and 4) Educates the homeowner rather than just telling them what to do.'
    }
  ],
  3: [ // Handling Price Objections
    {
      id: 1,
      type: 'context',
      content: 'You\'ve provided a quote for a roof replacement, and the homeowner has received approval from their insurance company. However, they\'re hesitating because of the deductible.'
    },
    {
      id: 2,
      type: 'customer',
      content: '"Your quote looks good, but I got another company that said they could \'take care of\' my deductible. Why should I pay $2,500 out of pocket with you when they said I wouldn\'t have to pay anything?"'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you handle this objection?',
      options: [
        "I understand that's tempting, but what they're suggesting is insurance fraud. It's illegal and could put you at risk. We follow ethical business practices and provide superior workmanship with premium materials. The deductible is your contractual obligation to your insurance company.",
        "We can probably match that offer if that's what you need to move forward.",
        "That other company is going to cut corners on your roof to make up for that deductible. You'll regret going with them when your roof starts leaking."
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The first response is most effective because it: 1) Acknowledges the homeowner\'s concern, 2) Educates them about the legal implications, 3) Emphasizes your ethical standards, 4) Highlights the value you provide, and 5) Reminds them of their contractual obligation without being judgmental.'
    }
  ],
  4: [ // Insurance Claim Process
    {
      id: 1,
      type: 'context',
      content: 'A homeowner has agreed to let you inspect their roof after a storm. You\'ve found significant damage that warrants an insurance claim, but they\'re hesitant about the process.'
    },
    {
      id: 2,
      type: 'customer',
      content: '"I\'ve never filed an insurance claim before. It sounds complicated, and I\'m worried my rates will go up. Is it really worth it?"'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you explain the insurance claim process and address their concerns?',
      options: [
        "Don't worry about it. We'll handle everything and get you a new roof.",
        "I understand your concerns. Storm damage claims are actually different from other types of claims because they're considered 'Acts of God.' In most states, insurance companies can't raise your individual rates for storm claims - they typically adjust rates for the entire region. As for the process, we'll guide you through each step: filing the claim, meeting the adjuster, reviewing the estimate, and completing the work. Our supplement team will also ensure nothing is missed in the scope of work.",
        "If you don't file a claim, you're essentially wasting the insurance premiums you've been paying all these years. Your rates will probably go up regardless of whether you file a claim or not."
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The second response is most effective because it: 1) Acknowledges their concerns, 2) Provides factual information about how storm claims work, 3) Outlines the process step by step, 4) Explains how your company will support them, and 5) Addresses their specific concern about rate increases without making promises you can\'t keep.'
    }
  ],
  5: [ // Closing the Sale
    {
      id: 1,
      type: 'context',
      content: 'You\'ve walked the homeowner through the entire process, addressed their objections, and they seem positive about moving forward, but haven\'t explicitly agreed to sign the contract.'
    },
    {
      id: 2,
      type: 'customer',
      content: '"This all sounds good. I\'ll think about it and let you know."'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you close the sale?',
      options: [
        "I understand you want to think about it. What specific concerns do you still have that I can address right now? Once we get started, our project manager will handle everything, making the process smooth and stress-free for you. If you're comfortable moving forward, we can take care of the paperwork today and get you on our schedule before we get backed up from the storm.",
        "OK, I'll check back with you next week.",
        "You really should decide today. After I leave, I'll have to put you at the back of our waiting list, and it could be months before we can get to your roof."
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The first response is most effective because it: 1) Respects their desire to think about it, 2) Probes for any remaining objections, 3) Reiterates the value and ease of working with your company, 4) Creates gentle urgency without being pushy, and 5) Assumes the close by suggesting you can take care of paperwork today.'
    }
  ],
  6: [ // Explaining Roof Components
    {
      id: 1,
      type: 'context',
      content: 'A homeowner is interested in understanding more about what makes up a quality roof system before agreeing to a replacement.'
    },
    {
      id: 2,
      type: 'customer',
      content: '"Everyone says they have quality materials, but I don\'t know anything about roofing. What actually makes a good roof?"'
    },
    {
      id: 3,
      type: 'response',
      content: 'How do you explain roof components in an understandable way?',
      options: [
        "Our roofs use architectural shingles with a 130 mph wind rating, synthetic underlayment, ice and water shield in valleys and penetrations, proper ventilation with ridge vents and intake vents, and starter shingles along the eaves and rakes.",
        "A quality roof is more than just shingles – it's a complete system working together. Think of shingles as the outer armor protecting your home, but underneath there's underlayment providing a second water barrier. In vulnerable areas like valleys where water concentrates, we install specialized ice and water shield. The ventilation system is like your roof's lungs, allowing it to breathe and prevent heat and moisture buildup. All these components, when properly installed, work together to protect your home and maximize the lifespan of your roof.",
        "We only use the best materials from top manufacturers. You don't need to worry about the technical details."
      ]
    },
    {
      id: 4,
      type: 'feedback',
      content: 'The second response is most effective because it: 1) Uses simple analogies that make technical concepts relatable, 2) Explains the purpose of each component rather than just naming them, 3) Emphasizes the system approach rather than individual parts, 4) Addresses their desire to understand without overwhelming them with jargon, and 5) Builds credibility by demonstrating knowledge in an accessible way.'
    }
  ]
};

const PracticeScenario: React.FC<ScenarioProps> = ({ 
  id, 
  title, 
  description, 
  difficulty, 
  category,
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const steps = scenarioSteps[id] || [];
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-500">{category}</span>
        </div>
        
        {completed ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scenario Completed!</h3>
            <p className="text-gray-600 mb-6">
              Great job working through this scenario. You've learned effective techniques for {category.toLowerCase()}.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setSelectedOption(null);
                  setShowFeedback(false);
                  setCompleted(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Practice Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Step Content */}
            <div className="mb-6">
              {currentStepData.type === 'context' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">{currentStepData.content}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStepData.type === 'customer' && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800">{currentStepData.content}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStepData.type === 'response' && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">{currentStepData.content}</h3>
                  <div className="space-y-3">
                    {currentStepData.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedOption === index
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-800'
                            : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                            selectedOption === index
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {currentStepData.type === 'feedback' && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Expert Feedback</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{currentStepData.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {showFeedback && currentStepData.type === 'response' && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Expert Feedback</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{steps[currentStep + 1]?.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              {(currentStepData.type !== 'response' || showFeedback) && (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {currentStep < steps.length - 1 ? 'Continue' : 'Complete Scenario'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PracticeScenario;
