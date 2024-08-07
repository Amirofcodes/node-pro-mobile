# NODE-PRO Mobile: Detailed Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Backend Design](#3-backend-design)
4. [Web Frontend Design](#4-web-frontend-design)
5. [Mobile Frontend Design](#5-mobile-frontend-design)
6. [Database Schema](#6-database-schema)
7. [API Endpoints](#7-api-endpoints)
8. [Authentication and Security](#8-authentication-and-security)
9. [Real-time Communication](#9-real-time-communication)
10. [Image Handling](#10-image-handling)
11. [Performance Considerations](#11-performance-considerations)
12. [Testing Strategy](#12-testing-strategy)
13. [Deployment Guidelines](#13-deployment-guidelines)
14. [Future Enhancements](#14-future-enhancements)

## 1. Project Overview

NODE-PRO Mobile is a comprehensive article and inventory management system with both web and mobile interfaces. It's designed to provide real-time updates, secure authentication, and efficient CRUD operations on articles.

### Key Features:
- User authentication
- Article management (CRUD operations)
- Real-time updates
- Image upload and processing
- Search functionality
- Responsive web interface
- Native mobile app with dark mode support

## 2. System Architecture

The project follows a microservices architecture with the following components:

1. **Backend Service**: Node.js with Express.js
2. **Database**: MongoDB
3. **Web Frontend**: HTML5, CSS3, and Vanilla JavaScript
4. **Mobile Frontend**: React Native with Expo
5. **Real-time Communication**: WebSocket server

The backend service acts as the central hub, communicating with the database, handling WebSocket connections, and serving API requests from both web and mobile frontends.

## 3. Backend Design

### Technology Stack:
- Node.js
- Express.js
- MongoDB with Mongoose
- WebSocket (ws library)
- JWT for authentication
- Multer for file uploads
- Sharp for image processing

### Directory Structure:
```
backend/
├── models/
├── routes/
├── middleware/
├── services/
└── server.js
```

### Key Components:
1. **Models**: Mongoose schemas for User and Article
2. **Routes**: Express.js routes for handling API requests
3. **Middleware**: Authentication, error handling, and request processing
4. **Services**: Business logic and database operations
5. **WebSocket Server**: Handles real-time communications

### Design Patterns:
1. **MVC (Model-View-Controller)**: Separates data (Model), user interface (View), and business logic (Controller)
2. **Middleware Pattern**: For request processing and error handling
3. **Repository Pattern**: Encapsulates data access logic in service layer

## 4. Web Frontend Design

### Technology Stack:
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API for HTTP requests

### Directory Structure:
```
frontend/web/
├── public/
│   ├── js/
│   ├── index.html
│   └── style.css
└── package.json
```

### Key Features:
1. **Responsive Design**: Adapts to different screen sizes
2. **Dynamic Content Loading**: Uses JavaScript to update the DOM
3. **Real-time Updates**: WebSocket connection for live data
4. **Form Handling**: Client-side validation and AJAX submissions

### Design Patterns:
1. **Module Pattern**: Organizes JavaScript code into modules
2. **Observer Pattern**: For WebSocket event handling
3. **Factory Pattern**: Creates service objects for API calls

## 5. Mobile Frontend Design

### Technology Stack:
- React Native
- Expo
- React Navigation
- Axios for API calls

### Directory Structure:
```
frontend/mobile/mobile-pro/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── navigation/
│   └── config/
├── App.js
└── app.json
```

### Key Features:
1. **Native UI Components**: Utilizes React Native's core components
2. **Navigation**: Tab-based and stack navigation
3. **State Management**: React hooks for local state management
4. **Dark Mode**: Theme switching capability
5. **Image Picker**: Integration with device camera and gallery

### Design Patterns:
1. **Presentational and Container Components**: Separates logic from UI
2. **Higher-Order Components**: For shared functionality (e.g., authentication checks)
3. **Render Props**: For component composition and logic sharing

## 6. Database Schema

### User Schema:
```javascript
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Article Schema:
```javascript
{
  nom: { type: String, required: true },
  codeArticle: { type: String, required: true, unique: true },
  description: { type: String },
  image: {
    data: Buffer,
    contentType: String
  },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

## 7. API Endpoints

1. **Authentication**:
   - POST `/api/auth/register`: User registration
   - POST `/api/auth/login`: User login

2. **Articles**:
   - GET `/api/articles`: Fetch all articles
   - GET `/api/articles/:id`: Fetch a specific article
   - POST `/api/articles`: Create a new article
   - PUT `/api/articles/:id`: Update an article
   - DELETE `/api/articles/:id`: Delete an article
   - GET `/api/articles/:id/image`: Fetch article image
   - GET `/api/articles/search/:codeArticle`: Search article by code

## 8. Authentication and Security

1. **JWT (JSON Web Tokens)**: Used for user authentication
2. **Password Hashing**: Bcrypt for secure password storage
3. **Input Validation**: Server-side validation of user inputs
4. **CORS**: Configured to allow requests only from trusted origins
5. **Secure Headers**: Implement security headers (e.g., Helmet middleware)

## 9. Real-time Communication

1. **WebSocket Server**: Implemented using the `ws` library
2. **Event Types**:
   - `newArticle`: Broadcast when a new article is created
   - `updateArticle`: Broadcast when an article is updated
   - `deleteArticle`: Broadcast when an article is deleted
3. **Reconnection Logic**: Implemented on the client-side to handle disconnections

## 10. Image Handling

1. **Upload**: Multer middleware for handling multipart/form-data
2. **Processing**: Sharp library for image resizing and optimization
3. **Storage**: Images stored in MongoDB as Buffer data
4. **Serving**: Dedicated endpoint for serving article images

## 11. Performance Considerations

1. **Database Indexing**: On frequently queried fields (e.g., `codeArticle`)
2. **Pagination**: Implement for large datasets in article listing
3. **Caching**: Consider implementing Redis for frequently accessed data
4. **Lazy Loading**: In mobile app for efficient image loading
5. **Debouncing**: Implemented in search functionality to reduce API calls

## 12. Testing Strategy

1. **Unit Testing**: Jest for testing individual functions and components
2. **Integration Testing**: Supertest for API endpoint testing
3. **End-to-End Testing**: Detox for mobile app testing
4. **Continuous Integration**: Setup with GitHub Actions or similar service

## 13. Deployment Guidelines

1. **Backend**: Deploy to a Node.js hosting service (e.g., Heroku, DigitalOcean)
2. **Database**: Use MongoDB Atlas for managed database hosting
3. **Web Frontend**: Deploy to a static site hosting service (e.g., Netlify, Vercel)
4. **Mobile App**: Publish to App Store and Google Play Store
5. **Environment Variables**: Use for sensitive configuration in production
6. **SSL/TLS**: Ensure all communications are encrypted in production

## 14. Future Enhancements

1. Implement user roles and permissions
2. Add data analytics and reporting features
3. Integrate barcode scanning in the mobile app
4. Implement offline mode with data synchronization
5. Add push notifications for important updates
6. Implement a more robust state management solution (e.g., Redux) if the app complexity increases

This documentation provides a comprehensive overview of the NODE-PRO Mobile project's technical aspects. It serves as a guide for developers working on the project and can be updated as the project evolves.
