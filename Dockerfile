# Stage 1: Build the React application
FROM node:14 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve the React application using serve
FROM node:14

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the build directory from stage 1
COPY --from=build /app/build ./build

# Set the command to run serve
CMD ["serve", "-s", "build", "-l", "80"]
