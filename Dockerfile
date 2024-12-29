FROM node:22

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update \
  && apt-get install chromium -y \
  && apt-get install -y imagemagick \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Create update script
RUN echo '#!/bin/sh\nwhile true; do\n  node screenshot-updater.js\n  sleep 30\ndone' > /usr/src/app/update-screenshot.sh
RUN chmod +x /usr/src/app/update-screenshot.sh

# Create startup script
RUN echo '#!/bin/sh\n/usr/src/app/update-screenshot.sh &\nnode server.js' > /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

# Expose port
EXPOSE 3000

# Start both processes
CMD ["/usr/src/app/start.sh"]

