
Full Stack Project – Node.js (Backend) + React (Web) + React Native (Mobile)

This project consists of three parts:

- ⚙️ Backend: Built using Node.js.
- 💻 Web Frontend: Built using React.
- 📱 Mobile App: Built using React Native with Expo.

Project Structure:
/project-root
│
├── server/             # Node.js Server
│   └── app.js           # Entry point
│
├── web-app/                 # React Web App
│   └── src/
│
├── MyReactNativeApp/              # React Native App
|    |___ mobile-app
│          └── App.js

Running the Project Locally:

1. Backend - Node.js
    cd backend
    npm install
    node app.js

    ⚠️ Make sure to update all API routes in the frontend and mobile app to use your local IP address (http://<your-local-ip>:3001).

2. Web Frontend - React
    cd web
    yarn install
    yarn start

3. Mobile App - React Native (Expo)
    cd mobile
    npm install
    expo start

    ⚠️ Also make sure to use the correct local IP address for all API requests.

Environment Setup:

- Node.js (v14 or higher)
- Yarn (for the web frontend)
- npm (for backend and mobile)
- Expo CLI (install globally with: npm install -g expo-cli)
- Git (for version control and pushing to GitHub)

Auth Token:

- On login or signup, the token is stored in AsyncStorage (React Native).
- You can store it in LocalStorage or state in the web app.

Database:

- Mongoose is used for the database in the backend, allowing seamless communication between the Node.js server and the MongoDB database.
