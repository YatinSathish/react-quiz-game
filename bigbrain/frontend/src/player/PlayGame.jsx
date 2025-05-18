import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  playersessionstatus,
  currentQuestionForPlayer,
  submitAnswerForCurrentQuestionForPlayer,
  correctAnswerForCurrentQuestionForPlayer,
  collectResultsForPlayer
} from './player_calls';
import FinalResults from './FinalResults';
import LobbyTrivia from './LobbyTrivia';

const PlayGame = () => {
  const { playerId } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [unexpectedErr, setUnexpectedErr] = useState(null);
  const [questionMeta, setQuestionMeta] = useState([]);
  const { state } = useLocation();

  const getResults = async () => {
    try {
      const res = await collectResultsForPlayer(playerId);
      return res;
    } catch (err) {
      console.log(err)
      setUnexpectedErr('true');
    }
  }

  useEffect(() => {
    const pollStatus = setInterval(async () => {
      try {
        const res = await playersessionstatus(playerId);
        if (res.data.started) {
          setGameStarted(true);
          clearInterval(pollStatus);
        }
      } catch (err) {
        if (err.status === 400 && err.response?.data?.error === "Session ID is not an active session") {
          clearInterval(pollStatus);
          const result = await getResults();
          setFinalResults(result.data);
        } else {
          console.error('Failed to fetch game status or results');
        }
      }
    }, 3000);
    return () => clearInterval(pollStatus);
  }, [playerId, gameStarted]);

  const fetchQuestion = async () => {
    const res = await currentQuestionForPlayer(playerId);
    const newQuestion = res.data.question;

    if (!questionData || questionData.id !== newQuestion.id) {
      setQuestionData(newQuestion);
      setQuestionMeta(meta => [...meta, {
        points: newQuestion.points,
        startedAt: newQuestion.isoTimeLastQuestionStarted,
      }]);

      const startTime = new Date(newQuestion.isoTimeLastQuestionStarted);
      const now = new Date();
      const diff = Math.max(0, newQuestion.duration - Math.floor((now - startTime) / 1000));
      setTimeLeft(diff);
      setSelectedAnswers([]);
      setAnswerRevealed(false);
    }
  }

  useEffect(() => {
    const pollQuestion = setInterval(async () => {
      try {
        if (gameStarted) await fetchQuestion();
      } catch (err) {
        if (err.status === 400 && err.response?.data?.error === "Session has not started yet") {
          setGameStarted(false);
        } else if (err.status === 400 && err.response?.data?.error === "Session ID is not an active session") {
          clearInterval(pollQuestion);
          const result = await collectResultsForPlayer(playerId);
          setFinalResults(result.data);
        }
      }
    }, 1000);

    return () => clearInterval(pollQuestion);
  }, [playerId, questionData]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameStarted && questionData && !answerRevealed) {
      (async () => {
        try {
          const res = await correctAnswerForCurrentQuestionForPlayer(playerId);
          setSelectedAnswers(res.data.answers);
          setAnswerRevealed(true);
        } catch (err) {
          console.error('Error fetching answer', err);
        }
      })();
    }
  }, [timeLeft, gameStarted, questionData, playerId, answerRevealed]);

  const toggleAnswer = (text) => {
    if (questionData.type === '1' || questionData.type === '3') {
      setSelectedAnswers([text]);
      submitAnswerForCurrentQuestionForPlayer(playerId, [text]);
    } else {
      const updated = selectedAnswers.includes(text)
        ? selectedAnswers.filter(t => t !== text)
        : [...selectedAnswers, text];
      setSelectedAnswers(updated);
      submitAnswerForCurrentQuestionForPlayer(playerId, updated);
    }
  };

  if (unexpectedErr) {
    return <div className="text-center text-xl p-6 text-red-500 font-semibold">Unexpected Issue on fetching session/results. Please try a new game session...</div>;
  }

  if (!gameStarted && !finalResults) {
    return <LobbyTrivia player={state?.userName} />;
  }

  if (finalResults) {
    return <FinalResults results={finalResults} questionMeta={questionMeta} player={state?.userName} />;
  }

  if (gameStarted && !questionData) {
    fetchQuestion();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-300 relative">
        <div className="absolute -top-5 -right-5 bg-indigo-400 text-white px-4 py-1 rounded-full shadow-md font-mono text-lg rotate-2 animate-bounce">
          ⏳ {timeLeft}s Left
        </div>
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 text-center drop-shadow">{questionData.question}</h1>

        {questionData.media?.type === 'image' && (
          <img src={questionData.media.url} alt="question media" className="w-full max-w-md mx-auto mb-4 rounded-xl shadow-md" />
        )}

        {questionData.media?.type === 'video' && questionData.media.url && (
          <div className="text-center mb-4">
            <a
              href={questionData.media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Watch Video
            </a>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questionData.answers.map((text, idx) => (
            <button
              key={idx}
              onClick={() => toggleAnswer(text)}
              disabled={answerRevealed}
              className={`px-5 py-3 rounded-lg font-semibold transition-all duration-300 shadow border text-left ${answerRevealed
                ? selectedAnswers.includes(text)
                  ? 'bg-green-500 text-white border-green-700 scale-105'
                  : 'bg-white'
                : selectedAnswers.includes(text)
                  ? 'bg-blue-500 text-white border-blue-700 scale-105'
                  : 'bg-white hover:bg-blue-100 border-gray-300'
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        {answerRevealed && (
          <p className="mt-6 text-center text-lg font-bold text-green-600">✅ Answer revealed. Waiting for the next question or results...</p>
        )}
      </div>
    </div>
  );
};

export default PlayGame;
