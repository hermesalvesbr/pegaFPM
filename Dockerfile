# Use the official Node.js 14 image as the base image
FROM node:20-slim

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install axios csv-parser async @types/async

# Copy the rest of the code to the working directory
COPY . .

# Compile the TypeScript code
RUN npx tsc scrape.ts

# Set the command to run your application
CMD [ "node", "scrape.js" ]