# Yaya Wallet Transactions Dashboard

A full-stack application that displays transaction data from the Yaya Wallet API with a clean, responsive interface.

## Overview

This solution implements a dashboard for viewing transactions from Yaya Wallet's API. It consists of:
- A React frontend for the user interface
- An Express.js backend that securely handles API authentication
- Client-side filtering and pagination for a smooth user experience

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
YAYA_API_KEY=Add the key You Gave us in the question.
YAYA_API_SECRET=Add the secret you gave us in the question.
YAYA_BASE_URL=Add the base url of the whole request endpoint either the GET or the POST you gave us in the question.
PORT=4000
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
VITE_BACKEND_BASE=http://localhost:4000

4. Start the development server: `npm run dev`

## Features

- **Transaction Display**: Shows transactions in a clean, responsive table
- **Account Selection**: Switch between different accounts to view their transactions
- **Search Functionality**: Filter transactions by sender, receiver, cause, or ID
- **Visual Indicators**: Clearly distinguishes between incoming and outgoing transactions
- **Pagination**: Navigate through transaction pages with easy-to-use controls
- **Responsive Design**: Works well on desktop, tablet, and mobile devices

## Security Considerations

- API credentials are stored securely on the backend server
- Environment variables are used to protect sensitive information
- The frontend never directly accesses the Yaya API, preventing exposure of credentials
- Proper authentication headers are generated for all API requests

## Assumptions

1. The application doesn't implement user authentication as per requirements
2. A fixed set of account names is provided for demonstration
3. All transactions are fetched initially and filtered client-side for simplicity
4. The API returns created_at_time as a Unix timestamp in seconds

## Testing

To test the application:
1. Start both the backend and frontend servers
2. Open the frontend in a browser (typically http://localhost:5173)
3. Select different accounts from the dropdown
4. Use the search field to filter transactions
5. Test pagination controls with different screen sizes

## Approach

1. **API Exploration**: First tested the Yaya API endpoints using Postman and a standalone Node.js script which is included as a separate folder named "test" check it out.
2. **Backend Implementation**: Created an Express server that handles authentication with Yaya's custom HMAC scheme.
3. **Frontend Development**: Built a React application with state management for filtering and pagination.
4. **UI Enhancement**: Focused on creating a clean, responsive interface that works across devices
5. **Security**: Ensured API credentials are never exposed to the client-side code

## Technical Details

- **Backend Framework**: Express.js with axios for API requests
- **Frontend Framework**: React with functional components and hooks
- **Authentication**: Custom HMAC-SHA256 signing as specified in Yaya's documentation
- **Styling**: Custom CSS with responsive design principles
- **Pagination**: Client-side implementation with configurable page size

## Extra Information

./Brainstorming Sketch Showcase.jpg
- Picture of a Sketch i made for the overall working of the webapp.

./Postman Testing Showcase.PNG
- Picture showcasing that i tested using postman.