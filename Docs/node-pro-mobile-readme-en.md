# NODE-PRO Mobile

NODE-PRO Mobile is a full-stack application for managing articles and inventory, featuring both web and mobile interfaces. The project is built with a microservices architecture, utilizing Node.js for the backend, and implements real-time updates via WebSockets.

## Features

- User authentication (register, login, logout)
- Article management (create, read, update, delete)
- AI-powered article creation
- Real-time updates using WebSockets
- Image upload and handling
- Responsive web interface
- User-friendly mobile app with dark mode support
- Search functionality
- Price Guessing Game

## New Feature: Price Guessing Game

The Price Guessing Game is a new feature that allows users to guess the price of randomly selected articles from the inventory. This game is implemented entirely on the frontend and uses locally stored article data for a smooth user experience.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- WebSocket (ws library)
- JWT for authentication
- Multer for file uploads
- Sharp for image processing

### Web Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API for HTTP requests

### Mobile Frontend

- React Native with Expo
- React Navigation
- Axios for API calls
- Expo SecureStore for token storage
- Expo ImagePicker for image selection
- AsyncStorage for local data storage

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB
- Expo CLI (for mobile development)

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/node-pro-mobile.git
   cd node-pro-mobile
   ```

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nodepro
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Web Frontend Setup

1. Navigate to the web frontend directory:

   ```
   cd ../frontend/web
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Update the `public/js/config.js` file with your backend server's URL if necessary.

4. Start the web server:

   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:8080` (or the port specified by your web server).

### Mobile Frontend Setup

1. Navigate to the mobile frontend directory:

   ```
   cd ../mobile/mobile-pro
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Update the `src/config/config.js` file with your backend server's IP address.

4. Start the Expo development server:

   ```
   npx expo start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code and run the app.

## Usage

### Web Application

1. Open the web application in your browser.
2. Register a new account or log in with existing credentials.
3. Use the navigation buttons to view, create, edit, or delete articles.
4. Enjoy real-time updates across all connected clients.

### Mobile Application

1. Open the mobile app using Expo Go.
2. Register a new account or log in with existing credentials.
3. Navigate through the app using the bottom tab navigation.
4. View, create, edit, or delete articles as needed.
5. Use the search functionality to find specific articles.
6. Play the Price Guessing Game by selecting it from the home screen.
7. Toggle between light and dark modes in the profile section.

## Project Structure

```
node-pro-mobile/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── web/
│   │   ├── public/
│   │   │   ├── js/
│   │   │   ├── index.html
│   │   │   └── style.css
│   │   └── package.json
│   └── mobile/
│       └── mobile-pro/
│           ├── src/
│           │   ├── components/
│           │   ├── screens/
│           │   ├── services/
│           │   ├── navigation/
│           │   └── config/
│           ├── App.js
│           └── app.json
└── README.md
```

## Key Design Patterns and Algorithms

1. **MVC Architecture**: The project follows a Model-View-Controller pattern, particularly in the backend structure.

2. **Observer Pattern**: Implemented through WebSockets for real-time updates.

3. **Singleton Pattern**: Used in the database connection and WebSocket server initialization.

4. **Factory Pattern**: Employed in creating API service instances.

5. **JWT Authentication**: Ensures secure user authentication and authorization.

6. **RESTful API Design**: The backend provides a RESTful API for CRUD operations on articles.

7. **Debounce Algorithm**: Implemented in the search functionality to optimize performance.

8. **Lazy Loading**: Used in the mobile app for efficient image loading and rendering.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
