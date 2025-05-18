import { useEffect, useState } from 'react';
import { fetchGames, deleteGame, startGame, stopGame } from './dashboard_calls';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [activeSessions, setActiveSessions] = useState(new Map());
  const navigate = useNavigate();
  const isAnyGameActive = activeSessions.size > 0;


  useEffect(() => {
    const loadGames = async () => {
      try {
        const res = await fetchGames();
        const fetchedGames = res.data.games;
        setGames(fetchedGames);
        console.log(games)
        const activeMap = new Map();
        fetchedGames.forEach((game) => {
          if (game.active) {
            activeMap.set(game.id, game.active);
          }
        });
        console.log(activeMap)
        setActiveSessions(activeMap);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load games');
      }
    };

    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const res = await fetchGames();
      const fetchedGames = res.data.games;
      setGames(fetchedGames);
      const activeMap = new Map();
      fetchedGames.forEach((game) => {
        if (game.active) {
          activeMap.set(game.id, game.active);
        }
      });
      console.log(activeMap)
      setActiveSessions(activeMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load games');
    }
  };

  const handleCreateGame = () => {
    navigate('/create-game', { state: { games } });
  };


  const handleDelete = async (id) => {
    try {
      const updatedGames = games.filter((g) => g.id !== id);
      console.log('deleted games update', updatedGames)
      await deleteGame(updatedGames);
      await loadGames();
    } catch (err) {
      toast.error('Failed to delete game', err);
    }
  };

  const handleStartSession = async (gameId,gameName) => {
    try {

      const res = await startGame(gameId);
      const sessionId = res.data.data.sessionId;
      const updatedSessions = new Map(activeSessions);
      updatedSessions.set(gameId, sessionId);
      setActiveSessions(updatedSessions);
      toast.success(
        <div>
          <p className="font-semibold">Game session started!</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <code className="text-blue-700 text-xs break-all">
              {`${window.location.origin}/play/${sessionId}`}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/player-join/${sessionId}`);
                toast.info('Link copied!');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
        </div>,
        { autoClose: 5000 }
      );
      navigator.clipboard.writeText(`${window.location.origin}/play/${sessionId}`);
      await loadGames();
      navigate(`/game/session/${sessionId}`, {
        state: { gameId,gameName },
      });

    } catch (err) {
      console.log(err)
      toast.error('Failed to start session');
    }
  };


  const handleStopSession = async (gameId) => {
    try {
      const sessionId = activeSessions.get(gameId);
      await stopGame(gameId);
      const updatedSessions = new Map(activeSessions);
      updatedSessions.delete(gameId);
      setActiveSessions(updatedSessions);

      const game = games.find(g => g.id === gameId);
      const pointsList = game?.questions?.map(q => q.points) || [];

      toast.info(
        ({ closeToast }) => (
          <div>
            <p>Game session stopped.</p>
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                navigate(`/admin/results/${sessionId}`, {
                  state: { pointsList },
                });
                closeToast();
              }}
            >
              View Results
            </button>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: true,
          style: { color: 'black' },
        }
      );
    } catch (err) {
      console.log(err)
      toast.error('Failed to stop session');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 flex gap-2">

        <button
          onClick={handleCreateGame}
          
          className={`px-4 py-2 rounded text-white ${isAnyGameActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled = {isAnyGameActive}
        >
          Create A New Game
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {game.thumbnail && (
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{game.name}</h2>
              <p className="text-sm text-gray-600">Questions: {game.no_of_questions || 0}</p>
              <p className="text-sm text-gray-600">Total Duration: {game.total_duration || 0}s</p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() =>
                    navigate(`/edit/game/${game.id}`, {
                      state: {
                        isEditMode: true,
                        gameId: game.id,
                        gameName: game.name,
                        thumbnail: game.thumbnail,
                        updatedQuestions: game.questions,
                        games,
                      },
                    })
                  }
                  disabled={isAnyGameActive}
                  className={`px-3 py-1 rounded text-white ${isAnyGameActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  Edit Game
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/game/history/${game.id}`, {
                      state: { game },
                    })
                  }
                  disabled={isAnyGameActive}
                  className={`px-3 py-1 rounded text-white ${isAnyGameActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  History
                </button>

                <button
                  onClick={() => handleDelete(game.id)}
                  disabled={isAnyGameActive}
                  className={`px-3 py-1 rounded text-white ${isAnyGameActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Delete Game
                </button>

                {!activeSessions.has(game.id) ? (
                  <button
                    onClick={() => handleStartSession(game.id,game.name)}
                    disabled={isAnyGameActive}
                    className={`px-3 py-1 rounded text-white ${isAnyGameActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Start Game
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleStopSession(game.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Stop Game
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/game/session/${activeSessions.get(game.id)}`, {
                        state: { gameId: game.id,gameName: game.name },
                      })}
                    >
                      Go To Game
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-700 flex-wrap">
                      <span>Game in Progress:</span>
                      <code className="font-mono text-blue-700">{activeSessions.get(game.id)}</code>
                      <button
                        className="bg-gray-200 px-2 py-1 rounded text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/player-join/${activeSessions.get(game.id)}`);
                          toast.info('Session link copied!');
                        }}
                      >
                        Copy Link
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
