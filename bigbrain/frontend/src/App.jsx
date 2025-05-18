import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './login/Login'
import Register from './login/Register';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Header from './Header';
import Dashboard from './dashboard/Dashboard'
import './index.css';

import CreateGame from './game/CreateGame';
import CreateQuestion from './game/CreateQuestion';
import PlayJoin from './player/PlayJoin';
import PlayGame from './player/PlayGame';
import GameControl from './dashboard/gameControl';
import ResultsAdmin from './dashboard/resultsAdmin';
import GameHistory from './dashboard/gameHistory';

function AppWrapper() {
  return (

    <AuthProvider>
      <App />
    </AuthProvider>

  );
}

function App() {
  const { user } = useAuth();
  console.log('auth user', user)


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-game"
          element={user ? <CreateGame /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-question"
          element={user ? <CreateQuestion /> : <Navigate to="/login" />}
        />
        <Route
          path="/player-join/:sessionId"
          element={<PlayJoin />}
        />
        <Route
          path="/play-game/:sessionId/:playerId"
          element={<PlayGame />}
        />
        <Route
          path="/edit/game/:id"
          element={user ? <CreateGame /> : <Navigate to="/login" />}
        />
        <Route
          path="/game/:gameId/question/:questionId"
          element={user ? <CreateQuestion /> : <Navigate to="/login" />}
        />
        <Route
          path="/game/session/:sessionId"
          element={user ? <GameControl /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/results/:sessionId"
          element={user ? <ResultsAdmin /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/game/history/:gameId"
          element={user ? <GameHistory /> : <Navigate to="/login" />}
        />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default AppWrapper;
