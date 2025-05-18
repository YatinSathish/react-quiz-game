import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uniqueId, createGame } from './game_calls';
import { useAuth } from '../context/useAuth';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CreateGame = () => {
  const [gameName, setGameName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
  const totalDuration = questions.reduce((acc, q) => acc + q.duration, 0);
  const { state } = useLocation();
  useEffect(() => {
    if (state?.updatedQuestions) {
      setQuestions(state.updatedQuestions);
    }
    if (state?.gameName) {
      setGameName(state.gameName);
    }
    if (state?.thumbnail) {
      setThumbnail(state.thumbnail);
    }
    if (state?.games) {
      setGames(state.games);
    }
  }, [state]);

  const isEditMode = state?.isEditMode || false;

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitGame = async () => {
    if (!gameName || questions.length === 0) {
      setError('Game must have a name and at least one question.');
      return;
    }

    try {
      const gameId = isEditMode ? state.gameId : uniqueId();
      const formattedQuestions = questions.map((q) => {
        const isStructuredAnswers = q.answers && typeof q.answers[0] === 'object';

        const answers = isStructuredAnswers
          ? q.answers.map((a) => a.text)
          : q.answers;

        const correctAnswers = isStructuredAnswers
          ? q.answers.filter((a) => a.isCorrect).map((a) => a.text)
          : q.correctAnswers || [];

        return {
          id: q.id,
          type: q.type,
          question: q.question,
          duration: q.duration,
          points: q.points,
          media: q.media,
          answers,
          correctAnswers,
        };
      });

      const newGame = {
        id: gameId,
        name: gameName,
        owner: user.email,
        thumbnail,
        no_of_questions: questions.length,
        total_duration: totalDuration,
        total_points: totalPoints,
        questions: formattedQuestions,
      };

      let updatedGames;

      if (isEditMode) {
        // Replace the existing game with the updated one
        updatedGames = (state?.games || []).map((g) =>
          g.id === state.gameId ? newGame : g
        );
      } else {
        // Append new game
        updatedGames = [...(state?.games || []), newGame];
      }

      const payload = {
        games: updatedGames,
      };

      await createGame(payload);
      navigate('/dashboard');
    } catch (err) {
      console.log(err)
      setError('Failed to create game.');
    }
  };

  const handleAddQuestion = () => {
    navigate('/create-question', {
      state: {
        questions,
        gameName,
        thumbnail,
        games,
        isEditMode,
        gameId: state?.gameId, // keep existing game ID
      },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Game' : 'Create New Game'}
      </h1>

      {error && <p className="text-red-600">{error}</p>}
      <label className="block font-medium mb-1">Game Title</label>
      <input
        type="text"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="Game Name"
        className="w-full p-2 mb-4 border rounded"
      />
      <label className="block font-medium mb-1">Thumbnail Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        className="mb-4"
      />

      {thumbnail && (
        <img src={thumbnail} alt="Game Thumbnail" className="w-48 h-28 object-cover mb-4 rounded" />
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Question
        </button>

        <div className="text-sm text-gray-700">
          <p>Total Questions: {questions.length}</p>
          <p>Total Points: {totalPoints}</p>
          <p>Total Time: {totalDuration} sec</p>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Added Questions</h3>
          <ul className="space-y-2">
            {questions.map((q, index) => (
              <li key={q.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>Question {index + 1}: {q.question.slice(0, 30)}...</span>
                <div className="space-x-2">
                  {isEditMode && (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() =>
                        navigate(`/game/${state?.gameId}/question/${q.id}`, {
                          state: {
                            editIndex: index,
                            questionToEdit: q,
                            questions,
                            gameName,
                            thumbnail,
                            games,
                            isEditMode,
                            gameId: state?.gameId,
                          },
                        })
                      }
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => {
                      const updated = [...questions];
                      updated.splice(index, 1);
                      setQuestions(updated);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmitGame}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {/* Update (or) Submit Game */}
        {isEditMode ? 'Update Game' : 'Submit Game'}
      </button>
    </div>
  );
};

export default CreateGame;
