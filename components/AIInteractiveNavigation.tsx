import React, { useState, useRef, useEffect } from 'react';
import AIVoiceClient from './AIVoiceClient';

type ClientType = 'friendly' | 'skeptical' | 'technical' | 'rushed' | 'confused';

type AIInteractiveNavigationProps = {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  onClose: () => void;
};

type NavigationStep = {
  id: number;
  type: 'intro' | 'interaction' | 'feedback';
  content: string;
  clientType?: ClientType;
};

// Sample navigation scenarios
const navigationScenarios: Record<number, NavigationStep[]> = {
  1: [ // Door Knocking Introduction with Voice
    {
      id: 1,
      type: 'intro',
      content: 'In this interactive voice scenario, you will practice your door knocking introduction with different types of homeowners. You\'ll need to adapt your approach based on the client\'s personality and responses. Speak clearly and naturally as if you were having a real conversation.'
    },
    {
      id: 2,
      type: 'interaction',
      content: 'You\'re about to meet Sarah Johnson, a friendly homeowner who is open to hearing about your services but needs clear explanations.',
      clientType: 'friendly'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Great job with the friendly homeowner! You established rapport and provided clear information. Remember to always match the homeowner\'s energy and communication style while maintaining your professional approach.'
    }
  ],
  2: [ // Identifying Storm Damage with Voice
    {
      id: 1,
      type: 'intro',
      content: 'In this interactive voice scenario, you will practice explaining storm damage to different types of homeowners. You\'ll need to adjust your technical explanations based on the client\'s knowledge level and communication style.'
    },
    {
      id: 2,
      type: 'interaction',
      content: 'You\'re about to speak with Dr. James Chen, a technical homeowner who wants detailed explanations and specific information about the damage you\'ve found.',
      clientType: 'technical'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Excellent work with the technical client! You provided detailed information without overwhelming them. Remember that technical clients appreciate specific data points and methodical explanations of processes.'
    }
  ],
  3: [ // Handling Price Objections with Voice
    {
      id: 1,
      type: 'intro',
      content: 'In this interactive voice scenario, you will practice handling price objections from different types of homeowners. You\'ll need to address concerns about the deductible while maintaining ethical standards.'
    },
    {
      id: 2,
      type: 'interaction',
      content: 'You\'re about to speak with Michael Rodriguez, a skeptical homeowner who is questioning why your quote doesn\'t "handle" the deductible like another company offered to do.',
      clientType: 'skeptical'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Well done with the skeptical client! You maintained your ethical stance while explaining the value proposition. Remember that skeptical clients need reassurance through facts, transparency, and demonstrations of integrity.'
    }
  ],
  4: [ // Insurance Claim Process with Voice
    {
      id: 1,
      type: 'intro',
      content: 'In this interactive voice scenario, you will practice explaining the insurance claim process to different types of homeowners. You\'ll need to simplify complex processes while addressing specific concerns.'
    },
    {
      id: 2,
      type: 'interaction',
      content: 'You\'re about to speak with Eleanor Wilson, a confused homeowner who is overwhelmed by the insurance process and needs simple, clear explanations.',
      clientType: 'confused'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Great job with the confused client! You simplified complex information and provided reassurance. Remember that confused clients need concepts broken down into simple steps with frequent checks for understanding.'
    }
  ],
  5: [ // Closing the Sale with Voice
    {
      id: 1,
      type: 'intro',
      content: 'In this interactive voice scenario, you will practice closing techniques with different types of homeowners. You\'ll need to create urgency without being pushy.'
    },
    {
      id: 2,
      type: 'interaction',
      content: 'You\'re about to speak with Lisa Thompson, a rushed homeowner who needs to make a quick decision but doesn\'t want to feel pressured.',
      clientType: 'rushed'
    },
    {
      id: 3,
      type: 'feedback',
      content: 'Excellent work with the rushed client! You provided concise information and a clear path forward. Remember that rushed clients appreciate efficiency, bullet points, and clear next steps without unnecessary details.'
    }
  ]
};

const AIInteractiveNavigation: React.FC<AIInteractiveNavigationProps> = ({
  id,
  title,
  description,
  difficulty,
  category,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [clientResponses, setClientResponses] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [transcripts, setTranscripts] = useState<{speaker: 'user' | 'client', text: string}[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
  
  const microphoneRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get steps for this scenario
  const steps = navigationScenarios[id] || [];
  const currentStepData = steps[currentStep];
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setUserInput(transcript);
      };
      
      recognitionInstance.onend = () => {
        if (isRecording) {
          // If we're still supposed to be recording, restart it
          // (this handles the case where recognition stops automatically)
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSpeechRecognitionSupported(false);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const handleStartRecording = () => {
    if (!recognition) return;
    
    setIsRecording(true);
    setUserInput('');
    
    // Start recording
    recognition.start();
    
    // Start timer
    let seconds = 0;
    timerRef.current = setInterval(() => {
      seconds++;
      setRecordingTime(seconds);
    }, 1000);
  };
  
  const handleStopRecording = () => {
    if (!recognition) return;
    
    setIsRecording(false);
    
    // Stop recording
    recognition.stop();
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Add user input to transcript
    if (userInput.trim()) {
      setTranscripts(prev => [...prev, {speaker: 'user', text: userInput}]);
      
      // Trigger AI response
      setIsListening(true);
    }
  };
  
  const handleClientResponse = (response: string) => {
    setClientResponses(prev => [...prev, response]);
    setTranscripts(prev => [...prev, {speaker: 'client', text: response}]);
    setIsListening(false);
  };
  
  const handleConversationEnd = () => {
    // Move to feedback step
    setCurrentStep(prev => prev + 1);
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setClientResponses([]);
      setTranscripts([]);
      setUserInput('');
    } else {
      onClose();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              difficulty === 'beginner' ? 'bg-green-500' :
              difficulty === 'intermediate' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            <span className="ml-2 text-sm opacity-90">{category}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!isStarted ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Interactive Voice Navigation</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
            
            {!isSpeechRecognitionSupported && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Speech Recognition Not Supported</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for the full experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsStarted(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Start Interactive Practice
            </button>
          </div>
        ) : (
          <>
            {currentStepData.type === 'intro' && (
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800">Scenario Instructions</h3>
                    <div className="mt-2 text-sm text-indigo-700">
                      <p>{currentStepData.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStepData.type === 'interaction' && (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Scenario Context</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>{currentStepData.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {currentStepData.clientType && (
                  <AIVoiceClient
                    clientType={currentStepData.clientType}
                    scenarioId={id}
                    onResponse={handleClientResponse}
                    isListening={isListening}
                    onConversationEnd={handleConversationEnd}
                  />
                )}
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Conversation Transcript</h3>
                  
                  {transcripts.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {transcripts.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg ${
                            entry.speaker === 'user' 
                              ? 'bg-indigo-100 ml-8' 
                              : 'bg-gray-100 mr-8'
                          }`}
                        >
                          <div className="font-medium text-xs text-gray-500 mb-1">
                            {entry.speaker === 'user' ? 'You' : 'Client'}:
                          </div>
                          <p className="text-gray-800">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">The conversation will appear here. Press the microphone button to start speaking.</p>
                  )}
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Your response will appear here as you speak..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        disabled={isRecording}
                      />
                    </div>
                    
                    <div className="ml-4 flex flex-col items-center">
                      <button
                        ref={microphoneRef}
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={!isSpeechRecognitionSupported}
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } ${!isSpeechRecognitionSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isRecording ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        )}
                      </button>
                      
                      {isRecording && (
                        <div className="mt-2 text-sm text-red-500 font-medium">
                          {formatTime(recordingTime)}
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {isRecording ? 'Click to stop' : 'Click to speak'}
                      </div>
                    </div>
                  </div>
                  
                  {!isRecording && userInput && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          setTranscripts(prev => [...prev, {speaker: 'user', text: userInput}]);
                          setIsListening(true);
                          setUserInput('');
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Send Response
                      </button>
                    </div>
                  )}
                </div>
              </>
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
                    <h3 className="text-sm font-medium text-green-800">Scenario Feedback</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{currentStepData.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t p-4 flex justify-between items-center bg-gray-50">
        <div className="text-sm text-gray-500">
          {isStarted && `Step ${currentStep + 1} of ${steps.length}`}
        </div>
        
        {isStarted && (currentStepData.type !== 'interaction' || transcripts.length > 0) && (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Complete Practice'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIInteractiveNavigation;
