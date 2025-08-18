FROM node:18-alpine

# Install serve globally for production mode
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]