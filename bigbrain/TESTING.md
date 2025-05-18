Components Tested:
    CreateQuestion
    Login
    PlayJoin
    GameHistory
CreateQuestion Component
    Test 1: Verifies that the "Add Question" form and the "Create Question" button are rendered correctly.
 
    Test 2: Ensures the functionality of  adding answer inputs when the "+ Add another answer" button is clicked.
 
Login Component
    Test 1: Confirms that the email and password input fields are there.
 
    Test 2: Verifies that login function is called with correct credentials upon form submission.
 
PlayJoin Component
    Test 1: Ensures the session ID and name input fields are rendered correctly.
 
    Test 2: Checks that an error message appears if the session ID or name is missing after user clicks on the "Join Game" button.
 
GameHistory Component
    Test: Verifies that if no sessions are available for the game, the component shows the appropriate message which is "No past sessions found for this game."
 
The tests focus on key actions users will take in the app to make sure everything works as it should. For the CreateQuestion component, the tests check if the form shows up correctly and if users can add more answer fields. For Login, we make sure the email and password fields are there and that the login works with the right details. In the PlayJoin component, the tests check if the session ID and name fields show up, and if users are reminded to fill them in if they forget. We also test if errors are shown when something goes wrong, like failing to join a game session. Finally, for GameHistory, the test checks if users are told when there are no past sessions. These tests cover the main features users will interact with, helping to catch common issues and ensure the app runs smoothly.