# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.cjs ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src

EXPOSE 3000

CMD ["npm", "run", "debug"]

