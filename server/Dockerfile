# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the entire project to the working directory
COPY . .


# Set the API's port number
EXPOSE 3001

# Specify the command to run on container start
CMD ["node", "index.js"]
