import { useState, useEffect } from 'react';

const triviaQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Rome", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Leo Tolstoy", "Mark Twain"],
    answer: "William Shakespeare",
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: "Blue Whale",
  },
  {
    question: "What year did World War II end?",
    options: ["1942", "1945", "1948", "1950"],
    answer: "1945",
  },
];

const LobbyTrivia = ({ player }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  console.log(player)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % triviaQuestions.length);
      setSelected(null);
      setFeedback('');
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setFeedback(option === triviaQuestions[current].answer ? '✅ Correct!' : '❌ Nope!');
  };

  const { question, options } = triviaQuestions[current];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-extrabold text-pink-700 drop-shadow mb-2 animate-pulse">
                Welcome to Big Brain, {player} 🧠
      </h1>
      <h2 className="text-xl text-gray-700 mb-4">Waiting for host to start...</h2>
      <p className="text-lg mb-6 italic text-purple-600">Try this fun quiz while you wait!</p>

      <div className="w-full max-w-2xl bg-white border-4 border-pink-300 rounded-2xl shadow-2xl p-6 relative">
        <div className="absolute -top-4 -left-4 rotate-[-3deg] text-sm bg-yellow-300 text-yellow-900 px-2 py-1 rounded shadow-md font-mono animate-bounce">
                    💡 Trivia Time!
        </div>

        <p className="text-2xl font-bold text-indigo-600 mb-4">{question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={`px-5 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md border 
                ${selected === opt
              ? opt === triviaQuestions[current].answer
                ? 'bg-green-500 text-white border-green-700 scale-105'
                : 'bg-red-500 text-white border-red-700 scale-105'
              : 'bg-white hover:bg-blue-100 border-gray-300'
            }
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback && (
          <p className="mt-6 text-center text-xl font-bold text-gray-800 bg-white py-2 px-4 rounded shadow-inner">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default LobbyTrivia;
