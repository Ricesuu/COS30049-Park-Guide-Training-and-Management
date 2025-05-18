#!/bin/bash

# Setup script for Park Guide Training and Management Backend
echo "Setting up Park Guide Training and Management Backend..."

# Navigate to the backend-api directory
cd "$(dirname "$0")/backend-api"

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Run database setup (requires MySQL credentials)
echo "Setting up database..."
echo "Please enter your MySQL credentials:"
read -p "MySQL username: " mysql_user
read -sp "MySQL password: " mysql_password
echo ""
read -p "MySQL database name (default: parkguide): " mysql_db
mysql_db=${mysql_db:-parkguide}

# Run SQL setup scripts
echo "Running SQL setup scripts..."
mysql -u "$mysql_user" -p"$mysql_password" "$mysql_db" < ../backend/setup_all.sql

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "Creating .env.local file..."
  cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=$mysql_user
DB_PASSWORD=$mysql_password
DB_NAME=$mysql_db

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001

# Firebase configuration (replace with your own values)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
EOF
  echo ".env.local file created. Please update Firebase configuration manually."
fi

# Start the backend server
echo "Starting backend server..."
npm run dev

echo "Setup complete!"
