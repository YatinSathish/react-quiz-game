import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CreateQuestion = () => {
  const { state } = useLocation();
  const prevQuestions = state?.questions || [];
  const navigate = useNavigate();

  const isEdit = state?.editIndex !== undefined;

  const [question, setQuestion] = useState(state?.questionToEdit?.question || '');
  const [type, setType] = useState(state?.questionToEdit?.type || '1');
  const [timeLimit, setTimeLimit] = useState(
    state?.questionToEdit?.duration || state?.questionToEdit?.timeLimit || ''
  );
  const [points, setPoints] = useState(state?.questionToEdit?.points || '');


  useEffect(() => {
    if (type === '3') {
      const defaultAnswer = state?.questionToEdit?.correctAnswers?.[0] || 'True';
      setAnswers([
        { text: 'True', isCorrect: defaultAnswer === 'True' },
        { text: 'False', isCorrect: defaultAnswer === 'False' },
      ]);
    }
  }, [type]);

  const [answers, setAnswers] = useState(() => {
    if (state?.questionToEdit?.answers && state?.questionToEdit?.correctAnswers) {
      return state.questionToEdit.answers.map((a) => ({
        text: a,
        isCorrect: state.questionToEdit.correctAnswers.includes(a),
      }));
    }
    if (state?.questionToEdit?.type === '3') {
      return [{ text: 'True', isCorrect: true }]; // default for new judgement questions
    }

    return state?.questionToEdit?.answers || [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ];
  });

  const [mediaType, setMediaType] = useState(state?.questionToEdit?.media?.type || 'none');
  const [mediaUrl, setMediaUrl] = useState(state?.questionToEdit?.media?.url || '');
  const [confirmation, setConfirmation] = useState(false);

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = field === 'isCorrect' ? !updated[index][field] : value;
    setAnswers(updated);
  };

  const addAnswer = () => {
    if (answers.length < 6) setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleCreate = () => {
    const numericTime = Number(timeLimit);
    const numericPoints = Number(points);

    if (!question) {
      toast.error("❌ Question text is required.");
      return;
    }
    if (numericTime < 1) {
      toast.error("⏱️ Time must be at least 1 second.");
      return;
    }
    if (numericPoints <= 0) {
      toast.error("🏆 Points must be greater than 0.");
      return;
    }
    if (answers.length < 2 && type !== '3') {
      toast.error("❓ At least two answers required.");
      return;
    }


    const correctAnswers = answers.filter(a => a.isCorrect);
    if (correctAnswers.length === 0) {
      toast.error("⚠️ Please mark at least one correct answer.");
      return;
    }

    const generateUniqueId = () => {
      const existingIds = prevQuestions.map(q => q.id);
      let newId = 1;
      while (existingIds.includes(newId)) {
        newId++;
      }
      return newId;
    };
    const newQ = {
      id: isEdit ? state.questionToEdit.id : generateUniqueId(),
      type,
      question,
      duration: Number(timeLimit),
      points: Number(points),
      media: mediaType === 'none' ? null : { type: mediaType, url: mediaUrl },
      answers: answers.map(a => a.text),
      correctAnswers: answers.filter(a => a.isCorrect).map(a => a.text),
    };

    let updated;
    if (isEdit) {
      updated = [...prevQuestions];
      updated[state.editIndex] = newQ;
    } else {
      updated = [...prevQuestions, newQ];
    }
    setConfirmation(true);
    setTimeout(() => {
      const isEditMode = state?.isEditMode;
      const gameId = state?.gameId;

      if (isEditMode && gameId) {
        navigate(`/edit/game/${gameId}`, {
          state: {
            updatedQuestions: updated,
            gameName: state?.gameName || '',
            thumbnail: state?.thumbnail || '',
            games: state?.games || [],
            isEditMode: true,
            gameId,
          },
        });
      } else {
        navigate('/create-game', {
          state: {
            updatedQuestions: updated,
            gameName: state?.gameName || '',
            thumbnail: state?.thumbnail || '',
            games: state?.games || [],
            isEditMode: false,
          },
        });
      }
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => {
          const isEditMode = state?.isEditMode;
          const gameId = state?.gameId;

          if (isEditMode && gameId) {
            navigate(`/edit/game/${gameId}`, {
              state: {
                updatedQuestions: prevQuestions,
                gameName: state?.gameName || '',
                thumbnail: state?.thumbnail || '',
                games: state?.games || [],
                isEditMode: true,
                gameId,
              },
            });
          } else {
            navigate('/create-game', {
              state: {
                updatedQuestions: prevQuestions,
                gameName: state?.gameName || '',
                thumbnail: state?.thumbnail || '',
                games: state?.games || [],
                isEditMode: false,
              },
            });
          }
        }}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
      >
        Back to Game Setup
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit Question' : 'Add Question'}
      </h2>

      <label>Question</label>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <label>Question Type</label>
      <div className="flex gap-4 mb-4">
        <label><input type="radio" value="1" checked={type === '1'} onChange={() => setType('1')} /> Single Choice</label>
        <label><input type="radio" value="2" checked={type === '2'} onChange={() => setType('2')} /> Multiple Choice</label>
        <label><input type="radio" value="3" checked={type === '3'} onChange={() => setType('3')} /> Judgement</label>
      </div>

      {type === '3' ? (
        <div className="mb-4">
          <label>Judgement Answer</label>
          <select
            value={answers[0]?.text || 'True'}
            onChange={(e) => {
              const selected = e.target.value;
              setAnswers([
                { text: 'True', isCorrect: selected === 'True' },
                { text: 'False', isCorrect: selected === 'False' },
              ]);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        </div>
      ) : (
        <>
          {answers.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={a.text}
                onChange={(e) => handleAnswerChange(i, 'text', e.target.value)}
                placeholder={`Answer ${i + 1}`}
                className="flex-1 p-2 border rounded"
              />
              {type === '1' ? (
                <input
                  type="radio"
                  name="correct"
                  checked={a.isCorrect}
                  onChange={() =>
                    setAnswers(answers.map((ans, idx) => ({
                      ...ans,
                      isCorrect: idx === i,
                    })))
                  }
                />
              ) : (
                <input
                  type="checkbox"
                  checked={a.isCorrect}
                  onChange={() => handleAnswerChange(i, 'isCorrect')}
                />
              )}
            </div>
          ))}
          {answers.length < 6 && (
            <div className="mb-4">
              <button
                onClick={addAnswer}
                className="text-sm text-blue-600 hover:underline mb-4"
              >
                + Add another answer
              </button>
            </div>
          )}
        </>
      )}

      <label>Time Limit (in seconds)</label>
      <input
        type="number"
        value={timeLimit}
        onChange={(e) => setTimeLimit(e.target.value)}
        className="w-full p-2 mb-1 border rounded"
      />
      {timeLimit !== '' && Number(timeLimit) < 1 && (
        <p className="text-sm text-red-500 mb-4">⛔ Time must be at least 1 minute.</p>
      )}

      <label>Points</label>
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        className="w-full p-2 mb-1 border rounded"
      />
      {points !== '' && Number(points) <= 0 && (
        <p className="text-sm text-red-500 mb-4">⛔ Points must be more than 0.</p>
      )}


      <label>Media</label>
      <select
        value={mediaType}
        onChange={(e) => setMediaType(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="none">None</option>
        <option value="image">Image</option>
        <option value="youtube">YouTube</option>
      </select>

      {mediaType === 'image' && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setMediaUrl(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full p-2 mb-4 border rounded"
          />
          {mediaUrl && (
            <img
              src={mediaUrl}
              alt="Question image"
              className="mb-4 max-h-48 object-contain"
            />
          )}
        </>
      )}

      {mediaType === 'youtube' && (
        <input
          type="text"
          placeholder="YouTube URL"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
      )}

      {confirmation && <p className="text-green-600 mb-4">✅ Question added! Redirecting...</p>}

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {isEdit ? 'Update Question' : 'Create Question'}
      </button>
    </div>
  );
};

export default CreateQuestion;
