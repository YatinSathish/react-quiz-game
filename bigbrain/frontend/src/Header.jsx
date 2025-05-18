import { useAuth } from './context/useAuth'
import { useLocation } from 'react-router-dom';
const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  console.log('header', user)
  if (!user) return null;

  const shouldHideHeader = /^\/play-game\/\d+\/\d+$/.test(location.pathname)
    || /^\/player-join\/\d+$/.test(location.pathname);

  if (shouldHideHeader) return null;
  return (
    <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <span className="text-gray-700 font-medium">
        Logged in as: {user.name || user.email}
      </span>
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-indigo-600">
        Big Brain
      </h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;