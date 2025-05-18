import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const GameControl = () => {
  const { sessionId } = useParams();
  const { state } = useLocation();
  const gameId = state?.gameId;
  const gameName = state?.gameName;
  console.log(state?.gameId)
  console.log(state?.gameName)
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const [pointsList, setPointsList] = useState([]);

  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const fetchStatus = async () => {
    try {
      const res = await api.get(`/admin/session/${sessionId}/status`);
      setStatus(res.data.results);
      setLoading(false);

      const { active, position, questions, isoTimeLastQuestionStarted } = res.data.results;
      if (active && position >= 0) {
        const startedTime = new Date(isoTimeLastQuestionStarted).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startedTime) / 1000);
        const duration = questions[position].duration;
        setTimeLeft(Math.max(duration - elapsed, 0));
      } else {
        setTimeLeft(null);
        if (!active && (!players || players.length === 0)) {
          toast.error("Session Ended");
          navigate('/dashboard');
        }
      }
      if (pointsList.length === 0 && questions.length > 0) {
        setPointsList(questions.map(q => q.points));
      }
    } catch (err) {
      console.error('Failed to fetch status', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleAdvance = async () => {
    if (status.players.length === 0) {
      toast.error("At least one player must join to advance the game.");
      return;
    }

    const isAdvancingToFirstQuestion = status.position === -1;

    if (status.position + 1 >= status.questions.length) {
      await handleStop();
    } else {

      if (isAdvancingToFirstQuestion) {
        setCountdown(3);
        setShowCountdown(true);

        let counter = 3;
        const countdownInterval = setInterval(() => {
          counter--;
          setCountdown(counter);

          if (counter === 0) {
            clearInterval(countdownInterval);
            setShowCountdown(false);

            api.post(`/admin/game/${gameId}/mutate`, { mutationType: 'ADVANCE' })
              .then(() => fetchStatus())
              .catch((err) => console.error('Advance error', err));
          }
        }, 1000);
      } else {
        await api.post(`/admin/game/${gameId}/mutate`, { mutationType: 'ADVANCE' });
        fetchStatus();
      }
    }
  };

  const handleStop = async () => {
    await api.post(`/admin/game/${gameId}/mutate`, { mutationType: 'END' });
    fetchStatus();
    navigate(`/admin/results/${sessionId}`, { state: { gameId, pointsList } });
  };

  if (loading || !status) return <p>Loading...</p>;

  const { players, position, questions, active } = status;
  const isLobby = position === -1;
  const currentQuestion = position >= 0 ? questions[position] : null;
  let advanceLabel = 'Advance';

  if (isLobby) {
    advanceLabel = 'Advance to Quiz';
  } else if (position + 1 === questions.length) {
    advanceLabel = 'Finish and Go to Results';
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
                Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-2">Game Control For {gameName}</h1>
      <p className="text-lg mb-4">Session ID: {sessionId}</p>
      <p className="text-lg mb-4 text-black-600 flex items-center gap-2">
                Session Link:
        <a
          href={`${window.location.origin}/player-join/${sessionId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {`${window.location.origin}/player-join/${sessionId}`}
        </a>
        <button
          className="ml-2 px-2 py-1 text-sm border rounded bg-blue-100 hover:bg-blue-200"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/player-join/${sessionId}`);
          }}
        >
                    Copy
        </button>
      </p>
      <p className="text-lg">Players Joined: {players.length}</p>
      {showCountdown ? (
        <div className="mt-4 text-center text-4xl font-bold text-blue-700">
                    Starting in {countdown}...
        </div>
      ) : isLobby ? (
        <p className="text-yellow-600 mt-4">
          {players.length === 0
            ? 'Waiting for players to join...'
            : 'Players are waiting in the lobby...'}
        </p>
      ) : (
        <div className="mt-6 border p-4 rounded-lg bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Question {position + 1}</h2>
          <p className="text-md mb-2">{currentQuestion.question}</p>
          {currentQuestion.media?.url && currentQuestion.media?.type === 'image' && (
            <img
              src={currentQuestion.media.url}
              alt="Question media"
              className="max-w-xs mb-2"
            />
          )}

          {currentQuestion.media?.url && currentQuestion.media?.type === 'youtube' && (
            <a
              href={currentQuestion.media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mb-2"
            >
                            Click here to watch video
            </a>
          )}
          <ul className="list-disc ml-6">
            {currentQuestion.answers.map((ans, idx) => (
              <li key={idx}>{ans}</li>
            ))}
          </ul>
          <p className="text-sm mt-2">Duration: {currentQuestion.duration}s</p>
          <p className="text-sm">Points: {currentQuestion.points}</p>
          {timeLeft !== null && (
            <p className="text-lg font-semibold mt-2 text-red-600">Time Left: {timeLeft}s</p>
          )}
        </div>
      )}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleAdvance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={!active}
        >
          {advanceLabel}
        </button>
        <button
          onClick={handleStop}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
                    Stop Session
        </button>
      </div>
    </div>
  );
};

export default GameControl;
