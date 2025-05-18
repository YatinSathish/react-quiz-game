import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const ResultsAdmin = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { state } = useLocation(); // Contains gameId and points
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const pointsList = state?.pointsList || [];
  console.log('pointslist', pointsList);
  const fetchResults = async () => {
    try {
      const res = await api.get(`/admin/session/${sessionId}/results`);
      console.log('gameresults', res.data);
      setResults(res.data.results);
    } catch (err) {
      console.error('Failed to fetch results', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <p>Loading results...</p>;
  if (results.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg mb-4">No players or results yet.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
                    Back to Dashboard
        </button>
      </div>
    );
  }


  // === Preparing stats ===
  const questionCount = results[0]?.answers.length || 0;

  const questionCorrectCount = new Array(questionCount).fill(0);
  const questionTotalTime = new Array(questionCount).fill(0);

  results.forEach(player => {
    player.answers.forEach((ans, i) => {
      if (ans.correct) questionCorrectCount[i]++;
      questionTotalTime[i] += new Date(ans.answeredAt) - new Date(ans.questionStartedAt);
    });
  });

  const topUsers = [...results]
    .map(player => {
      const score = player.answers.reduce((sum, ans, i) => {
        return ans.correct ? sum + (pointsList[i] || 0) : sum;
      }, 0);
      return {
        name: player.name,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const percentageCorrect = questionCorrectCount.map(c => (c / results.length * 100).toFixed(2));
  const avgTime = questionTotalTime.map(t => (t / results.length / 1000).toFixed(2)); // in seconds

  console.log('topusers', topUsers);
  // === Chart Data ===
  const labels = Array.from({ length: questionCount }, (_, i) => `Q${i + 1}`);

  const correctData = {
    labels,
    datasets: [
      {
        label: '% Correct',
        data: percentageCorrect,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const timeData = {
    labels,
    datasets: [
      {
        label: 'Avg Time (s)',
        data: avgTime,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
                Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Game Results</h1>

      {/* Top 5 Players Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Top 5 Players</h2>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((player, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        {/* 📊 Correct Percentage Bar Chart */}
        <div className="flex-1 min-w-[300px] max-w-[500px] h-[300px] border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Question Correctness (%)</h2>
          <Bar
            data={correctData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        {/* ⏱️ Average Response Time */}
        <div className="flex-1 min-w-[300px] max-w-[500px] h-[300px] border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Avg Response Time per Question</h2>
          <Line
            data={timeData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsAdmin;