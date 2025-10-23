# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (all for dev)
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 5050

# Use Nodemon in dev mode
CMD ["npm", "run", "dev"]
