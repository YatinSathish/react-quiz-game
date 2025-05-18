import { useState, useEffect } from 'react';

const FinalResults = ({ results, questionMeta, player }) => {


  const total = results.length;
  const correctCount = results.filter(r => r.correct).length;
  const percentage = Math.round((correctCount / total) * 100);
  const [displayPercent, setDisplayPercent] = useState(0);

  const totalPoints = results.reduce((sum, r, idx) => {
    if (r.correct) {
      return sum + (questionMeta[idx]?.points || 0);
    }
    return sum;
  }, 0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setDisplayPercent(Math.min(progress, percentage));
      if (progress >= percentage) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [percentage]);

  if (!results || !questionMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl text-gray-700 px-6 text-center">
        Session Ended. Please try a new game session...
      </div>
    );
  }

  const getMessage = () => {
    if (percentage === 100) return '🎉 Perfect Score!';
    if (percentage >= 75) return '🔥 Great Job!';
    if (percentage >= 50) return '👍 Not bad!';
    if (percentage > 0) return '💪 Keep practicing!';
    return '😅 Better luck next time!';
  };

  const getAnswerTime = (start, end) => {
    if (!start || !end) return 'N/A';
    const time = (new Date(end) - new Date(start)) / 1000;
    return `${time.toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-3xl bg-gray-50 p-8 rounded-2xl shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Game Over</h2>
        <p className="text-lg text-center mb-2 text-gray-700">
          You got <span className="font-semibold text-green-600">{correctCount}</span> out of{' '}
          <span className="font-semibold">{total}</span> correct
        </p>
        <p className="text-lg text-center text-gray-700 mb-6">
          Total Points Scored: <span className="font-semibold text-blue-600">{totalPoints}</span>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${displayPercent}%` }}
          />
        </div>
        <p className="text-center font-mono text-lg text-gray-800">{displayPercent}%</p>
        <p className="mt-4 text-center text-2xl font-medium text-purple-700">{getMessage()} <span className="font-bold">{player}</span></p>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Question Stats</h3>
          <div className="space-y-4">
            {results.map((r, idx) => (
              <div key={idx} className="p-4 bg-white border rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800">
                  Question {idx + 1}: {r.correct ? '✅ Correct' : '❌ Incorrect'}
                </p>
                <p className="text-gray-600">Answered: {r.answers.join(', ') || 'None'}</p>
                <p className="text-gray-600">Time Taken: {getAnswerTime(r.questionStartedAt, r.answeredAt)}</p>
                <p className="text-gray-600">Points: {questionMeta[idx]?.points ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalResults;
