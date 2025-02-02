FROM node:18-alpine

WORKDIR /app

# Add necessary packages for building
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

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