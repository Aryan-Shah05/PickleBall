# PickleBall Court Booking System

A modern web application for managing pickleball court bookings, built with React, Node.js, and PostgreSQL.

## Features

- User Authentication
- Court Booking System
- Real-time Updates
- Admin Dashboard
- Payment Integration
- Responsive Design

## Tech Stack

### Frontend
- React with TypeScript
- Material UI & Tailwind CSS
- React Query
- Zustand for State Management
- Socket.io Client

### Backend
- Node.js & Express
- PostgreSQL with Prisma ORM
- TypeScript
- JWT Authentication
- Socket.io

### DevOps
- Docker
- Nginx
- GitHub Actions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aryan-Shah05/PickleBall.git
cd PickleBall
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

4. Start development servers:
```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm run dev
```

## Development

### Running with Docker
```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

### Database Migrations
```bash
cd server
npx prisma migrate dev
```

## Testing
```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License.
