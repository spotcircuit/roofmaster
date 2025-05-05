import React, { useState, useEffect, useRef } from 'react';

// Web Speech API type definitions
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}

type ClientType = 'friendly' | 'skeptical' | 'technical' | 'rushed' | 'confused';

type VoiceClientProps = {
  clientType: ClientType;
  scenarioId: number;
  onResponse: (response: string) => void;
  isListening: boolean;
  onConversationEnd: () => void;
};

type ClientPersona = {
  name: string;
  description: string;
  voiceStyle: string;
  responsePatterns: string[];
  commonPhrases: string[];
  objections: string[];
};

// Define different client personas
const clientPersonas: Record<ClientType, ClientPersona> = {
  friendly: {
    name: 'Sarah Johnson',
    description: 'A warm, approachable homeowner who is genuinely interested in your services but needs clear explanations.',
    voiceStyle: 'Calm, friendly, and engaged',
    responsePatterns: [
      'That makes sense! Can you tell me more about {topic}?',
      'I appreciate your explanation. What about {concern}?',
      'That sounds good to me. What would be the next step?'
    ],
    commonPhrases: [
      'I see what you mean.',
      'That\'s helpful to know!',
      'I hadn\'t thought of it that way.'
    ],
    objections: [
      'I\'m just not sure if we can afford this right now.',
      'I\'d like to get a few more quotes before deciding.',
      'Do you think we could wait until next year?'
    ]
  },
  skeptical: {
    name: 'Michael Rodriguez',
    description: 'A cautious homeowner who has had negative experiences with contractors in the past and needs reassurance.',
    voiceStyle: 'Measured, questioning, and slightly defensive',
    responsePatterns: [
      'How can I be sure that {concern} won\'t happen?',
      'I\'ve heard from others that {competing_claim}. Why is your approach different?',
      'What guarantees do you offer if {problem} occurs?'
    ],
    commonPhrases: [
      'I\'m not convinced yet.',
      'I need to think about this more.',
      'That sounds too good to be true.'
    ],
    objections: [
      'Your price seems much higher than I expected.',
      'I\'ve read some concerning reviews about roofing companies online.',
      'How do I know you won\'t find "additional problems" once you start the work?'
    ]
  },
  technical: {
    name: 'Dr. James Chen',
    description: 'A detail-oriented homeowner who wants to understand the technical aspects and make an informed decision.',
    voiceStyle: 'Precise, analytical, and methodical',
    responsePatterns: [
      'What are the specifications of {material}?',
      'Can you explain the process of {technical_process} in more detail?',
      'What\'s the statistical likelihood of {technical_issue} occurring?'
    ],
    commonPhrases: [
      'I\'d like to see the data on that.',
      'What\'s the efficiency rating?',
      'Let me understand the technical details.'
    ],
    objections: [
      'I\'ve researched alternative materials that claim to have better longevity metrics.',
      'The R-value of this insulation seems below industry standards.',
      'What\'s the specific warranty coverage for manufacturing defects versus installation errors?'
    ]
  },
  rushed: {
    name: 'Lisa Thompson',
    description: 'A busy professional who has limited time and wants quick, straightforward information.',
    voiceStyle: 'Fast-paced, direct, and occasionally impatient',
    responsePatterns: [
      'Can you give me the quick version?',
      'What\'s the bottom line here?',
      'How soon can this be completed?'
    ],
    commonPhrases: [
      'Let\'s cut to the chase.',
      'I only have a few minutes.',
      'Just give me the highlights.'
    ],
    objections: [
      'That timeline doesn\'t work for me. I need it done faster.',
      'I don\'t have time to deal with all this paperwork.',
      'Can\'t we simplify this process?'
    ]
  },
  confused: {
    name: 'Eleanor Wilson',
    description: 'An overwhelmed homeowner who struggles to understand industry terminology and needs simple explanations.',
    voiceStyle: 'Hesitant, uncertain, and sometimes embarrassed',
    responsePatterns: [
      'I\'m sorry, but could you explain that in simpler terms?',
      'So what does that mean for me exactly?',
      'I\'m not following. Could you go over that again?'
    ],
    commonPhrases: [
      'This is all so complicated.',
      'I\'m not sure I understand.',
      'I don\'t know much about roofing.'
    ],
    objections: [
      'I think I need to ask my son/daughter about this first.',
      'This is too complicated for me to decide right now.',
      'I\'m worried I\'ll make the wrong decision.'
    ]
  }
};

// Sample conversation flows for different scenarios
const scenarioConversations: Record<number, Record<ClientType, string[]>> = {
  1: { // Door Knocking Introduction
    friendly: [
      "Oh, hello there! I wasn't expecting anyone today.",
      "A hailstorm? Yes, we did have that bad weather a couple weeks ago. You noticed something on my roof?",
      "I'd be happy to hear more about what you found. We've been in this house for about five years now."
    ],
    skeptical: [
      "Yes? What do you want?",
      "Storm damage? I don't see any problems with my house.",
      "How do I know you're not just trying to sell me something I don't need?",
      "I've heard about contractors who go door to door after storms looking for easy money."
    ],
    technical: [
      "Hello, what can I help you with?",
      "Interesting. What specific indicators of damage did you observe?",
      "What's the typical threshold for insurance coverage in cases like this?",
      "Could you explain the difference between functional and cosmetic damage in this context?"
    ],
    rushed: [
      "Hi, I'm in the middle of something. What's this about?",
      "Roof damage? I haven't noticed anything.",
      "I've got about 5 minutes before my next meeting. Give me the quick version of what you're offering.",
      "If there is damage, what's the timeline we're looking at for repairs?"
    ],
    confused: [
      "Hello? Oh, I wasn't expecting anyone.",
      "Storm damage? I'm not sure I understand. The roof looks fine to me.",
      "Insurance might pay for it? I don't know how all that works.",
      "This sounds complicated. Maybe my son should be here for this conversation."
    ]
  },
  2: { // Identifying Storm Damage
    friendly: [
      "Thanks for taking a look up there. I was wondering if everything was okay after that storm.",
      "It looks fine from down here, but I know that doesn't mean much. What did you find?",
      "I see. And how serious is that kind of damage? Do we need to fix it right away?"
    ],
    skeptical: [
      "So what exactly did you find up there?",
      "Those just look like normal wear and tear to me. How do I know this is actually storm damage?",
      "I've had other roofers tell me my roof is fine. Why should I believe you over them?"
    ],
    technical: [
      "What specific patterns of damage did you identify?",
      "Can you explain how the granule displacement affects the shingle's UV protection and water shedding capabilities?",
      "What's the estimated reduction in roof lifespan based on the damage pattern you observed?"
    ],
    rushed: [
      "Just give me the bottom line - do I need a new roof or not?",
      "How urgent is this? I've got a lot going on right now.",
      "If I decide to move forward, how quickly can this be done? I'm traveling for work next month."
    ],
    confused: [
      "You found damage? But the roof isn't leaking or anything.",
      "Granules? Matting? I'm sorry, but could you explain that in simpler terms?",
      "So it's damaged but not damaged? I'm confused about whether this needs to be fixed now or not."
    ]
  },
  // Add more scenarios as needed
};

const AIVoiceClient: React.FC<VoiceClientProps> = ({
  clientType,
  scenarioId,
  onResponse,
  isListening,
  onConversationEnd
}) => {
  const persona = clientPersonas[clientType];
  const conversation = scenarioConversations[scenarioId]?.[clientType] || [];
  
  const [conversationIndex, setConversationIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Reset conversation when client type or scenario changes
  useEffect(() => {
    setConversationIndex(0);
    setCurrentResponse('');
    setIsResponding(false);
    setConversationComplete(false);
  }, [clientType, scenarioId]);
  
  // Respond when listening state changes
  useEffect(() => {
    if (isListening && !isResponding && !conversationComplete) {
      respondToUser();
    }
  }, [isListening]);
  
  const respondToUser = () => {
    if (conversationIndex >= conversation.length) {
      setConversationComplete(true);
      onConversationEnd();
      return;
    }
    
    setIsResponding(true);
    
    // Get the next response from the conversation flow
    const response = conversation[conversationIndex];
    
    // Simulate typing/speaking effect
    let i = 0;
    setCurrentResponse('');
    
    const typingInterval = setInterval(() => {
      if (i < response.length) {
        setCurrentResponse(prev => prev + response.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        
        // Play audio if available (in a real implementation, this would be text-to-speech)
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error('Audio playback failed:', e));
        }
        
        // Send the complete response back to parent
        onResponse(response);
        
        // Move to next conversation step
        setConversationIndex(prev => prev + 1);
        setIsResponding(false);
      }
    }, 30); // Adjust speed as needed
    
    return () => clearInterval(typingInterval);
  };
  
  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {persona.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-lg">{persona.name}</h3>
          <p className="text-sm text-gray-500">{clientType.charAt(0).toUpperCase() + clientType.slice(1)} Client</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">Client Profile:</p>
        <p className="text-sm text-gray-600 italic">{persona.description}</p>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4 min-h-[100px] mb-4 relative">
        {isResponding ? (
          <>
            <p>{currentResponse}</p>
            <span className="inline-block w-2 h-4 bg-gray-500 ml-1 animate-pulse"></span>
          </>
        ) : (
          <p>{currentResponse}</p>
        )}
        
        {isResponding && (
          <div className="absolute top-2 right-2 flex items-center text-xs text-indigo-600">
            <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Speaking...
          </div>
        )}
      </div>
      
      {conversationComplete && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Conversation Complete</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>You've completed this conversation scenario with {persona.name}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio element for voice (would be connected to TTS in production) */}
      <audio ref={audioRef} className="hidden">
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AIVoiceClient;