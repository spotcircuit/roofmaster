import React, { useState } from 'react';

interface ScorecardCriteria {
  item: string;
  maxPoints: number;
  description: string;
}

interface ScorecardCategory {
  name: string;
  weight: number;
  criteria: ScorecardCriteria[];
}

interface ScorecardProps {
  categories: ScorecardCategory[];
  onSubmit: (scores: number[][], totalScore: number) => void;
  userName?: string;
  scenarioName?: string;
}

export default function Scorecard({ categories, onSubmit, userName, scenarioName }: ScorecardProps) {
  // Initialize scores array with zeros
  const initScores = categories.map(cat => cat.criteria.map(() => 0));
  const [scores, setScores] = useState<number[][]>(initScores);
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (categoryIndex: number, criteriaIndex: number, value: number) => {
    const newScores = [...scores];
    newScores[categoryIndex][criteriaIndex] = value;
    setScores(newScores);
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    categories.forEach((category, catIndex) => {
      const categoryScore = scores[catIndex].reduce((sum, score) => sum + score, 0);
      const categoryMax = category.criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);
      const categoryPercentage = (categoryScore / categoryMax) * category.weight;
      totalScore += categoryPercentage;
    });
    return Math.round(totalScore * 100);
  };

  const calculateCategoryScore = (categoryIndex: number) => {
    const category = categories[categoryIndex];
    const categoryScore = scores[categoryIndex].reduce((sum, score) => sum + score, 0);
    const categoryMax = category.criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0);
    return { score: categoryScore, max: categoryMax };
  };

  const handleSubmit = () => {
    const totalScore = calculateTotalScore();
    setSubmitted(true);
    onSubmit(scores, totalScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">24-7 Restoration Performance Scorecard</h2>
        {userName && <p className="text-gray-600 mt-1">Evaluating: {userName}</p>}
        {scenarioName && <p className="text-gray-600">Scenario: {scenarioName}</p>}
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, catIndex) => {
          const { score: catScore, max: catMax } = calculateCategoryScore(catIndex);
          return (
            <div key={catIndex} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <div className="text-sm text-gray-600">
                  Weight: {(category.weight * 100).toFixed(0)}% | Score: {catScore}/{catMax}
                </div>
              </div>

              <div className="space-y-3">
                {category.criteria.map((criterion, critIndex) => (
                  <div key={critIndex} className="bg-gray-50 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{criterion.item}</p>
                        {criterion.description && (
                          <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <select
                          value={scores[catIndex][critIndex]}
                          onChange={(e) => handleScoreChange(catIndex, critIndex, parseInt(e.target.value))}
                          disabled={submitted}
                          className="block w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          {[...Array(criterion.maxPoints + 1)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                        <span className="text-xs text-gray-500 mt-1">of {criterion.maxPoints}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Score */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Score</h3>
            <p className="text-sm text-gray-600 mt-1">Performance Level: {getPerformanceLevel(totalScore)}</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>
              {totalScore}%
            </div>
          </div>
        </div>

        {/* Score breakdown visual */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                totalScore >= 90 ? 'bg-green-500' :
                totalScore >= 75 ? 'bg-blue-500' :
                totalScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${totalScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {!submitted ? (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Evaluation
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Evaluation submitted successfully!</p>
          <p className="text-sm text-green-700 mt-1">
            Final Score: {totalScore}% - {getPerformanceLevel(totalScore)}
          </p>
        </div>
      )}
    </div>
  );
}