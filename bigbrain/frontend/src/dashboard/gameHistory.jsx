import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const GameHistory = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [pointsList, setPointsList] = useState([]);
  const [gameTitle, setGameTitle] = useState('');

  useEffect(() => {
    if (location.state?.game) {
      const game = location.state.game;
      setGameTitle(game.name || '');
      setSessions([...game.oldSessions].reverse());
      const points = game.questions?.map((q) => q.points) || [];
      setPointsList(points);
    }
  }, [location.state]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mb-4"
      >
                Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-1">{gameTitle}</h1>
      <h1 className="text-2xl font-bold mb-4">Previous Sessions for Game ID: {gameId}</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-600">No past sessions found for this game.</p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((sessionId, index) => (
            <li
              key={sessionId}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Session #{sessions.length - index}</p>
                <code className="text-blue-700 break-all text-sm">{sessionId}</code>
              </div>
              <button
                onClick={() =>
                  navigate(`/admin/results/${sessionId}`, {
                    state: { pointsList },
                  })
                }
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                                View Results
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameHistory;