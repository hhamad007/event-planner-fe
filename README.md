# Event Planner Frontend

This is the frontend for the Event Planner web application, built with Next.js and React.

## Features

- User authentication (signup, login, logout)
- Event creation and management
- Dashboard with user profile and events
- Search and filter events
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/hhamad007/event-planner-frontend.git
cd event-planner-frontend
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add your backend API URL:

```
API_URL=https://event-planner-backend-d1lv.onrender.com/api
```

### Running Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
npm start
```

## Folder Structure

- `app/` - Next.js app directory (pages, layouts)
- `components/` - Reusable React components
- `context/` - React context for authentication
- `utils/` - Utility functions and API calls
- `public/` - Static assets

## Deployment

You can deploy this app on Vercel, Render, or any platform that supports Next.js.
