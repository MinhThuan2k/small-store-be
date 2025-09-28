
# Use official Node.js 20 LTS image
FROM node:20-alpine

# Install git and curl
RUN apk update && apk add --no-cache git curl nano

# Set working directory inside the container
WORKDIR /clone-jira-backend

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install dependencies
RUN npm install

# PM2 is a process manager for Node.js
RUN npm install -g pm2

# Copy the rest of your application
COPY . .

# Generate DB with Prisma
RUN npm run db:generate

# Build the application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the app with PM2
CMD ["pm2-runtime", "dist/main.js", "--name", "jira-be"]

