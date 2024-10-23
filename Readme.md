# Recipe Sharing Community - Backend Server

This is the backend server for the **Recipe Sharing Community**, a full-stack web application designed to bring together cooking enthusiasts. The backend API is built with Node.js, Express.js, and MongoDB, providing secure user authentication, recipe management, and social features like commenting and rating.

## Live API
- **Backend Server (API):** [Recipe Nest Server](https://recipe-nest-serever.vercel.app/)

## Repository
- **Backend Code:** [GitHub - Recipe Nest Server](https://github.com/hrhabib07/recipe-nest-server)

## Features

- **Authentication & Authorization:**
  - User registration and login using JWT (JSON Web Tokens).
  - Secure session management with token expiration.

- **Recipe Management:**
  - API endpoints for creating, reading, updating, and deleting recipes.
  - Recipe data includes ingredients, cooking instructions, preparation time, and categories.

- **User Interactions:**
  - Commenting system for users to leave feedback on recipes.
  - Rating system for upvoting or downvoting recipes.
  - Follow/Unfollow users to track their posted recipes.

- **Subscription and Payments:**
  - Integration with **Stripe** for handling subscription-based premium features.
  - Membership system that unlocks exclusive content for paid users.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Lightweight framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing recipe and user data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Stripe**: Payment gateway integration for handling subscriptions.



## Getting Started

### Prerequisites
To run the backend server locally, ensure you have the following installed:
- Node.js
- MongoDB
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hrhabib07/recipe-nest-server
   cd recipe-nest-server
