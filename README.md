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

<img width="1440" alt="Screenshot 2025-02-25 at 5 50 45 PM" src="https://github.com/user-attachments/assets/b2bf546d-6aff-469c-bba5-cbe8c7a6c115" />
<img width="1440" alt="Screenshot 2025-02-25 at 5 50 33 PM" src="https://github.com/user-attachments/assets/aafaf02e-bf4d-4c9a-a013-cdf71aab68e5" />
<img width="1440" alt="Screenshot 2025-02-25 at 5 50 25 PM" src="https://github.com/user-attachments/assets/051a467f-21c3-406c-8a72-021f9c494fa7" />
<img width="1440" alt="Screenshot 2025-02-25 at 5 50 15 PM" src="https://github.com/user-attachments/assets/f5199ede-9d92-46a9-98c2-3397c10d6936" />
<img width="1440" alt="Screenshot 2025-02-25 at 5 49 53 PM" src="https://github.com/user-attachments/assets/d0cc60f7-c5b3-453c-b2ca-f233ab6895e8" />
<img width="1440" alt="Screenshot 2025-02-25 at 5 47 56 PM" src="https://github.com/user-attachments/assets/b0c72eff-0815-49e4-a8d9-4d92f04db4a3" />

