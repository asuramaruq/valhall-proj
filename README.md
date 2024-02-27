# Valorant Esports Hub
## Render was throwing an error
Sorry for 5sec late submission, render was throwing error on bcrypt node module for some unknown reason, so i had to swap it to bcryptjs

## Deployed Link
https://valhall-proj.onrender.com

## Installation guide
1. Clone the repository.
2. Use `npm install` command to install necessary dependencies.
3. Change API keys / server port / database in `.env` file, if you wish to do so.
4. Use `npm start` command to start the local server (by default on port 3000).
5. Head to http://localhost:3000/ from you browser (or http://localhost:(CUSTOM_PORT)/ if you changed the port in `.env` file) 

## User guide
### test user account ( username : user ; password : user )
1. Register a new account (skip if account already exists)
2. Login into the existing account
3. You can either go through the list of teams below or search specific team information
4. If you wish you can change the language of the output for the name and description of the teams using selector on the left side of navbar
5. If search, enter the specific name with no spelling/grammatic errors either on russian or english and press the button
6. If go through items, press More Info button under the specific team to get more information on them
7. If you wish to check you weekly horoscope proceed to Mystery tab
8. Enter your sign in english/lower case/no errors and press the button
9. If you wish conflip proceed to Mystery tab
10. Press the button to coinflip
11. If you wish to logout press the logout button on the navigation bar

## Admin guide
### base admin account ( username : olzhas ; password : admin )
1. Use already existing admin account to login into the admin panel
2. You can swap between teams and user control in the navigation bar to relative names
3. The list of the users provided on the page, as well as available actions
4. If you wish to create a new user, press "Add user" button and fill out the form
5. If you wish to edit existing user, press "Edit" button next to the relative user and fill out the form
6. If you wish to delete the existing user, press the "Delete" button next to the relative user
7. If you wish to create a new team, press "Add team" button and fill out the form
8. If you wish to edit existing team, press "Edit" button next to the relative team and fill out the form
9. If you wish to delete the existing team, press the "Delete" button next to the relative team
10. There might be a delay between server and your machine, so if changes did not appear on the page reload the page
11. If you wish to logout press the logout button on the navigation bar

## Dependencies
1. NodeJS
2. MongoDB
3. Bootstrap
4. Sweetalert2
5. ExpressJS
6. Express-session
7. EJS
8. Body-Parser
9. Dotenv
10. Axios
11. Morgan
12. Mongoose
13. BcryptJS

## API
1. RestAPI
2. HoroscopeAPI
3. CoinflipAPI
4. i18next
