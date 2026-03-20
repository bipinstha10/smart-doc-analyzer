import React, { useState } from "react";

interface ScoresComponentProps {
  scores: Record<string, number>;
  primaryCategory: string;
  confidence: number;
}

type ScoreEntry = {
  category: string;
  score: number;
  isPrimary: boolean;
};

const ScoresComponent: React.FC<ScoresComponentProps> = ({
  scores,
  primaryCategory,
  confidence,
}) => {
  const [hoveredScore, setHoveredScore] = useState<string | null>(null);

  // Convert object to array and sort by score (descending)
  const sortedScores: ScoreEntry[] = Object.entries(scores)
    .map(([category, score]) => ({
      category,
      score,
      isPrimary: category === primaryCategory,
    }))
    .sort((a, b) => b.score - a.score);

  const scoreValues = Object.values(scores);
  const maxScore = scoreValues.length ? Math.max(...scoreValues) : 0;

  const averageScore = scoreValues.length
    ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
    : 0;

  const getConfidenceColor = (conf: number): string => {
    if (conf >= 50) return "from-green-400 to-green-600";
    if (conf >= 30) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  if (!sortedScores.length) {
    return (
      <div className="p-6 text-center text-gray-500">No scores available</div>
    );
  }

  const formatLabel = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Classification Scores
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Confidence breakdown by category
        </p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {sortedScores.map(({ category, score, isPrimary }) => (
          <div
            key={category}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              isPrimary
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
            } ${
              hoveredScore === category
                ? "ring-2 ring-blue-300 scale-[1.02]"
                : ""
            }`}
            onMouseEnter={() => setHoveredScore(category)}
            onMouseLeave={() => setHoveredScore(null)}
          >
            {/* Badge */}
            {isPrimary && (
              <div className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-white uppercase bg-blue-600 rounded">
                Primary
              </div>
            )}

            {/* Category Label */}
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {formatLabel(category)}
            </div>

            {/* Score Value */}
            <div className="text-2xl font-bold text-gray-900 mb-3">
              {score.toFixed(2)}%
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500"
                style={{
                  width: maxScore ? `${(score / maxScore) * 100}%` : "0%",
                }}
              />
            </div>

            {/* Percentage Text */}
            <div className="text-xs text-gray-400 font-medium">
              {maxScore
                ? `${((score / maxScore) * 100).toFixed(0)}% of max`
                : "0% of max"}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Container */}
      <div className="grid grid-cols-3 gap-3 p-4 mb-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Highest Score
          </p>
          <p className="text-base font-bold text-gray-900">
            {formatLabel(sortedScores[0].category)}
          </p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {sortedScores[0].score.toFixed(2)}%
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Average Score
          </p>
          <p className="text-base font-bold text-gray-900">
            {averageScore.toFixed(2)}%
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Category
          </p>
          <p className="text-base font-bold text-gray-900">
            {formatLabel(primaryCategory)}
          </p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {confidence.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Overall Confidence
          </p>
          <p className="text-lg font-bold text-gray-900">
            {confidence.toFixed(1)}%
          </p>
        </div>

        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 bg-linear-to-r ${getConfidenceColor(
              confidence,
            )}`}
            style={{
              width: `${confidence}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoresComponent;
