- Progressive Disclosure:
    Users are shown only what they need at the moment:
    In the lobby, they see a fun trivia while waiting for the host to start the game.
    Once the game starts, they move to the main question interface.
    After the quiz ends, they’re shown final results.
    Keeps the interface clean and cognitively light.
- Feedback on answer selection:
    Selected answers highlight in blue.
    Correct answers highlight in green after time’s up.
- Game state transitions follow predictable patterns (lobby → question → answer reveal → results).
- Reusable components like create game, create question, lobbytrivia, finalresults help maintain visual and
  structural consistency.
- Handles unexpected errors gracefully with a user-friendly message
- Responsive Design Grid layout adjusts (grid-cols-1 sm:grid-cols-2) to different screen sizes.
- Images and video links are scaled (max-w-md, mx-auto) for mobile compatibility.
- Affordance & Discoverability:
    Answer buttons look clickable (rounded, bordered, hover styles).
    Video/media hints are clearly labeled with "Watch Video" text + link styling.
- Smooth progression with useEffect-driven polls and conditional rendering
- Graceful fallback for session/result errors
- Conditional question polling avoids unnecessary updates
- We made in-game animations for the players for better experience.
- Clear button descriptions, colors for better usability.
- Better structured, designed popups using toastify.
- Countdown before starting a quiz for admin side to improve user experience.
- Ability to navigate to dashboard in all screens so that the user need not use browser controls.
- Countdown before starting a quiz for admin side to improve user experience.
- Button elements for answers - Accessible to screen readers and keyboard users.
- Image alt text - Screen readers know what the image is about.
- Added Semantic HTML: Use <button>,  <h1>–<h6> to ensure smooth screen reader navigation.
- Text has sufficient contrast with its background.
- When the game is in session, all other games will be disabled except for stop game and go to game of that particular game. it also prevents the creation of new game