import React, { useState } from 'react';

type QuizQuestion = {
  id: number;
  question: string;
  correctAnswer: string;
  options: string[];
};

type QuizProps = {
  moduleId: number;
  moduleTitle: string;
  onClose: () => void;
};

const moduleQuizzes: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 1,
      question: "Why is maintaining eye contact and standing tall important when door knocking?",
      correctAnswer: "It conveys honesty and credibility, making homeowners more likely to trust you.",
      options: [
        "It intimidates homeowners into listening to your pitch.",
        "It conveys honesty and credibility, making homeowners more likely to trust you.",
        "It helps you see over fences to identify other potential customers.",
        "It's a legal requirement for door-to-door sales in most states."
      ]
    },
    {
      id: 2,
      question: "When should you use a fast speaking tone during a sales pitch?",
      correctAnswer: "When creating a sense of urgency with key information.",
      options: [
        "When explaining complex technical details about roofing.",
        "When the homeowner seems impatient or in a hurry.",
        "When creating a sense of urgency with key information.",
        "Fast speaking tones should never be used in roofing sales."
      ]
    },
    {
      id: 3,
      question: "What is 'fractured matting' in the context of roof damage?",
      correctAnswer: "Damage within shingle layers that compromises integrity but may not be visible.",
      options: [
        "A technique used to repair minor roof leaks.",
        "The pattern left by improper installation of roof vents.",
        "The natural wear pattern of asphalt shingles after 5-7 years.",
        "Damage within shingle layers that compromises integrity but may not be visible."
      ]
    },
    {
      id: 4,
      question: "Why are setting goals and maintaining accountability emphasized?",
      correctAnswer: "They provide a roadmap for progress and ensure necessary work is done.",
      options: [
        "They are only important for new sales representatives.",
        "They help reduce the company's legal liability.",
        "They provide a roadmap for progress and ensure necessary work is done.",
        "They are primarily used to identify underperforming employees."
      ]
    },
    {
      id: 5,
      question: "Why is it important to understand and articulate the company's mission?",
      correctAnswer: "To explain why customers should choose your company over competitors.",
      options: [
        "It's only important during the job interview process.",
        "To avoid legal issues if questioned by homeowners.",
        "It has no impact on sales performance.",
        "To explain why customers should choose your company over competitors."
      ]
    }
  ],
  2: [
    {
      id: 1,
      question: "What are some key signs of storm damage to look for when identifying potential leads?",
      correctAnswer: "Leaves knocked down, fresh dings on fences, and dents on cars.",
      options: [
        "Cracked windows, broken tree branches, and missing mailboxes.",
        "Leaves knocked down, fresh dings on fences, and dents on cars.",
        "Discolored roof shingles, peeling paint, and rusty gutters.",
        "Neighbor's roofs being replaced and insurance adjusters in the area."
      ]
    },
    {
      id: 2,
      question: "Why is it important to research the neighborhood before canvassing?",
      correctAnswer: "To tailor your pitch with relevant details about storm dates, roof ages, and shingle types.",
      options: [
        "To avoid neighborhoods with high crime rates.",
        "To determine which houses have the highest property values.",
        "To tailor your pitch with relevant details about storm dates, roof ages, and shingle types.",
        "To identify which homes have already been approached by competitors."
      ]
    },
    {
      id: 3,
      question: "What is 'pre-framing' and why is it useful?",
      correctAnswer: "Setting client expectations for the next step to reduce uncertainty and prevent ghosting.",
      options: [
        "Preparing the roof frame before installation of new shingles.",
        "Creating a mental image of what the finished roof will look like.",
        "Establishing pricing expectations before providing a formal quote.",
        "Setting client expectations for the next step to reduce uncertainty and prevent ghosting."
      ]
    },
    {
      id: 4,
      question: "How should the CRM (Elite App) be used effectively in prospecting?",
      correctAnswer: "For tracking contacts, conversations, and follow-up needs in real-time.",
      options: [
        "Only for recording successful sales and completed jobs.",
        "Primarily as a way to clock in and out of work shifts.",
        "For tracking contacts, conversations, and follow-up needs in real-time.",
        "As a way to monitor competitor activities in the area."
      ]
    },
    {
      id: 5,
      question: "Why is consistent follow-up important with initially uninterested homeowners?",
      correctAnswer: "It demonstrates persistence and can build trust over time, leading to reconsideration.",
      options: [
        "It's legally required to make at least three contact attempts.",
        "It helps meet the company's required number of daily contacts.",
        "It ensures you don't miss out when their roof eventually fails completely.",
        "It demonstrates persistence and can build trust over time, leading to reconsideration."
      ]
    }
  ]
};

const ModuleQuiz: React.FC<QuizProps> = ({ moduleId, moduleTitle, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  
  const questions = moduleQuizzes[moduleId] || [];
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestion(currentQuestion + 1);
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };
  
  if (questions.length === 0) {
    return (
      <div className="glass-card p-6 mt-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz Not Available</h3>
        <p className="text-gray-600 mb-4">The quiz for this module is not available yet.</p>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Module
        </button>
      </div>
    );
  }
  
  const isQuizCompleted = answeredQuestions.length === questions.length;
  const currentQ = questions[currentQuestion];
  
  return (
    <div className="glass-card bg-gradient-to-br from-blue-50 to-indigo-50 border-t-4 border-blue-500 p-6 mt-6 shadow-lg animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-blue-800">
          Module {moduleId}: {moduleTitle} Quiz
        </h3>
        <div className="flex items-center">
          <span className="text-sm font-medium text-blue-700 mr-4">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {isQuizCompleted ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h4 className="text-xl font-bold text-blue-800 mb-2">Quiz Completed!</h4>
          <p className="text-lg text-blue-700 mb-4">
            Your Score: <span className="font-bold">{score}/{questions.length}</span>
          </p>
          <p className="text-gray-600 mb-6">
            {score === questions.length 
              ? "Perfect score! You've mastered this module." 
              : "Good job! Review the material to improve your score."}
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleRestartQuiz}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retake Quiz
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Module
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              {currentQ.question}
            </h4>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    showResult && option === currentQ.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : showResult && option === selectedAnswer && option !== currentQ.correctAnswer
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : selectedAnswer === option
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                      showResult && option === currentQ.correctAnswer
                        ? 'bg-green-500 text-white'
                        : showResult && option === selectedAnswer && option !== currentQ.correctAnswer
                        ? 'bg-red-500 text-white'
                        : selectedAnswer === option
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && option === currentQ.correctAnswer && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                    {showResult && option === selectedAnswer && option !== currentQ.correctAnswer && (
                      <span className="ml-2 text-red-600">✗</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {showResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-green-100 border border-green-200 text-green-800'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  selectedAnswer === currentQ.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {selectedAnswer === currentQ.correctAnswer ? '✓' : '✗'}
                </div>
                <div>
                  <p className="font-bold">
                    {selectedAnswer === currentQ.correctAnswer
                      ? 'Correct!'
                      : 'Incorrect!'}
                  </p>
                  <p className="text-sm mt-1">
                    {selectedAnswer === currentQ.correctAnswer
                      ? 'Great job! You selected the right answer.'
                      : `The correct answer is: ${currentQ.correctAnswer}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
              ></div>
            </div>
            {showResult && (
              <button
                onClick={handleNextQuestion}
                className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleQuiz;
