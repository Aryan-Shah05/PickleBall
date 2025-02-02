FROM node:18-alpine

WORKDIR /app

# Add necessary packages for building
RUN apk add --no-cache python3 make g++

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Generate Prisma Client (with explicit schema path)
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4002

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4002

# Start the server
CMD ["npm", "start"] 