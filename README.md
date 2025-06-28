# react-quiz-game
A ReactJS-based quiz game management system featuring real-time session control,  game editing, and result visualization. Designed with a responsive UI and robust admin functionality for managing multiplayer quiz sessions.
The frontend interfaces with a pre-provided backend API.

# How to run:

Navigate to the frontend folder and run `npm install` in that folder to install the ReactJS app. Then run `npm run dev` to start the ReactJS app.
Open the backend and run `npm start` to start the backend.

# 🚀 Features:
## 🔧 Admin Dashboard:
- View all created games in a responsive grid layout.
- Create, edit, or delete quiz games.
- View game history and past sessions.
- Displays total questions and duration per game.

## 🎮 Game Management:
- Add/edit quiz questions with:
  - Single choice, multiple choice, and judgement (true/false) types.
  - Media attachments (YouTube link or image upload).
  - Adjustable time limits and point values.
- Real-time validation for inputs and answer selections.
- Reorder or remove questions before finalizing the game.

## 📡 Session Control:
- Start/stop live game sessions.
- Generate and copy a join link for players.
- Restrict dashboard actions during an active session.
- Navigate to live session from dashboard.

## 📊 Results Visualization:
- View player results after session ends.
- Pass relevant metadata like points and question IDs to the results page.

## 🧪 Component Testing:
- Unit tests for critical components (e.g. login, header, question creation) using Jest and React Testing Library.
- Input validation and dynamic rendering tested.

## 💅 UI and Styling:
- Fully responsive interface built with Tailwind CSS.
- Clear call-to-actions and error feedback.
- Toast notifications for all major actions (create, delete, session start/stop).

## 🧭 Navigation & Routing:
- Uses React Router DOM for seamless navigation between views.
- State management via route state for cross-page data transfer.
