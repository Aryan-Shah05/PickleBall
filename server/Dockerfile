FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port 4000
EXPOSE 4000

# Start development server
CMD ["npm", "run", "dev"] 