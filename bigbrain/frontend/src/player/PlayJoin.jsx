// pages/PlayJoin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinsession } from './player_calls';

const PlayJoin = () => {
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (paramSessionId) {
      setSessionId(paramSessionId);
    }
  }, [paramSessionId]);

  const handleJoin = async () => {
    if (!sessionId || !userName.trim()) {
      setError('Session ID and Name are required');
      return;
    }
    try {
      const res = await joinsession(userName, sessionId);
      const playerId = res.data.playerId;
      if (playerId) {
        navigate(`/play-game/${sessionId}/${playerId}`, { state: { userName } });
      } else {
        setError('Unable to join the session');
      }
    } catch (err) {
      console.log(err)
      setError('Failed to join the game session');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Join Game Session</h1>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Session ID</label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter session ID"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
          />
        </div>
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default PlayJoin;
