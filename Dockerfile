# Development stage
FROM node:16-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install nest CLI globally
RUN npm i -g @nestjs/cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Generate prisma client
RUN npm run build

# Production stage
FROM node:16-alpine As production

# Set node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app

# Install nest CLI globally
RUN npm i -g @nestjs/cli

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --only=production

# Copy built application
COPY --from=development /usr/src/app/dist ./dist

# Copy necessary configuration files
COPY --from=development /usr/src/app/nest-cli.json .
COPY --from=development /usr/src/app/tsconfig.json .

# Start the application
CMD ["node", "dist/main"]