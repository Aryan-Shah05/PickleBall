# Pickleball Court Booking System

A modern, full-stack application for managing pickleball court bookings. Built with React, Node.js, Express, and PostgreSQL.

## Features

- 🏸 Real-time court availability
- 📅 Interactive booking calendar
- 💳 Secure payment processing
- 📱 Responsive design
- 🌦️ Weather integration
- 👥 User management
- 📊 Administrative dashboard

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- Socket.io for real-time updates
- Framer Motion for animations

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Socket.io for real-time events

## Prerequisites

- Docker and Docker Compose
- Node.js 20.x or later
- npm or yarn
- PostgreSQL 15 or later

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pickleball-booking
   ```

2. Start the development environment:
   ```bash
   docker-compose up
   ```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - PostgreSQL: localhost:5432

## Development

### Frontend Development

```bash
cd client
npm install
npm run dev
```

### Backend Development

```bash
cd server
npm install
npm run dev
```

### Database Migrations

```bash
cd server
npx prisma migrate dev
```

## Testing

### Running Frontend Tests

```bash
cd client
npm test
```

### Running Backend Tests

```bash
cd server
npm test
```

## Deployment

The application is containerized and can be deployed to any container orchestration platform.

1. Build the images:
   ```bash
   docker-compose build
   ```

2. Deploy to production:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Environment Variables

Create `.env` files in both client and server directories. Example variables:

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=ws://localhost:4000
```

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/pickleball
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 