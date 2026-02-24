# Swarajya Gatha

Swarajya Gatha is an educational board game designed to teach the history of Chhatrapati Shivaji Maharaj through interactive gameplay, quizzes, and historical event cards.

## Features

- **Single Player & Multiplayer**: Play solo against bots or challenge friends in real-time multiplayer mode.
- **Historical Event Cards**: Land on specific tiles to read about significant events in the life of Shivaji Maharaj.
- **Interactive Quizzes**: Test your knowledge to earn rewards (Gold, Silver, and Bronze coins).
- **Real-time Synchronization**: WebSocket-based multiplayer server for seamless game state sharing across players.
- **Dynamic Map**: A responsive SVG-based game board with player pawns.
- **Speech Synthesis**: Built-in audio narrative for historical event cards.

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js WebSocket (ws) server
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SwarajyaGatha-2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Start the WebSocket server (for multiplayer):
   ```bash
   node server.js
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to start playing.

## Development and Testing

### Unit Testing

The project includes a comprehensive unit testing suite for both the frontend components and the backend server logic.

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

#### Test Suite Coverage:
- **Components**: `FlashCard`, `QuizCard`, `Map`
- **Server**: `server.js` (including room management, movement logic, and coin rewards)

## Project Structure

- `app/`: Next.js app directory containing pages and components.
- `app/components/`: Reusable UI components like `Map`, `QuizCard`, and `FlashCard`.
- `server.js`: The WebSocket server implementation.
- `quizDetails.json`: Data for the historical quizzes.
- `eventDetails.json`: Data for the historical event cards.
- `jest.config.ts` & `jest.setup.ts`: testing configuration.

## License

This project is for educational purposes.
