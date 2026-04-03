# MLRIT Project Hub - Backend

This is the backend service for the MLRIT Project Hub. Built with Express.js.

## Getting Started

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health`: Health check endpoint.
- `GET /api/info`: Get project information.
