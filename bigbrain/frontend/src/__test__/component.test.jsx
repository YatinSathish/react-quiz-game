import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from "vitest";
import CreateQuestion from '../game/CreateQuestion';
import Login from '../login/Login';
import PlayJoin from '../player/PlayJoin';
import GameHistory from '../dashboard/gameHistory';
import { MemoryRouter } from 'react-router-dom';
import { joinsession } from '../player/player_calls';

const mockLogin = vi.fn();
const mockUseLocation = vi.fn();
const mockUseParams = vi.fn();

vi.mock('../player/player_calls', () => ({
  joinsession: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({
    sessionId: 'test-session-id',
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      state: {
        questions: [],
      },
    }),
  };
});

vi.mock('../context/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
  }),
}));

describe('CreateQuestion Component', () => {
  it('renders Create Question form elements', () => {
    render(<CreateQuestion />, { wrapper: MemoryRouter });

    expect(screen.getByText(/Add Question/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Question/i)).toBeInTheDocument();
  });

  it('adds a new answer input when "+ Add another answer" is clicked', () => {
    render(<CreateQuestion />, { wrapper: MemoryRouter });

    const addBtn = screen.getByText('+ Add another answer');
    fireEvent.click(addBtn);
    const answerInputs = screen.getAllByPlaceholderText(/Answer/i);
    expect(answerInputs.length).toBe(3);
  });
});

describe('Login Component', () => {
  it('renders email and password input fields', () => {
    render(<Login />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it('calls login on form submit with valid credentials', async () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});

describe('PlayJoin Component', () => {
  it('renders Session ID and Name input fields and Join Game button', () => {
    render(<PlayJoin />, { wrapper: MemoryRouter });

    expect(screen.getByPlaceholderText(/Enter session ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join Game/i })).toBeInTheDocument();
  });

  it('displays an error if session ID or name is missing', async () => {
    render(<PlayJoin />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole('button', { name: /Join Game/i }));

    expect(await screen.findByText(/Session ID and Name are required/i)).toBeInTheDocument();
  });

  it('displays an error message if joinsession fails', async () => {
    joinsession.mockRejectedValue(new Error('Failed to join session'));

    render(<PlayJoin />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText(/Enter session ID/i), {
      target: { value: 'test-session-id' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), {
      target: { value: 'test-user' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Join Game/i }));
    expect(await screen.findByText(/Failed to join the game session/i)).toBeInTheDocument();
  });
});

describe('GameHistory Component', () => {

  it('displays a message if no sessions are available', async () => {
    const mockGame = {
      name: 'Test Game',
      oldSessions: [],
      questions: [{ points: 10 }, { points: 20 }],
    };

    mockUseLocation.mockReturnValue({
      state: { game: mockGame },
    });

    render(<GameHistory />, { wrapper: MemoryRouter });
    await waitFor(() => {
      expect(screen.getByText(/No past sessions found for this game/i)).toBeInTheDocument();
    });
  });
});